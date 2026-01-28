import { PrismaClient, UserRole, CategoryEnum, BookingType, BookingStatus, PaymentStatus, SessionStatus, EarningStatus, AdminActionType } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 10)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@99consultant.com' },
    update: {},
    create: {
      email: 'admin@99consultant.com',
      password: adminPassword,
      name: 'Admin User',
      role: UserRole.ADMIN,
      emailVerified: new Date(),
      phoneVerified: true,
      kycVerified: true
    }
  })

  console.log('✅ Created admin user:', admin.email)

  // Create sample clients
  const clientPassword = await bcrypt.hash('client123', 10)
  const clients = []
  
  for (let i = 1; i <= 10; i++) {
    const client = await prisma.user.upsert({
      where: { email: `client${i}@example.com` },
      update: {},
      create: {
        email: `client${i}@example.com`,
        password: clientPassword,
        name: `Client ${i}`,
        phone: `+91987654321${i}`,
        role: UserRole.CLIENT,
        emailVerified: new Date(),
        phoneVerified: true
      }
    })
    clients.push(client)
  }

  console.log(`✅ Created ${clients.length} clients`)

  // Create sample consultants
  const consultantPassword = await bcrypt.hash('consultant123', 10)
  const consultants = []
  
  const consultantData = [
    {
      name: 'Dr. Priya Sharma',
      email: 'priya.sharma@example.com',
      phone: '+919876543210',
      category: CategoryEnum.CAREER,
      bio: '15+ years in career counseling and talent development. Specialized in helping professionals find their true calling and navigate career transitions.',
      experience: '15',
      qualifications: ['PhD in Organizational Psychology', 'Certified Career Coach', 'MBA from IIM Ahmedabad'],
      skills: ['Career Planning', 'Resume Building', 'Interview Preparation', 'Leadership Development', 'Work-Life Balance'],
      firstSessionPrice: 99,
      regularSessionPrice: 299,
      isOnline: true
    },
    {
      name: 'Rajesh Kumar',
      email: 'rajesh.kumar@example.com',
      phone: '+919876543211',
      category: CategoryEnum.FINANCE,
      bio: 'Expert in investment planning and wealth management with 12+ years of experience helping individuals achieve financial freedom.',
      experience: '12',
      qualifications: ['CFA Charterholder', 'CA from ICAI', 'PGDM in Finance'],
      skills: ['Investment Planning', 'Tax Planning', 'Retirement Planning', 'Risk Management', 'Portfolio Optimization'],
      firstSessionPrice: 99,
      regularSessionPrice: 399,
      isOnline: false
    },
    {
      name: 'Dr. Anjali Patel',
      email: 'anjali.patel@example.com',
      phone: '+919876543212',
      category: CategoryEnum.WELLNESS,
      bio: 'Holistic wellness coach and mental health expert. Passionate about helping people achieve physical, mental, and emotional well-being.',
      experience: '10',
      qualifications: ['MD in Psychiatry', 'Certified Yoga Instructor', 'MSc in Psychology'],
      skills: ['Stress Management', 'Meditation', 'Lifestyle Coaching', 'Mental Health', 'Nutrition Guidance'],
      firstSessionPrice: 99,
      regularSessionPrice: 349,
      isOnline: true
    },
    {
      name: 'Amit Verma',
      email: 'amit.verma@example.com',
      phone: '+919876543213',
      category: CategoryEnum.BUSINESS,
      bio: 'Serial entrepreneur and business strategist. Helped 50+ startups scale from idea to profitable businesses.',
      experience: '8',
      qualifications: ['MBA from Harvard Business School', 'B.Tech from IIT Delhi'],
      skills: ['Business Strategy', 'Startup Mentoring', 'Growth Hacking', 'Fundraising', 'Market Analysis'],
      firstSessionPrice: 99,
      regularSessionPrice: 499,
      isOnline: true
    },
    {
      name: 'Prof. Sarah Johnson',
      email: 'sarah.johnson@example.com',
      phone: '+919876543214',
      category: CategoryEnum.EDUCATION,
      bio: 'Education expert with 20+ years of experience in curriculum development and personalized learning strategies.',
      experience: '20',
      qualifications: ['PhD in Education', 'M.Ed from Harvard', 'Cambridge Certified Teacher'],
      skills: ['Study Techniques', 'Exam Preparation', 'Career Guidance', 'Subject Selection', 'Learning Disabilities'],
      firstSessionPrice: 99,
      regularSessionPrice: 259,
      isOnline: false
    },
    {
      name: 'Tech Guru Rahul',
      email: 'rahul.tech@example.com',
      phone: '+919876543215',
      category: CategoryEnum.TECHNOLOGY,
      bio: 'Full-stack developer and tech consultant. Expert in web development, cloud architecture, and emerging technologies.',
      experience: '7',
      qualifications: ['B.Tech Computer Science', 'AWS Certified Solutions Architect', 'Google Cloud Professional'],
      skills: ['Web Development', 'Cloud Computing', 'DevOps', 'Machine Learning', 'Blockchain'],
      firstSessionPrice: 99,
      regularSessionPrice: 449,
      isOnline: true
    }
  ]

  for (const data of consultantData) {
    const consultant = await prisma.user.upsert({
      where: { email: data.email },
      update: {},
      create: {
        email: data.email,
        password: consultantPassword,
        name: data.name,
        phone: data.phone,
        role: UserRole.CONSULTANT,
        emailVerified: new Date(),
        phoneVerified: true,
        kycVerified: true,
        consultantProfile: {
          create: {
            bio: data.bio,
            experience: data.experience,
            qualifications: JSON.stringify(data.qualifications),
            skills: JSON.stringify(data.skills),
            category: data.category,
            firstSessionPrice: data.firstSessionPrice,
            regularSessionPrice: data.regularSessionPrice,
            availability: JSON.stringify({
              monday: { available: true, slots: ['09:00-12:00', '14:00-18:00'] },
              tuesday: { available: true, slots: ['09:00-12:00', '14:00-18:00'] },
              wednesday: { available: true, slots: ['09:00-12:00', '14:00-18:00'] },
              thursday: { available: true, slots: ['09:00-12:00', '14:00-18:00'] },
              friday: { available: true, slots: ['09:00-12:00', '14:00-18:00'] },
              saturday: { available: false, slots: [] },
              sunday: { available: false, slots: [] }
            }),
            isOnline: data.isOnline,
            isApproved: true,
            approvalDate: new Date(),
            profileCompleted: true
          }
        }
      }
    })
    consultants.push(consultant)
  }

  console.log(`✅ Created ${consultants.length} consultants`)

  // Create sample bookings
  const bookings = []
  for (let i = 0; i < 20; i++) {
    const client = clients[Math.floor(Math.random() * clients.length)]
    const consultant = consultants[Math.floor(Math.random() * consultants.length)]
    const isFirstSession = Math.random() > 0.7
    
    const booking = await prisma.booking.create({
      data: {
        bookingNumber: `BK${Date.now()}${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
        clientId: client.id,
        consultantId: consultant.id,
        type: Math.random() > 0.5 ? BookingType.INSTANT : BookingType.SCHEDULED,
        status: [BookingStatus.CONFIRMED, BookingStatus.COMPLETED, BookingStatus.PENDING][Math.floor(Math.random() * 3)],
        scheduledFor: new Date(Date.now() + Math.random() * 7 * 24 * 60 * 60 * 1000), // Random time in next week
        duration: [30, 45, 60][Math.floor(Math.random() * 3)],
        price: isFirstSession ? 99 : [299, 349, 399, 449, 499][Math.floor(Math.random() * 5)],
        isFirstSession,
        sessionNotes: `Looking for guidance on ${['career growth', 'financial planning', 'wellness improvement', 'business strategy'][Math.floor(Math.random() * 4)]}`,
        paymentStatus: PaymentStatus.COMPLETED
      }
    })
    bookings.push(booking)
  }

  console.log(`✅ Created ${bookings.length} bookings`)

  // Create sample sessions for completed bookings
  const sessions = []
  const completedBookings = bookings.filter(b => b.status === BookingStatus.COMPLETED)
  
  for (const booking of completedBookings.slice(0, 10)) {
    const session = await prisma.session.create({
      data: {
        sessionId: `SS${Date.now()}${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
        bookingId: booking.id,
        clientId: booking.clientId,
        consultantId: booking.consultantId,
        status: SessionStatus.COMPLETED,
        startedAt: new Date(booking.scheduledFor!.getTime() - 60 * 60 * 1000), // Started 1 hour before scheduled time
        endedAt: new Date(booking.scheduledFor!.getTime() - 60 * 60 * 1000 + booking.duration * 60 * 1000), // Ended after duration
        duration: booking.duration,
        sessionUrl: `https://session.inr99.academy/SS${Date.now()}${Math.random().toString(36).substring(2, 8).toUpperCase()}`
      }
    })
    sessions.push(session)
  }

  console.log(`✅ Created ${sessions.length} sessions`)

  // Create sample reviews
  const reviews = []
  const reviewTexts = [
    'Excellent consultation! Very knowledgeable and helpful.',
    'Great experience. The consultant provided valuable insights.',
    'Highly recommended! Professional and approachable.',
    'Amazing session. Exceeded my expectations.',
    'Very satisfied with the consultation. Worth every penny.',
    'Outstanding service. The consultant is an expert in their field.',
    'Transformative experience. Helped me gain clarity.',
    'Professional, punctual, and provided practical advice.'
  ]

  for (const session of sessions) {
    const review = await prisma.review.create({
      data: {
        bookingId: session.bookingId!,
        sessionId: session.id,
        clientId: session.clientId,
        consultantId: session.consultantId,
        rating: Math.floor(Math.random() * 2) + 4, // 4-5 stars
        review: reviewTexts[Math.floor(Math.random() * reviewTexts.length)],
        isPublic: true
      }
    })
    reviews.push(review)
  }

  console.log(`✅ Created ${reviews.length} reviews`)

  // Create sample earnings for consultants
  const earnings = []
  for (const consultant of consultants) {
    const consultantSessions = sessions.filter(s => s.consultantId === consultant.id)
    
    for (const session of consultantSessions) {
      const booking = bookings.find(b => b.id === session.bookingId)!
      const platformCommission = Math.floor(booking.price * 0.2) // 20% commission
      const consultantEarning = booking.price - platformCommission
      
      const earning = await prisma.earning.create({
        data: {
          consultantId: consultant.id,
          sessionId: session.id,
          bookingId: booking.id,
          amount: consultantEarning,
          commission: platformCommission,
          totalAmount: booking.price,
          status: EarningStatus.PENDING
        }
      })
      earnings.push(earning)
    }
  }

  console.log(`✅ Created ${earnings.length} earnings records`)

  // Create system config
  await prisma.systemConfig.upsert({
    where: { key: 'platform_commission' },
    update: { value: '20' },
    create: { key: 'platform_commission', value: '20' }
  })

  await prisma.systemConfig.upsert({
    where: { key: 'first_session_price' },
    update: { value: '99' },
    create: { key: 'first_session_price', value: '99' }
  })

  console.log('✅ Created system configuration')

  // Create admin actions
  for (const consultant of consultants) {
    await prisma.adminAction.create({
      data: {
        adminId: admin.id,
        action: AdminActionType.APPROVE_CONSULTANT,
        targetId: consultant.id,
        targetType: 'consultant',
        reason: 'Consultant profile approved after verification',
        metadata: JSON.stringify({ approvedAt: new Date() })
      }
    })
  }

  console.log(`✅ Created admin actions`)

  console.log('🎉 Database seeding completed successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })