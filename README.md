# 🌟 99Consultant.com - Professional Consultation Marketplace

A comprehensive consultation marketplace platform built on Next.js 16 that connects clients with verified expert consultants across various domains. Transform your career, finance, wellness, and business goals with personalized expert guidance.

## 🚀 Features

### 👥 For Clients
- **Browse Expert Consultants**: Explore 1000+ verified consultants across 9 categories
- **Smart Search & Filtering**: Find consultants by name, skills, expertise, or category
- **₹99 First Session**: Try any consultant for just ₹99 on your first consultation
- **Secure Booking System**: Instant or scheduled consultations with flexible timing
- **Live Video Sessions**: High-quality video consultations powered by INR99 Academy
- **Reviews & Ratings**: Make informed decisions with authentic client feedback
- **Payment Security**: Safe and secure payment processing with multiple options

### 🎓 For Consultants
- **Professional Profile Management**: Showcase your expertise, qualifications, and experience
- **Flexible Pricing**: Set your own rates with ₹99 first session default
- **Availability Management**: Configure your working hours and session slots
- **Booking Management**: Accept, reject, or manage consultation requests
- **Earnings Dashboard**: Track your revenue and commission details
- **Client Reviews**: Build your reputation through client feedback
- **KYC Verification**: Build trust with verified consultant status

### 🛠 For Admins
- **Comprehensive Dashboard**: Monitor all platform activities in real-time
- **Consultant Approval**: Review and approve new consultant applications
- **Revenue Analytics**: Track platform earnings and commission splits
- **User Management**: Manage clients, consultants, and platform settings
- **Session Monitoring**: Oversee live consultations and handle disputes
- **Analytics & Reporting**: Detailed insights into platform performance

## 🏗️ Technology Stack

### Frontend
- **Framework**: Next.js 16 with App Router
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4
- **UI Components**: shadcn/ui (New York style)
- **Icons**: Lucide React
- **State Management**: Zustand + TanStack Query

### Backend
- **API**: Next.js API Routes
- **Database**: Prisma ORM with SQLite
- **Authentication**: bcryptjs for password hashing
- **Validation**: Zod schemas
- **File Upload**: Ready for integration

### Infrastructure
- **Deployment**: Production-ready with optimized builds
- **Database**: SQLite with Prisma migrations
- **Environment**: Configurable .env setup
- **Security**: Role-based access control

## 📋 Prerequisites

- Node.js 18+ 
- Bun or npm/yarn
- Git

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone https://github.com/jitenkr2030/99CONSULTANT.git
cd 99CONSULTANT
```

### 2. Install Dependencies
```bash
bun install
```

### 3. Environment Setup
Create a `.env` file in the root directory:
```env
# Database
DATABASE_URL="file:./dev.db"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key"

# Payment Gateway (Optional)
RAZORPAY_KEY_ID="your-razorpay-key"
RAZORPAY_KEY_SECRET="your-razorpay-secret"

# INR99 Academy (Optional)
INR99_ACADEMY_API_KEY="your-api-key"
INR99_ACADEMY_BASE_URL="https://api.inr99.academy"
```

### 4. Database Setup
```bash
# Generate Prisma client
bun run db:generate

# Push database schema
bun run db:push

