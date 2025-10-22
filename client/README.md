# SurfTurf Frontend

This is the React frontend application for SurfTurf, built with Vite and TypeScript.

## Features

- Modern React with TypeScript
- Responsive design with Tailwind CSS
- User authentication and authorization
- Turf browsing and booking
- Admin dashboard
- Real-time chatbot
- Mobile-friendly interface

## Tech Stack

- React 18
- TypeScript
- Vite
- React Router DOM
- Tailwind CSS
- Axios for API calls
- React Hot Toast for notifications
- PrimeReact components
- Flowbite React components

## Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Build for production:
```bash
npm run build
```

## Project Structure

```
src/
├── components/          # Reusable components
│   └── customer/       # Customer-specific components
├── contexts/           # React contexts (Auth, etc.)
├── pages/             # Page components
│   ├── customer/      # Customer pages
│   └── admin/         # Admin pages
├── App.tsx            # Main app component
├── main.tsx           # Entry point
└── index.css          # Global styles
```

## Key Features

### Authentication
- Login/Signup forms
- Protected routes
- User context management
- JWT token handling

### Customer Features
- Browse turfs by location
- View turf details
- Book time slots
- Save favorite turfs
- View booking history
- Leave reviews

### Admin Features
- Add/edit turfs
- Manage bookings
- Add new owners
- View analytics

### Chatbot
- AI-powered assistance
- Real-time chat interface
- Help with bookings and queries

## Environment Variables

The frontend connects to the backend API running on `http://localhost:5000` by default. This is configured in `vite.config.ts`.

## API Integration

All API calls are made to the backend server using Axios. The base URL is configured to proxy requests to the backend server.

## Styling

The application uses Tailwind CSS for styling with custom CSS variables for theming. The design is fully responsive and mobile-friendly.

## Development

1. Start the backend server first (see server/README.md)
2. Start the frontend development server
3. The application will be available at `http://localhost:3000`

## Building for Production

```bash
npm run build
```

The built files will be in the `dist/` directory.
