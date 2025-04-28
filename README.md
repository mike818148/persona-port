## Description

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

Persona Port is an AI-powered chatbot platform designed to help professionals create personalized digital assistants. These assistants can effectively showcase your professional background, skills, and experience to potential employers, recruiters, or visitors, providing an engaging and interactive way to present your professional profile.

## Environment Variables

Please prepare the .env file as below:

```bash
# Postgres (Initiate from Vercel)
POSTGRES_URL="postgres://username:password@host:port/database?sslmode=require&supa=base-pooler.x"
POSTGRES_PRISMA_URL="postgres://username:password@host:port/database?sslmode=require&supa=base-pooler.x"
SUPABASE_URL="https://your-project-id.supabase.co"
NEXT_PUBLIC_SUPABASE_URL="https://your-project-id.supabase.co"
POSTGRES_URL_NON_POOLING="postgres://username:password@host:port/database?sslmode=require"
SUPABASE_JWT_SECRET="your-jwt-secret"
POSTGRES_USER="postgres"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-supabase-anon-key"
POSTGRES_PASSWORD="your-password"
POSTGRES_DATABASE="postgres"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"
POSTGRES_HOST="db.your-project-id.supabase.co"
SUPABASE_ANON_KEY="your-supabase-anon-key"

# OpenAI
OPENAI_API_KEY="your-openai-api-key"

# Deepseek
DEEPSEEK_API_KEY="your-deepseek-api-key"

# AUTH_KEY
AUTH_KEY="your-auth-key"
```

## Getting Started

First, install all the dependencies:

```bash
pnpm install
```

Second run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
