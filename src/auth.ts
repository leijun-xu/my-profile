import { NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";

const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  firstName: z.string().min(1).max(6),
  lastName: z.string().min(1).max(6)
})

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    Credentials({
      id: 'signin-credential',
      name: 'SigninCredential',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
        firstName: { label: 'FirstName', type: 'text' },
        lastName: { label: 'LastName', type: 'text' },
      },
      async authorize(credentials) {
        try {
          const requestToken: string = await new Promise(resolve => {
            setTimeout(() => { resolve(Date.now() + '') }, 1000)
          })
          const { email, password, firstName, lastName } = credentialsSchema.parse(credentials);
          if (email && firstName && lastName && password) {
            return { id: email, email, firstName, lastName, requestToken }
          }
          return null;
        } catch (error) {
          return null
        }
      },
    }),
  ],
  pages: {
    signIn: '/auth/signin',
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
