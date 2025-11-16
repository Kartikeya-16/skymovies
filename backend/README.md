# Sky Movies - Backend API

RESTful API backend for the Sky Movies booking platform. Built with Node.js, Express, and MongoDB.

## Features

- **User Authentication** - JWT-based authentication
- **Movie Management** - TMDB integration for movie data
- **Theatre Management** - Multi-theatre support with screens and seats
- **Booking System** - Complete booking flow with seat selection
- **Payment Processing** - Razorpay integration
- **QR Code Generation** - Ticket QR codes
- **Search & Filters** - Advanced movie search and filtering
- **User Profiles** - Watchlist and booking history

## Tech Stack

- **Node.js** - Runtime environment
- **Express** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **Razorpay** - Payment gateway
- **bcryptjs** - Password hashing
- **qrcode** - QR code generation

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. Install dependencies
```bash
npm install
```

2. Create environment file
```bash
cp .env.example .env
```

3. Configure environment variables
```env
NODE_ENV=development
PORT=5001
MONGODB_URI=mongodb://localhost:27017/sky-movies
JWT_SECRET=your_jwt_secret_min_32_characters
JWT_EXPIRE=7d
TMDB_API_KEY=your_tmdb_api_key
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_secret
FRONTEND_URL=http://localhost:3000
```

4. Seed database (optional)
```bash
npm run seed
```

5. Start server
```bash
# Development
npm run dev

# Production
npm start
```

Server runs on `http://localhost:5001`

## Project Structure

```
backend/
├── controllers/      # Business logic
│   ├── authController.js
│   ├── bookingController.js
│   ├── movieController.js
│   ├── paymentController.js
│   └── ...
├── models/            # Mongoose models
│   ├── User.js
│   ├── Booking.js
│   ├── Movie.js
│   └── ...
├── routes/            # API routes
│   ├── auth.routes.js
│   ├── booking.routes.js
│   └── ...
├── middleware/        # Custom middleware
│   ├── auth.js
│   ├── errorHandler.js
│   └── validation.js
├── utils/             # Utility functions
│   ├── qrCodeGenerator.js
│   └── tmdbService.js
├── scripts/           # Database scripts
│   └── seedDatabase.js
└── server.js          # Express app
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Movies
- `GET /api/movies` - Get all movies (with filters)
- `GET /api/movies/theatre` - Get theatre movies
- `GET /api/movies/online` - Get online movies
- `GET /api/movies/:id` - Get movie details

### Bookings
- `POST /api/bookings` - Create booking
- `GET /api/bookings` - Get user bookings
- `GET /api/bookings/:id` - Get booking details
- `PUT /api/bookings/:id/cancel` - Cancel booking

### Payments
- `POST /api/payments/create-order` - Create Razorpay order
- `POST /api/payments/verify` - Verify payment
- `GET /api/payments/user/history` - Payment history

### Theatres
- `GET /api/theatres` - Get all theatres
- `GET /api/theatres/:id` - Get theatre details
- `GET /api/theatres/:id/showtimes` - Get showtimes

## Database Models

### User
- Authentication credentials
- Profile information
- Watchlist
- Booking history

### Booking
- User reference
- Movie and theatre details
- Seat selection
- Showtime
- Payment status
- QR code

### Movie
- TMDB integration
- Theatre/Online availability
- Genres and cast
- Ratings

### Theatre
- Location and contact
- Screens and seats
- Amenities

### Payment
- Razorpay integration
- Transaction details
- Invoice data

## Environment Variables

| Variable | Description |
|----------|-------------|
| `PORT` | Server port (default: 5001) |
| `MONGODB_URI` | MongoDB connection string |
| `JWT_SECRET` | JWT secret key (min 32 chars) |
| `JWT_EXPIRE` | JWT expiration time |
| `TMDB_API_KEY` | TMDB API key |
| `RAZORPAY_KEY_ID` | Razorpay key ID |
| `RAZORPAY_KEY_SECRET` | Razorpay secret |
| `FRONTEND_URL` | Frontend URL for CORS |

## Security Features

- JWT authentication
- Password hashing with bcrypt
- Rate limiting
- Input validation
- CORS configuration
- Security headers (Helmet)
- Error handling middleware

## Payment Integration

### Razorpay Setup
1. Create Razorpay account
2. Get test/live credentials
3. Add to environment variables
4. Payment flow:
   - Create order → Get order ID
   - Process payment on frontend
   - Verify signature on backend
   - Confirm booking

## Database Seeding

Seed script creates sample data:
- Users
- Theatres
- Movies
- Showtimes

```bash
npm run seed
```

## API Response Format

### Success
```json
{
  "status": "success",
  "data": { ... }
}
```

### Error
```json
{
  "status": "error",
  "message": "Error message"
}
```

## Development

### Run in Development Mode
```bash
npm run dev
```

### Run Tests
```bash
npm test
```

## Deployment

### Production Build
```bash
npm start
```

### Environment Setup
- Set `NODE_ENV=production`
- Use production MongoDB URI
- Configure production Razorpay keys
- Set secure JWT secret

## Dependencies

### Production
- express
- mongoose
- jsonwebtoken
- bcryptjs
- razorpay
- qrcode
- axios
- cors
- helmet
- morgan

### Development
- nodemon

## License

MIT License

## Support

For issues or questions, contact support@skymovies.com
