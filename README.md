# Sanad (ساند) - Micro-Investment Platform

A Next.js-based micro-investment platform connecting investors with small business entrepreneurs in Algeria.

## 🚀 Features

### For Investors
- Browse available investment opportunities
- Invest in projects with secure transactions
- Track investment portfolio and returns
- View project progress and updates

### For Entrepreneurs
- Create and manage investment campaigns
- Set funding targets and equity percentages
- Track funding progress and investor details
- Receive funding for business growth

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS
- **Database**: SQLite with Prisma ORM
- **Authentication**: JWT with bcrypt
- **Icons**: Lucide React
- **Forms**: React Hook Form with Zod validation

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn

## 🚀 Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Setup

Create a `.env.local` file in the root directory:

```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
```

### 3. Database Setup

```bash
# Generate Prisma client
npm run db:generate

# Push schema to database
npm run db:push
```

### 4. Start Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## 📁 Project Structure

```
sanad-platform/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   │   ├── auth/          # Authentication endpoints
│   │   ├── investor/      # Investor dashboard API
│   │   ├── entrepreneur/  # Entrepreneur dashboard API
│   │   ├── projects/      # Project management API
│   │   └── investments/   # Investment API
│   ├── dashboard/         # Dashboard pages
│   │   └── projects/      # Project management pages
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── lib/                   # Utility libraries
│   ├── auth.ts           # Authentication utilities
│   └── prisma.ts         # Prisma client
├── prisma/               # Database schema
│   └── schema.prisma     # Prisma schema
├── components/           # Reusable components
├── types/               # TypeScript type definitions
└── public/              # Static assets
```

## 🔐 Authentication

The platform uses JWT-based authentication with the following endpoints:

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user info

## 📊 Database Schema

### Users
- Investors and entrepreneurs
- Role-based access control
- Secure password hashing

### Projects
- Investment campaigns
- Funding targets and progress
- Category classification
- Equity percentage tracking

### Investments
- Investment transactions
- Status tracking
- Return calculations

## 🎨 UI/UX Features

- **Bilingual Support**: Arabic and English interface
- **Responsive Design**: Mobile-first approach
- **Modern UI**: Clean, professional design
- **Real-time Updates**: Live progress tracking
- **Accessibility**: WCAG compliant components

## 🔧 Development Commands

```bash
# Development
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Database management
npm run db:generate    # Generate Prisma client
npm run db:push        # Push schema changes
npm run db:studio      # Open Prisma Studio

# Linting
npm run lint
```

## 🚀 Deployment

### Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Environment Variables for Production

```env
DATABASE_URL="your-production-database-url"
JWT_SECRET="your-production-jwt-secret"
NODE_ENV="production"
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions, please contact the development team.

---

**Sanad (ساند)** - Empowering Dreams, Building Futures 