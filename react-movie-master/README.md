# Sky Movies - Movie Booking Platform

A modern, full-featured movie booking and streaming platform built with React. Browse movies, book theatre tickets, discover streaming options, and manage your watchlist.

## Features

### 🎬 Movie Discovery
- Browse movies currently in theatres
- Explore upcoming releases
- Search movies by title, genre, or language
- Filter by genre, language, rating, and release date
- View detailed movie information with cast, trailers, and ratings

### 🎫 Theatre Booking
- Select city, area, and theatre
- Choose showtimes and dates
- Interactive seat selection
- Real-time price calculation
- Secure payment processing with Razorpay
- Download tickets as PDF with QR codes

### 📺 Streaming Integration
- Discover where to watch movies online
- OTT platform links (Netflix, Amazon Prime, etc.)
- Streaming availability information

### 📋 Watchlist Management
- Add movies to watchlist
- Save coming soon movies
- Quick access to saved movies
- Watchlist preview on homepage

### 👤 User Features
- Clerk authentication (sign up/sign in)
- View booking history
- Download tickets and invoices
- Share booking details
- User profile management

## Tech Stack

- **React 18** - UI framework
- **React Router v6** - Navigation
- **SCSS** - Styling
- **TMDB API** - Movie data
- **Clerk** - Authentication
- **Razorpay** - Payment gateway
- **jsPDF** - PDF generation
- **QR Code** - Ticket QR codes

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- TMDB API key
- Clerk account (for authentication)
- Razorpay account (for payments)

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd react-movie-master
```

2. Install dependencies
```bash
npm install
# or
yarn install
```

3. Create environment file
```bash
cp .env.example .env
```

4. Configure environment variables
```env
REACT_APP_TMDB_API_KEY=your_tmdb_api_key
REACT_APP_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
REACT_APP_RAZORPAY_KEY_ID=your_razorpay_key_id
REACT_APP_BACKEND_URL=http://localhost:5001
```

5. Start development server
```bash
npm start
# or
yarn start
```

The app will open at `http://localhost:3000`

## Project Structure

```
react-movie-master/
├── public/              # Static files
├── src/
│   ├── api/            # API clients (TMDB, Backend)
│   ├── assets/         # Images, fonts, icons
│   ├── components/     # Reusable components
│   │   ├── button/
│   │   ├── movie-card/
│   │   ├── header/
│   │   ├── footer/
│   │   └── ...
│   ├── pages/          # Page components
│   │   ├── Home.jsx
│   │   ├── TheatreMovies.jsx
│   │   ├── OnlineMovies.jsx
│   │   ├── Detail.jsx
│   │   ├── BookingConfirmation.jsx
│   │   └── ...
│   ├── routes/         # Route configuration
│   ├── scss/           # Global styles
│   ├── utils/          # Utility functions
│   └── constants/      # App constants
├── package.json
└── README.md
```

## Available Scripts

### `npm start`
Runs the app in development mode at `http://localhost:3000`

### `npm build`
Builds the app for production to the `build` folder

### `npm test`
Launches the test runner

## Key Features Implementation

### Movie Grid with Load More
- Responsive grid layout
- Pagination with "Load More" button
- Filters and search integration
- Coming Soon: 30 movies limit
- Now Playing: 40 movies limit

### Booking Flow
1. Select movie → Book Ticket
2. Choose city, area, and theatre
3. Select date and showtime
4. Choose seats
5. Review and pay
6. Download ticket with QR code

### PDF Generation
- Professional ticket PDFs
- Invoice PDFs with tax breakdown
- QR code integration
- Branded with Sky Movies

## Environment Variables

| Variable | Description |
|----------|-------------|
| `REACT_APP_TMDB_API_KEY` | TMDB API key for movie data |
| `REACT_APP_CLERK_PUBLISHABLE_KEY` | Clerk publishable key for auth |
| `REACT_APP_RAZORPAY_KEY_ID` | Razorpay key ID for payments |
| `REACT_APP_BACKEND_URL` | Backend API URL |

## API Integration

### TMDB API
- Movie listings (popular, upcoming, now playing)
- Movie details with cast and trailers
- Search functionality
- Genre and filter data

### Backend API
- Booking management
- Payment processing
- User data
- Theatre information

## Authentication

The app uses Clerk for authentication:
- Sign up/Sign in forms
- Protected routes
- User profile management
- Session management

## Payment Integration

Razorpay integration for secure payments:
- Order creation
- Payment processing
- Payment verification
- Invoice generation

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Deployment

### Build for Production
```bash
npm run build
```

### Deploy to Vercel/Netlify
1. Connect your repository
2. Set environment variables
3. Deploy

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support, email support@skymovies.com
