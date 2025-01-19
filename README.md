# Banking Web Application

A modern web application for managing banking transactions, built with Next.js 15, TypeScript, and MongoDB.

## Features

- 🔐 Secure user authentication with NextAuth.js
- 💰 Real-time balance tracking
- 🔄 Basic Transactions
  - Deposits
  - Withdrawals
  - Internal transfers
- 📈 Advanced Financial Services
  - Fixed Deposits with competitive interest rates
  - International Money Transfers with currency conversion
  - Bill Payments (utilities, phone, internet)
  - Tax Payments (income, property, sales, corporate)
- 📊 Transaction history with detailed records
- 🎨 Modern UI with Tailwind CSS
- 🔒 Protected routes and API endpoints
- 📱 Responsive design for all devices

## Tech Stack

- **Frontend**: Next.js 15 (App Router), React, TypeScript
- **Styling**: Tailwind CSS
- **Authentication**: NextAuth.js
- **Database**: MongoDB
- **State Management**: React Hooks
- **Form Handling**: Native React forms
- **API**: Next.js API Routes

## Getting Started

### Prerequisites

- Node.js 16.8 or later
- MongoDB installed locally or a MongoDB Atlas account
- Git

### Installation

1. Clone the repository and install dependencies:
```bash
git clone <repository-url>
cd bankingweb
npm install
```

2. Create a `.env.local` file in the root directory:
```env
MONGODB_URI=your_mongodb_connection_string
NEXTAUTH_SECRET=your_jwt_secret_key
NEXTAUTH_URL=http://localhost:3000
```

3. Start the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/                    # Next.js 15 app directory
│   ├── api/               # API routes
│   │   ├── auth/         # Authentication endpoints
│   │   ├── transactions/ # Transaction handling
│   │   └── users/        # User management
│   ├── dashboard/        # Dashboard page
│   ├── login/           # Login page
│   └── register/        # Registration page
├── components/           # React components
│   ├── ui/              # Reusable UI components
│   └── forms/           # Transaction forms
├── lib/                 # Utility functions and database
├── providers/          # React context providers
└── types/              # TypeScript type definitions
```

## Available Routes

### Pages
- `/` - Home page with features overview
- `/login` - User login
- `/register` - User registration
- `/dashboard` - Protected user dashboard
- `/about` - About us page

### API Endpoints
- **Authentication**
  - `POST /api/auth/login` - User login
  - `POST /api/auth/register` - User registration
  - `POST /api/auth/logout` - User logout
  
- **Users**
  - `POST /api/users` - Create new user
  - `GET /api/users/[email]` - Get user details
  
- **Transactions**
  - `POST /api/transactions` - Process transactions
    - Basic transactions (deposit, withdrawal, transfer)
    - Fixed deposits
    - International transfers
    - Bill payments
    - Tax payments

## Features in Detail

### Authentication
- Email/password authentication using NextAuth.js
- Protected routes and API endpoints
- Secure session management with JWT
- Password hashing with bcrypt

### Transaction Management
- **Basic Transactions**
  - Deposit funds
  - Withdraw funds
  - Transfer to other users
  - Real-time balance updates
  
- **Fixed Deposits**
  - Multiple tenure options (3, 6, 12, 24 months)
  - Competitive interest rates
  - Maturity amount calculation
  - Active deposits tracking
  
- **International Transfers**
  - Multiple currency support
  - Real-time exchange rates
  - SWIFT/BIC validation
  - Recipient bank details management
  
- **Bill Payments**
  - Multiple utility types
  - Service provider selection
  - Bill reference tracking
  - Payment confirmation
  
- **Tax Payments**
  - Multiple tax types
  - Tax year selection
  - Reference number tracking
  - Payment history

### User Interface
- Clean and modern design
- Responsive layout
- Loading states and error handling
- Transaction success/error notifications
- Interactive service selection
- Real-time calculations

## Security Measures

- Passwords are hashed using bcrypt
- Protected API routes with session validation
- CSRF protection
- Input validation and sanitization
- Secure session management
- Rate limiting on sensitive endpoints
- Data sanitization
- XSS protection

## Environment Variables

```env
MONGODB_URI=             # MongoDB connection string
NEXTAUTH_SECRET=         # Random string for JWT encryption
NEXTAUTH_URL=            # Your application URL
```

## Common Issues

1. **JWT Decryption Error**
   - Make sure `NEXTAUTH_SECRET` is set in `.env.local`
   - Ensure the secret is consistent across sessions

2. **MongoDB Connection**
   - Verify `MONGODB_URI` is correct
   - Check if MongoDB is running locally
   - Ensure network connectivity

3. **Authentication Issues**
   - Confirm all NextAuth.js configuration
   - Check browser console for errors
   - Verify environment variables

## Development Guidelines

1. **Code Style**
   - Use TypeScript for type safety
   - Follow ESLint configuration
   - Use Prettier for formatting
   - Follow component naming conventions

2. **Component Structure**
   - Keep components small and focused
   - Use TypeScript interfaces
   - Implement proper error handling
   - Follow React best practices

3. **API Development**
   - Validate all inputs
   - Return consistent error responses
   - Document all endpoints
   - Implement proper error handling

## License

This project is licensed under the MIT License.
