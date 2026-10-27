# Frontend Client - Alumni Connect Portal

This is the React 19 single-page application (SPA) client for the College Alumni Connect Portal.

## Tech Stack
- **Framework**: React 19 + TypeScript
- **Styling**: Tailwind CSS v4
- **Animation**: Motion (Framer Motion engine)
- **Icons**: Lucide React
- **Build Tool**: Vite

## Project Structure
```text
client/
├── src/
│   ├── components/      # UI components (directory, profile, mentorship, jobs, events, admin, layout)
│   ├── context/         # AuthContext and state providers
│   ├── pages/           # Routed views (Home, Directory, Profile, Jobs, Events, Admin, Privacy, etc.)
│   ├── services/        # API client and REST fetch wrappers
│   ├── types/           # TypeScript data interfaces and contracts
│   ├── App.tsx          # Root app component and route mapping
│   ├── main.tsx         # React DOM entry point
│   └── index.css        # Tailwind styles & theme variables
├── public/              # Static assets and icons
├── index.html           # HTML5 entry template
├── vite.config.ts       # Vite configuration with Tailwind plugin
└── package.json         # Frontend dependencies and dev scripts
```

## Running Standalone
```bash
cd client
npm install
npm run dev
```

The frontend will run at `http://localhost:5173` and communicate with the backend REST API on `http://localhost:3000`.
To run full-stack together in a single command, see the root repository `README.md`.
