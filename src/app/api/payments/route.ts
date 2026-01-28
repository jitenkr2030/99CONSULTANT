import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { BookingStatus, PaymentStatus } from '@prisma/client'

// Mock payment gateway integration
interface PaymentRequest {
  bookingId: string
  amount: number
  currency?: string
  paymentMethod: 'card' | 'upi' | 'netbanking'
  paymentDetails: {
    cardNumber?: string
    expiryMonth?: string
    expiryYear?: string
    cvv?: string
    upiId?: string
    bankCode?: string
  }
}

interface PaymentResponse {
  success: boolean
  transactionId?: string
  error?: string
  redirectUrl?: string
}

// Mock payment gateway
class MockPaymentGateway {
  static async processPayment(request: PaymentRequest): Promise<PaymentResponse> {
    // Simulate payment processing delay
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Mock success rate (90% success)
    if (Math.random() > 0.1) {
      return {
        success: true,
        transactionId: `TXN${Date.now()}${Math.random().toString(36).substring(2, 8).toUpperCase()}`
      }
    } else {
      return {
        success: false,
        error: 'Payment failed. Please try again.'
      }
    }
  }

  static async verifyPayment(transactionId: string): Promise<boolean> {
    // Mock verification
    await new Promise(resolve => setTimeout(resolve, 1000))
    return Math.random() > 0.05 // 95% verification success
  }

  static async processRefund(transactionId: string, amount: number): Promise<PaymentResponse> {
    // Mock refund processing
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    return {
      success: true,
      transactionId: `REF${Date.now()}${Math.random().toString(36).substring(2, 8).toUpperCase()}`
    }
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: PaymentRequest = await request.json()
    const { bookingId, amount, paymentMethod, paymentDetails } = body

    // Validate input
    if (!bookingId || !amount || !paymentMethod || !paymentDetails) {
      return NextResponse.json(
        { error: 'Missing required payment information' },
        { status: 400 }
      )
    }

    // Get booking details
    const booking = await db.booking.findUnique({
      where: { id: bookingId },
      include: {
        client: true,
        consultant: true,
        consultantProfile: true
      }
    })

    if (!booking) {
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      )
    }

    if (booking.paymentStatus === PaymentStatus.COMPLETED) {
      return NextResponse.json(
        { error: 'Payment already completed for this booking' },
        { status: 400 }
      )
    }

    // Verify amount matches booking price
    if (amount !== booking.price) {
      return NextResponse.json(
        { error: 'Payment amount does not match booking price' },
        { status: 400 }
      )
    }

    // Process payment through mock gateway
    const paymentResult = await MockPaymentGateway.processPayment({
      bookingId,
      amount,
      currency: 'INR',
      paymentMethod,
      paymentDetails
    })

    if (!paymentResult.success) {
      // Update booking payment status to failed
      await db.booking.update({
        where: { id: bookingId },
        data: {
          paymentStatus: PaymentStatus.FAILED
        }
      })

      return NextResponse.json(
        { error: paymentResult.error || 'Payment processing failed' },
        { status: 400 }
      )
    }

    // Update booking with payment information
    const updatedBooking = await db.booking.update({
      where: { id: bookingId },
      data: {
        paymentStatus: PaymentStatus.COMPLETED,
        paymentId: paymentResult.transactionId,
        status: BookingStatus.CONFIRMED
      },
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
        consultantProfile: true
      }
    })

    // Create earning record for consultant
    const platformCommission = Math.floor(amount * 0.2) // 20% commission
    const consultantEarning = amount - platformCommission

    await db.earning.create({
      data: {
        consultantId: booking.consultantId,
        bookingId: booking.id,
        amount: consultantEarning,
        commission: platformCommission,
        totalAmount: amount,
        status: 'PENDING' as any
      }
    })

    return NextResponse.json({
      message: 'Payment processed successfully',
      payment: {
        transactionId: paymentResult.transactionId,
        amount,
        currency: 'INR',
        status: 'completed'
      },
      booking: updatedBooking
    })
  } catch (error) {
    console.error('Error processing payment:', error)
    return NextResponse.json(
      { error: 'Payment processing failed' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const transactionId = searchParams.get('transactionId')
    const bookingId = searchParams.get('bookingId')

    if (transactionId) {
      // Verify payment status
      const isValid = await MockPaymentGateway.verifyPayment(transactionId)
      
      return NextResponse.json({
        transactionId,
        status: isValid ? 'verified' : 'pending',
        verifiedAt: isValid ? new Date() : null
      })
    }

    if (bookingId) {
      // Get payment details for a booking
      const booking = await db.booking.findUnique({
        where: { id: bookingId },
        select: {
          id: true,
          bookingNumber: true,
          price: true,
          paymentStatus: true,
          paymentId: true,
          createdAt: true,
          client: {
            select: {
              name: true,
              email: true
            }
          }
        }
      })

      if (!booking) {
        return NextResponse.json(
          { error: 'Booking not found' },
          { status: 404 }
        )
      }

      return NextResponse.json({
        booking: {
          id: booking.id,
          bookingNumber: booking.bookingNumber,
          amount: booking.price,
          status: booking.paymentStatus,
          transactionId: booking.paymentId,
          client: booking.client,
          createdAt: booking.createdAt
        }
      })
    }

    return NextResponse.json(
      { error: 'Transaction ID or Booking ID is required' },
      { status: 400 }
    )
  } catch (error) {
    console.error('Error fetching payment details:', error)
    return NextResponse.json(
      { error: 'Failed to fetch payment details' },
      { status: 500 }
    )
  }
}

// Refund endpoint
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { transactionId, bookingId, reason } = body

    if (!transactionId && !bookingId) {
      return NextResponse.json(
        { error: 'Transaction ID or Booking ID is required' },
        { status: 400 }
      )
    }

    // Get booking details
    let booking
    if (bookingId) {
      booking = await db.booking.findUnique({
        where: { id: bookingId }
      })
    } else if (transactionId) {
      booking = await db.booking.findFirst({
        where: { paymentId: transactionId }
      })
    }

    if (!booking) {
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      )
    }

    if (booking.paymentStatus !== PaymentStatus.COMPLETED) {
      return NextResponse.json(
        { error: 'Cannot refund a payment that was not completed' },
        { status: 400 }
      )
    }

    // Process refund
    const refundResult = await MockPaymentGateway.processRefund(
      booking.paymentId!,
      booking.price
    )

    if (!refundResult.success) {
      return NextResponse.json(
        { error: 'Refund processing failed' },
        { status: 400 }
      )
    }

    // Update booking status
    await db.booking.update({
      where: { id: booking.id },
      data: {
        paymentStatus: PaymentStatus.REFUNDED,
        status: BookingStatus.CANCELLED
      }
    })

    // Update earning record if exists
    const earning = await db.earning.findFirst({
      where: { bookingId: booking.id }
    })

    if (earning) {
      await db.earning.update({
        where: { id: earning.id },
        data: {
          status: 'HELD' as any
        }
      })
    }

    return NextResponse.json({
      message: 'Refund processed successfully',
      refund: {
        transactionId: refundResult.transactionId,
        amount: booking.price,
        reason: reason || 'Customer requested refund',
        processedAt: new Date()
      }
    })
  } catch (error) {
    console.error('Error processing refund:', error)
    return NextResponse.json(
      { error: 'Refund processing failed' },
      { status: 500 }
    )
  }
}