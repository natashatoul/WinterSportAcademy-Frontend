# WinterSportAcademy Frontend

React SPA for WinterSportAcademy coursework project.

## Overview

This frontend provides:
- trainee registration and login
- viewing training sessions, instructors, and equipment
- equipment rent flow for trainees
- trainee personal registrations page
- protected admin panel with CRUD tabs

## Tech Stack

- React 19
- Vite
- React Router
- Axios
- Bootstrap 5
- Vitest + Testing Library
- ESLint

## Project Structure

```text
src/
  components/        # reusable UI pieces (Navbar)
  context/           # auth provider + hooks
  hooks/             # reusable custom hooks (useApiList)
  pages/             # route pages
  pages/admin/       # admin tabs (Trainees/Instructors/Equipment/Sessions/Registrations)
  services/          # API client configuration
```

## Requirements

- Node.js 18+ (recommended 20+)
- npm

## Installation

```bash
npm install
```

## Run Locally

```bash
npm run dev
```

Default Vite URL: `http://localhost:5173`

## Backend API

Current API base URL is configured in:

`src/services/api.js`

```js
baseURL: 'http://localhost:5011/api'
```

Make sure backend is running before using the app.

## Available Scripts

- `npm run dev` - start development server
- `npm run build` - build production bundle
- `npm run preview` - preview production build
- `npm run lint` - run ESLint
- `npm run test` - run unit tests
- `npm run test:watch` - run tests in watch mode
- `npm run test:ui` - run tests with UI

## Routing

- `/` - training sessions
- `/login` - login page
- `/register` - registration page
- `/equipment` - equipment list / rent flow
- `/instructors` - instructors list
- `/my-registrations` - trainee registrations
- `/admin` - admin panel (protected, Admin role only)

## Authentication and Roles

- JWT token is stored in `localStorage`
- Auth state is managed via React Context
- Admin route is protected by role check

## Admin Panel

Admin tabs include:
- Trainees (CRUD, includes Trainee ID)
- Instructors (CRUD)
- Equipment (CRUD)
- Sessions (CRUD + enroll trainee)
- Registrations (list, confirm/unconfirm, delete)

## Testing

Unit tests are written with Vitest and Testing Library.

Run:

```bash
npm run test -- --run
```

## Coursework Notes

- Responsive layout implemented with Bootstrap and media queries
- API error states and loading states are shown in pages
- Frontend follows modular structure and separates UI/state/API logic
