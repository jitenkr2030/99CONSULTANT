import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { SessionStatus, BookingStatus } from '@prisma/client'

// Generate unique session ID for INR99 Academy
function generateSessionId(): string {
  const timestamp = Date.now().toString(36).toUpperCase()
  const random = Math.random().toString(36).substring(2, 8).toUpperCase()
  return `SS${timestamp}${random}`
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const role = searchParams.get('role') // 'client' or 'consultant'
    const status = searchParams.get('status') as SessionStatus
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

    const sessions = await db.session.findMany({
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
            category: true
          }
        },
        booking: {
          include: {
            reviews: true
          }
        },
        reviews: true
      },
      skip,
      take: limit,
      orderBy: {
        createdAt: 'desc'
      }
    })

    const total = await db.session.count({ where })

    return NextResponse.json({
      sessions,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Error fetching sessions:', error)
    return NextResponse.json(
      { error: 'Failed to fetch sessions' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      bookingId,
      clientId,
      consultantId
    } = body

    // Validate input
    if (!bookingId || !clientId || !consultantId) {
      return NextResponse.json(
        { error: 'Booking ID, Client ID, and Consultant ID are required' },
        { status: 400 }
      )
    }

    // Get booking details
    const booking = await db.booking.findUnique({
      where: { id: bookingId },
      include: {
        consultantProfile: true
      }
    })

    if (!booking) {
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      )
    }

    if (booking.status !== BookingStatus.CONFIRMED) {
      return NextResponse.json(
        { error: 'Booking is not confirmed' },
        { status: 400 }
      )
    }

    // Generate session ID
    const sessionId = generateSessionId()

    // Create session record
    const session = await db.session.create({
      data: {
        sessionId,
        bookingId,
        clientId,
        consultantId,
        status: SessionStatus.SCHEDULED,
        startedAt: new Date()
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
        consultantProfile: true,
        booking: true
      }
    })

    // Update booking with session reference
    await db.booking.update({
      where: { id: bookingId },
      data: {
        sessionId: session.id,
        status: BookingStatus.COMPLETED
      }
    })

    // Here you would integrate with INR99 Academy to create the actual live session
    // For now, we'll simulate the session URL
    const sessionUrl = `https://session.inr99.academy/${sessionId}`

    // Update session with URL
    await db.session.update({
      where: { id: session.id },
      data: {
        sessionUrl,
        status: SessionStatus.ACTIVE
      }
    })

    return NextResponse.json({
      message: 'Session created successfully',
      session: {
        ...session,
        sessionUrl
      }
    })
  } catch (error) {
    console.error('Error creating session:', error)
    return NextResponse.json(
      { error: 'Failed to create session' },
      { status: 500 }
    )
  }
}

// Join session endpoint
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { sessionId, userId, role } = body

    if (!sessionId || !userId || !role) {
      return NextResponse.json(
        { error: 'Session ID, User ID, and role are required' },
        { status: 400 }
      )
    }

    // Get session details
    const session = await db.session.findUnique({
      where: { sessionId },
      include: {
        client: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        consultant: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        booking: true
      }
    })

    if (!session) {
      return NextResponse.json(
        { error: 'Session not found' },
        { status: 404 }
      )
    }

    // Verify user is part of this session
    if (role === 'client' && session.clientId !== userId) {
      return NextResponse.json(
        { error: 'Unauthorized: You are not the client for this session' },
        { status: 403 }
      )
    }

    if (role === 'consultant' && session.consultantId !== userId) {
      return NextResponse.json(
        { error: 'Unauthorized: You are not the consultant for this session' },
        { status: 403 }
      )
    }

    // Update session status if not already active
    if (session.status === SessionStatus.SCHEDULED) {
      await db.session.update({
        where: { id: session.id },
        data: {
          status: SessionStatus.ACTIVE,
          startedAt: new Date()
        }
      })
    }

    // Return session join information
    return NextResponse.json({
      message: 'Session joined successfully',
      session: {
        sessionId: session.sessionId,
        sessionUrl: session.sessionUrl,
        status: session.status,
        client: session.client,
        consultant: session.consultant,
        booking: session.booking
      }
    })
  } catch (error) {
    console.error('Error joining session:', error)
    return NextResponse.json(
      { error: 'Failed to join session' },
      { status: 500 }
    )
  }
}