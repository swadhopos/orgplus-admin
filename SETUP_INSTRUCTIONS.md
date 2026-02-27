# OrgPlus Admin - Setup Instructions

## Quick Start

1. **Install dependencies**:
```bash
npm install
```

This will install all required packages including:
- vite
- @vitejs/plugin-react
- @types/node
- And all other dependencies

2. **Configure environment variables**:
```bash
cp .env.example .env
```

Then edit `.env` and add your Firebase configuration.

3. **Start development server**:
```bash
npm run dev
```

The app will be available at http://localhost:5173

## Troubleshooting

### TypeScript errors in vite.config.ts
If you see errors like "Cannot find module 'vite'", run:
```bash
npm install
```

These errors appear because the dependencies haven't been installed yet.

### Firebase configuration errors
Make sure all Firebase environment variables are set in `.env`:
- VITE_FIREBASE_API_KEY
- VITE_FIREBASE_AUTH_DOMAIN
- VITE_FIREBASE_PROJECT_ID
- VITE_FIREBASE_STORAGE_BUCKET
- VITE_FIREBASE_MESSAGING_SENDER_ID
- VITE_FIREBASE_APP_ID
- VITE_API_BASE_URL

## Files Fixed

✅ **src/lib/api.ts** - Fixed TypeScript header typing issues
✅ **vite.config.ts** - Fixed __dirname usage for ES modules
✅ **src/vite-env.d.ts** - Added type definitions for import.meta.env
✅ **tsconfig.json** - Added Node types
✅ **package.json** - Added @types/node dependency

All TypeScript errors are now resolved!
