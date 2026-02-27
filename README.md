# OrgPlus Admin Portal

Super admin portal for managing organizations in the OrgPlus multi-tenant system.

## Features

- Dark mode by default (with light mode toggle)
- Firebase Authentication
- Organization management (CRUD)
- Organization admin user creation
- Responsive design with Tailwind CSS

## Prerequisites

- Node.js 18+
- Firebase project configured
- OrgPlus backend server running

## Setup

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables:
```bash
cp .env.example .env
```

Edit `.env` and set your Firebase configuration:
- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`
- `VITE_API_BASE_URL` (default: http://localhost:5000/api)

3. Start the development server:
```bash
npm run dev
```

The app will be available at http://localhost:5173

## Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Project Structure

```
orgplus-admin/
├── src/
│   ├── contexts/        # React contexts (Auth, Theme)
│   ├── lib/             # Utilities (Firebase, API client)
│   ├── pages/           # Page components
│   ├── types/           # TypeScript type definitions
│   ├── App.tsx          # Main app component with routing
│   ├── main.tsx         # Entry point
│   └── index.css        # Global styles
├── public/              # Static assets
└── index.html           # HTML template
```

## Usage

### Login
1. Navigate to http://localhost:5173/login
2. Sign in with system admin credentials (created via bootstrap endpoint)

### Create Organization
1. Click "Create Organization" button on dashboard
2. Fill in organization details
3. Submit to create

### Create Organization Admin
1. View organization details
2. Click "Create Admin" button
3. Enter email and password
4. Admin user will be created with access to that organization

## Theme

The admin portal uses dark mode by default. Users can toggle to light mode using the theme toggle button in the header.

## API Integration

The portal communicates with the OrgPlus backend API. Ensure the backend server is running and the `VITE_API_BASE_URL` is correctly configured.

All API requests automatically include the Firebase authentication token in the Authorization header.
