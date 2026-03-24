import { NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";
import { fetchWithCredentials } from "@/lib/fetchWithCredentials";

const credentialsSchema = z.object({
  email: z.string().min(1),
  password: z.string().min(6),
});

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    Credentials({
      id: 'signin-credential',
      name: 'SigninCredential',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        try {
          const parsed = credentialsSchema.parse(credentials);

          const res = await fetchWithCredentials(`/login`, {
            method: 'POST',
            body: JSON.stringify(parsed),
            noToken: true // 登录接口不需要携带token
          })
          if (!res.ok) {
            return null;
          }

          const data = await res.json();
          console.log("Login response data:", data);

          const { id, firstName, lastName, email } = data?.user || {};
          const requestToken: string = data?.requestToken || '';
          const expiresIn: number = data?.expiresIn || 0;
          return {
            id,
            email,
            firstName,
            lastName,
            requestToken,
            expiresIn
          };
        } catch (error) {
          console.error('[next-auth][signin] authorize error:', error);
          return null;
        }
      },
    }),
    Credentials({
      id: 'sso',
      name: 'SSO',
      credentials: {
        tempCode: { label: 'TempCode', type: 'text' },
      },
      async authorize(credentials) {
        if (!credentials?.tempCode) {
          return null;
        }

        try {
          // 这里应该调用SSO登录的后端接口，使用tempCode换取用户信息和requestToken
          // 下面是一个模拟的示例，实际情况请根据你的SSO登录接口进行调整
          // const tempCode = credentials.tempCode;
          // 模拟调用SSO接口
          // const response = await fetch('/api/sso/login', {
          //   method: 'POST',
          //   headers: { 'Content-Type': 'application/json' },
          //   body: JSON.stringify({ tempCode,redirectUri: process.env.NEXTAUTH_URL + '/sso-callback' })
          // });
          // const userData = await response.json();
          // return userData;

          return null;
        } catch (error) {
          return null
        }
      },
    }),
  ],
  pages: {
    signIn: process.env.BASE_PATH + '/auth/signin',
  },
  session: {
    strategy: 'jwt',
    maxAge: 8 * 60 * 60, // 8 hours
  },
  useSecureCookies: process.env.NODE_ENV === 'production',
  debug: process.env.NODE_ENV === 'development',
  cookies: {
    sessionToken: {
      name: process.env.NODE_ENV === 'production' ? '__Secure-next-auth.session-token' : 'next-auth.session-token',
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production'
      }
    }
  },
  callbacks: {
    jwt({ token, user }) {
      if (token.exp && Date.now() >= Number(token.exp) * 1000) {
        console.warn('JWT token has expired!')
        // return null or a minimal token to force re-auth
      }

      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.firstName = user.firstName;
        token.lastName = user.lastName;
        token.name = user.firstName + ' ' + user.lastName
        token.requestToken = user.requestToken;
        if (user.expiresIn) {
          token.exp = Math.floor(Date.now() / 1000 + Number(user.expiresIn))
        }
      }

      return token;
    },
    session({ session, token }) {
      if (token) {
        session.user = {
          ...session.user,
          id: token.id as string,
          email: token.email as string,
          firstName: token.firstName as string,
          lastName: token.lastName as string,
          name: token.firstName + ' ' + token.lastName,
        };
        if (token.exp) {
          session.expires = new Date(token.exp * 1000).toISOString();
        }
      }

      return session;
    },
  },
  events: {
    async signIn({ user, isNewUser }) {
      console.log(user, isNewUser)
    },
    async signOut({ token }) {
      console.log(token)
    },
    async session({ session }) {
      console.log(session)
    }
  }
};
