# BitGold Fintech Investment App - Project Overview

This project is a fintech investment application named "BitGold", built as a full-stack solution. It leverages Convex for its backend services, including database, serverless functions, and authentication, and a React application with Vite for the frontend. The application aims to allow users to automatically invest spare change into physical gold, offering features like a homepage, portfolio management, and transaction history.

## Key Technologies

*   **Frontend:**
    *   **Framework:** React
    *   **Build Tool:** Vite
    *   **Language:** TypeScript
    *   **Styling:** Tailwind CSS
    *   **UI Components:** Custom components within `src/components/ui`, `sonner` for toasts.
    *   **Client-side Routing:** Simple state-based routing for `home`, `portfolio`, and `history` pages.
*   **Backend:**
    *   **Platform:** Convex.dev (serverless backend, database, real-time updates)
    *   **Authentication:** Convex Auth (anonymous authentication by default, configurable).
    *   **Language:** TypeScript (for Convex functions and schema)

## Architecture

The application follows a client-server architecture:
*   The **frontend** is a Single-Page Application (SPA) built with React and bundled by Vite. It communicates with the Convex backend for data persistence and authentication.
*   The **backend** is hosted on Convex.dev, providing an API for the frontend. It defines database schemas, authentication configurations, and serverless functions (`convex/*.ts`).

## Project Structure

*   `src/`: Contains the frontend React application code.
    *   `src/App.tsx`: Main application component, handles page routing and authentication status.
    *   `src/main.tsx`: Entry point for the React application, initializes Convex client and provider.
    *   `src/components/ui/`: Reusable UI components.
    *   `src/pages/`: Page-level components (`HomePage`, `PortfolioPage`, `HistoryPage`).
    *   `src/app/`: Contains Next.js-like directory structure with `layout.tsx` and `page.tsx`, indicating a potential future or partial integration with Next.js patterns, though Vite is the primary frontend bundler.
*   `convex/`: Contains the backend code for Convex.dev.
    *   `convex/schema.ts`: Defines the database schema, including authentication tables.
    *   `convex/auth.config.ts`: Configures Convex authentication providers.
    *   `convex/http.ts`, `convex/router.ts`: Define HTTP endpoints for the Convex backend.
*   `public/`: Static assets.
*   `vite.config.ts`: Vite build configuration for the frontend.
*   `package.json`: Manages project dependencies and scripts.

## Building and Running

### Development

To start the frontend and backend development servers:

```bash
npm run dev
```

This command concurrently runs:
*   `vite --open`: Starts the frontend development server and opens the application in your browser.
*   `convex dev`: Starts the Convex development server, syncing local changes to your Convex deployment.

### Building for Production

To build the frontend for production:

```bash
npm run build
```

This command uses Vite to create an optimized production build of the React application.

### Linting and Type Checking

To run linting and type checking across the project:

```bash
npm run lint
```

This command performs TypeScript type checking for both Convex backend code and frontend code, and also runs `convex dev --once` (presumably for schema validation or similar) and `vite build` (which also includes type checking).

## Development Conventions

*   **Code Formatting:** The presence of `prettier` in `devDependencies` suggests code formatting is maintained with Prettier.
*   **Type Safety:** Heavy use of TypeScript throughout the project emphasizes type safety.
*   **Convex Integration:** Adherence to Convex's patterns for defining schema, functions, and authentication is evident.
*   **Environment Variables:** Configuration via `.env.local` and `import.meta.env` for frontend, and `process.env` for backend (e.g., `VITE_CONVEX_URL`, `CONVEX_SITE_URL`).
*   **Component Structure:** Frontend components are organized into `components/ui` for reusable elements and `pages` for full-page layouts.
