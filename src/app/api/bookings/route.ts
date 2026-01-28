import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { BookingType, BookingStatus, PaymentStatus } from '@prisma/client'

// Generate unique booking number
function generateBookingNumber(): string {
  const timestamp = Date.now().toString(36).toUpperCase()
  const random = Math.random().toString(36).substring(2, 6).toUpperCase()
  return `BK${timestamp}${random}`
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const role = searchParams.get('role') // 'client' or 'consultant'
    const status = searchParams.get('status') as BookingStatus
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')

    const skip = (page - 1) * limit

    // Build where clause based on user role
    let where: any = {}

    if (userId && role) {
      if (role === 'client') {
        where.clientId = userId
      } else if (role === 'consultant') {
        where.consultantId = userId
      }
    }

    if (status) {
      where.status = status
    }

    const bookings = await db.booking.findMany({
      where,
      include: {
        client: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true
          }
        },
        consultant: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true
          }
        },
        consultantProfile: {
          select: {
            category: true,
            firstSessionPrice: true,
            regularSessionPrice: true
          }
        },
        session: true,
        reviews: true
      },
      skip,
      take: limit,
      orderBy: {
        createdAt: 'desc'
      }
    })

    const total = await db.booking.count({ where })

    return NextResponse.json({
      bookings,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Error fetching bookings:', error)
    return NextResponse.json(
      { error: 'Failed to fetch bookings' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      clientId,
      consultantId,
      type = BookingType.SCHEDULED,
      scheduledFor,
      duration = 30,
      sessionNotes,
      isFirstSession = false
    } = body

    // Validate input
    if (!clientId || !consultantId) {
      return NextResponse.json(
        { error: 'Client ID and Consultant ID are required' },
        { status: 400 }
      )
    }

    // Get consultant profile to determine pricing
    const consultantProfile = await db.consultantProfile.findUnique({
      where: { userId: consultantId }
    })

    if (!consultantProfile) {
      return NextResponse.json(
        { error: 'Consultant profile not found' },
        { status: 404 }
      )
    }

    if (!consultantProfile.isApproved) {
      return NextResponse.json(
        { error: 'Consultant is not approved' },
        { status: 400 }
      )
    }

    // Determine price based on session type
    const price = isFirstSession ? consultantProfile.firstSessionPrice : consultantProfile.regularSessionPrice

    // Create booking
    const booking = await db.booking.create({
      data: {
        bookingNumber: generateBookingNumber(),
        clientId,
        consultantId,
        type,
        status: BookingStatus.PENDING,
        scheduledFor: scheduledFor ? new Date(scheduledFor) : null,
        duration,
        price,
        isFirstSession,
        sessionNotes,
        paymentStatus: PaymentStatus.PENDING
      },
      include: {
        client: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true
          }
        },
        consultant: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true
          }
        },
        consultantProfile: true
      }
    })

    // If it's an instant booking, create session immediately
    if (type === BookingType.INSTANT) {
      // Here you would integrate with INR99 Academy session creation
      // For now, we'll just update the booking status
      await db.booking.update({
        where: { id: booking.id },
        data: {
          status: BookingStatus.CONFIRMED,
          scheduledFor: new Date()
        }
      })
    }

    return NextResponse.json({
      message: 'Booking created successfully',
      booking
    })
  } catch (error) {
    console.error('Error creating booking:', error)
    return NextResponse.json(
      { error: 'Failed to create booking' },
      { status: 500 }
    )
  }
}