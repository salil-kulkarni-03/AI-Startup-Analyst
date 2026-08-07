# Infinity - AI Startup Analyst Platform

AI-powered startup analysis platform helping investors make smarter, faster decisions.

## Features

✅ **Complete Authentication System**
- Phone number support in signup and login
- Profile management with phone number
- Session persistence

✅ **Dark Blue Color Scheme**
- Custom colors: #161b2c, #111932, #171c92, #13182a
- Consistent styling across all pages
- Professional, minimal design

✅ **Full Platform Features**
- Landing page with scroll animations
- Dashboard with upload management
- Multi-type uploads (Documents, Pitch Decks, Founder Calls)
- Real-time analysis status tracking
- Detailed analysis reports with charts
- Download and email reports
- AI chatbot widget

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Landing page (/)
│   ├── login/             # Login page (/login)
│   ├── dashboard/         # Dashboard (/dashboard)
│   ├── upload/            # Upload page (/upload)
│   ├── reports/           # Reports page (/reports)
│   └── analysis/[id]/     # Analysis detail (/analysis/:id)
├── components/            # React components
│   ├── ui/               # Shadcn UI components
│   └── ...               # Page components
├── lib/                  # Utilities
│   ├── auth.ts          # Authentication logic
│   └── uploads.ts       # Upload management
└── styles/
    └── globals.css      # Tailwind CSS + custom styles
```

## Technologies

- **Next.js 14** - React framework with App Router
- **React 18** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS v4** - Styling
- **Shadcn/ui** - UI component library
- **Recharts** - Data visualization
- **Lucide React** - Icons
- **Sonner** - Toast notifications

## Routes

- `/` - Landing page
- `/login` - Login/Signup
- `/dashboard` - Main dashboard (protected)
- `/upload` - Upload documents (protected)
- `/reports` - View reports (protected)
- `/analysis/:id` - Detailed analysis (protected)

## Authentication

- Uses localStorage for client-side session management
- Phone number required for signup
- Phone number optional for login
- Profile management includes phone number editing

## Color Palette

- Primary Dark: #070b18
- Dark Blue 1: #161b2c
- Dark Blue 2: #111932
- Dark Blue 3: #171c92
- Dark Blue 4: #13182a
- Accent Blue: #8b9bd7

## Development Notes

- All page components use `'use client'` directive
- Protected routes check authentication on mount
- Navigation uses Next.js App Router
- State managed with React hooks + localStorage

---

Built with ❤️ for modern startup investors
