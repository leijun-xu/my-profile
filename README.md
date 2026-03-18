# my-profile

platform for managing my resume，share my blog in the future.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.sample .env.local
# Edit .env.local and set NEXTAUTH_SECRET

# Start development server
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)


## 🛠️ Tech Stack

- **Next.js 16** - App Router with Server Components
- **TypeScript** - Type-safe development
- **Tailwind CSS 3** - Utility-first styling
- **Radix UI** - Accessible components
- **NextAuth.js v5** - Authentication
- **Zod** - Schema validation

## 📁 Project Structure

```
src/
├── app/              # Next.js pages and routes
├── components/       # React components
├── lib/             # Utilities and helpers
├── types/           # TypeScript types
├── proxy.ts         # Route protection
└── auth.ts          # Authentication config
```

## 🎨 Design System

Built with **Corporate Trust** aesthetic:
- Primary: Indigo 600 (#4F46E5)
- Secondary: Violet 600 (#7C3AED)
- Accent: Emerald 500 (#10B981)

All colors meet WCAG AA standards.

## 📝 Environment Variables

See `.env.sample` for all configuration options.

Required:
- `NEXTAUTH_URL` - Application URL
- `NEXTAUTH_SECRET` - NextAuth secret key
- `BACKEND_API_URL` - Backend API endpoint