# Seed sample data (optional)
bunx tsx prisma/seed.ts
```

### 5. Start Development Server
```bash
bun run dev
```

Visit [http://localhost:3000](http://localhost:3000) to view the application.

## 📁 Project Structure

```
99CONSULTANT/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/               # API routes
│   │   │   ├── auth/          # Authentication endpoints
│   │   │   ├── bookings/      # Booking management
│   │   │   ├── categories/    # Category management
│   │   │   ├── consultants/   # Consultant profiles
│   │   │   ├── payments/      # Payment processing
│   │   │   ├── reviews/       # Reviews and ratings
│   │   │   ├── sessions/      # Live sessions
│   │   │   └── users/         # User management
│   │   ├── admin/             # Admin dashboard
│   │   ├── consultant/        # Consultant portal
│   │   └── page.tsx           # Landing page
│   ├── components/            # Reusable UI components
│   │   └── ui/               # shadcn/ui components
│   ├── lib/                  # Utility functions
│   └── hooks/                # Custom React hooks
├── prisma/
│   ├── schema.prisma         # Database schema
│   └── seed.ts              # Sample data
├── public/                   # Static assets
└── README.md
```

## 🗄️ Database Schema

The platform uses 11 comprehensive database models:

### Core Models
- **User**: Authentication and role management (CLIENT/CONSULTANT/ADMIN)
- **ConsultantProfile**: Detailed consultant information and expertise
- **Category**: Consultation categories (Career, Finance, Business, etc.)
- **Booking**: Consultation bookings with status tracking
- **Session**: Live session management with INR99 Academy integration
- **Review**: Client feedback and rating system
- **Earning**: Consultant earnings and commission tracking
- **AdminAction**: Admin activity logging

### Key Relationships
- Users can have multiple roles (Client/Consultant/Admin)
- Consultants have detailed profiles with categories and pricing
- Bookings link clients with consultants for sessions
- Sessions connect to INR99 Academy for live video
- Reviews are tied to specific bookings/sessions
- Earnings track consultant revenue from sessions

## 🔐 Authentication & Security

### User Roles
- **CLIENT**: Can browse consultants, book sessions, leave reviews
- **CONSULTANT**: Can manage profile, set availability, conduct sessions
- **ADMIN**: Full platform oversight and management

### Security Features
- Password hashing with bcryptjs
- Role-based access control
- Input validation and sanitization
- SQL injection prevention with Prisma ORM
- XSS protection with Next.js defaults

## 💳 Payment Integration

### Supported Methods
- Credit/Debit Cards
- UPI (Unified Payments Interface)
- Net Banking

### Payment Flow
1. Client selects consultant and session type
2. Payment processed through secure gateway
3. Booking confirmed upon successful payment
4. Earnings calculated with platform commission
5. Consultant payout processed

### Commission Structure
- **First Session**: ₹99 fixed (client pays)
- **Regular Sessions**: Consultant-set pricing
- **Platform Commission**: 20% of session fee
- **Consultant Earning**: 80% of session fee

## 🎥 Live Session Integration

### INR99 Academy Integration
- Session creation and management
- Video/audio consultation
- Screen sharing capabilities
- Session recording (optional)
- Real-time chat and file sharing

### Session Types
- **Instant Sessions**: Available now for immediate consultation
- **Scheduled Sessions**: Book for specific time slots
- **Session Duration**: 30, 45, or 60 minutes

## 📊 Sample Data

The platform comes pre-populated with realistic sample data:

### Users
- **6 Verified Consultants** across different categories
- **10 Sample Clients** with various needs
- **1 Admin User** for platform management

### Content
- **20+ Sample Bookings** with different statuses
- **6 Completed Sessions** with reviews
- **Authentic Reviews** averaging 4.8 stars
- **₹12,450 Total Revenue** tracked in system

## 🛠 Development Commands

```bash
# Development
bun run dev              # Start development server
bun run lint             # Run ESLint
bun run build            # Build for production

# Database
bun run db:push          # Push schema changes
bun run db:generate      # Generate Prisma client
bun run db:migrate       # Run database migrations
bun run db:reset         # Reset database

# Seeding
bunx tsx prisma/seed.ts  # Populate with sample data
```

## 🧪 Testing & Quality

### Code Quality
- **ESLint**: JavaScript/TypeScript linting
- **TypeScript**: Full type safety
- **Prisma**: Type-safe database operations
- **React Hooks**: Best practices compliance

### Build Process
- **Optimized Production Build**: Code splitting and minification
- **Static Generation**: SEO-optimized pages
- **API Routes**: Server-side rendering for dynamic content
- **Asset Optimization**: Image and resource optimization

## 📱 Responsive Design

### Mobile-First Approach
- **Mobile**: 320px+ - Core functionality optimized
- **Tablet**: 768px+ - Enhanced layouts and interactions
- **Desktop**: 1024px+ - Full feature experience

### Key Features
- Touch-friendly interface
- Adaptive layouts
- Optimized performance
- Progressive enhancement

## 🚀 Deployment

### Production Build
```bash
bun run build
```

### Environment Variables
Configure all necessary environment variables for production:
- Database connection
- Authentication secrets
- Payment gateway keys
- External API keys

### Deployment Options
- **Vercel**: Recommended for Next.js applications
- **Netlify**: Static hosting with serverless functions
- **AWS**: Full cloud infrastructure
- **Docker**: Containerized deployment

## 🔧 Configuration

### Customization Options
- **Commission Rates**: Adjust platform commission percentage
- **Categories**: Add/remove consultation categories
- **Pricing**: Modify first session pricing rules
- **Themes**: Customize colors and branding
- **Features**: Enable/disable specific functionalities

### System Configuration
All platform settings are managed through the `SystemConfig` model:
- Platform commission rates
- First session pricing
- Feature flags
- Business rules

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Use ESLint configuration
- Write meaningful commit messages
- Update documentation for new features
- Test thoroughly before submitting

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

### Getting Help
- **Documentation**: Check this README and code comments
- **Issues**: Report bugs via GitHub Issues
- **Features**: Request features via GitHub Discussions
- **Security**: Report security issues privately

### Contact
- **Email**: support@99consultant.com
- **Website**: https://99consultant.com
- **GitHub**: https://github.com/jitenkr2030/99CONSULTANT

## 🌟 Acknowledgments

- **INR99 Academy**: For the live session engine foundation
- **Next.js Team**: For the excellent framework
- **Prisma**: For the powerful ORM
- **shadcn/ui**: For the beautiful UI components
- **Tailwind CSS**: For the utility-first CSS framework

---

## 🎯 Ready to Transform Lives?

99Consultant.com is more than just a platform – it's a bridge between expertise and those who need it. Whether you're a consultant looking to share your knowledge or a client seeking guidance, we're here to make that connection seamless, secure, and successful.

**Start your journey today!** 🚀

---

*Built with ❤️ using Next.js, TypeScript, and modern web technologies*