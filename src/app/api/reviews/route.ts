import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const consultantId = searchParams.get('consultantId')
    const clientId = searchParams.get('clientId')
    const bookingId = searchParams.get('bookingId')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')

    const skip = (page - 1) * limit

    // Build where clause
    let where: any = {}

    if (consultantId) {
      where.consultantId = consultantId
    }

    if (clientId) {
      where.clientId = clientId
    }

    if (bookingId) {
      where.bookingId = bookingId
    }

    // Only show public reviews by default
    where.isPublic = true

    const reviews = await db.review.findMany({
      where,
      include: {
        client: {
          select: {
            id: true,
            name: true,
            avatar: true
          }
        },
        consultant: {
          select: {
            id: true,
            name: true,
            avatar: true
          }
        },
        booking: {
          select: {
            bookingNumber: true,
            createdAt: true,
            price: true,
            isFirstSession: true
          }
        },
        session: {
          select: {
            sessionId: true,
            startedAt: true,
            duration: true
          }
        }
      },
      skip,
      take: limit,
      orderBy: {
        createdAt: 'desc'
      }
    })

    const total = await db.review.count({ where })

    return NextResponse.json({
      reviews,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Error fetching reviews:', error)
    return NextResponse.json(
      { error: 'Failed to fetch reviews' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      bookingId,
      sessionId,
      clientId,
      consultantId,
      rating,
      review,
      isPublic = true
    } = body

    // Validate input
    if (!bookingId || !clientId || !consultantId || !rating) {
      return NextResponse.json(
        { error: 'Booking ID, Client ID, Consultant ID, and rating are required' },
        { status: 400 }
      )
    }

    // Validate rating range
    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: 'Rating must be between 1 and 5' },
        { status: 400 }
      )
    }

    // Check if booking exists and belongs to the client
    const booking = await db.booking.findUnique({
      where: { id: bookingId },
      include: {
        session: true
      }
    })

    if (!booking) {
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      )
    }

    if (booking.clientId !== clientId) {
      return NextResponse.json(
        { error: 'Unauthorized: This booking does not belong to you' },
        { status: 403 }
      )
    }

    if (booking.status !== 'COMPLETED') {
      return NextResponse.json(
        { error: 'Can only review completed bookings' },
        { status: 400 }
      )
    }

    // Check if review already exists for this booking
    const existingReview = await db.review.findUnique({
      where: { bookingId }
    })

    if (existingReview) {
      return NextResponse.json(
        { error: 'Review already exists for this booking' },
        { status: 400 }
      )
    }

    // Create review
    const newReview = await db.review.create({
      data: {
        bookingId,
        sessionId,
        clientId,
        consultantId,
        rating,
        review,
        isPublic
      },
      include: {
        client: {
          select: {
            id: true,
            name: true,
            avatar: true
          }
        },
        consultant: {
          select: {
            id: true,
            name: true,
            avatar: true
          }
        },
        booking: {
          select: {
            bookingNumber: true,
            createdAt: true,
            price: true
          }
        }
      }
    })

    return NextResponse.json({
      message: 'Review created successfully',
      review: newReview
    })
  } catch (error) {
    console.error('Error creating review:', error)
    return NextResponse.json(
      { error: 'Failed to create review' },
      { status: 500 }
    )
  }
}