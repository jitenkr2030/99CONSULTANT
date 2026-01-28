import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { CategoryEnum } from '@prisma/client'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category') as CategoryEnum
    const search = searchParams.get('search')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const isOnline = searchParams.get('online') === 'true'

    const skip = (page - 1) * limit

    // Build where clause
    const where: any = {
      consultantProfile: {
        isApproved: true,
        user: {
          role: 'CONSULTANT'
        }
      }
    }

    if (category && category !== 'all') {
      where.consultantProfile.category = category
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { consultantProfile: { bio: { contains: search, mode: 'insensitive' } } },
        { consultantProfile: { skills: { contains: search, mode: 'insensitive' } } }
      ]
    }

    if (isOnline) {
      where.consultantProfile.isOnline = true
    }

    // Get consultants with their profiles and ratings
    const consultants = await db.user.findMany({
      where,
      include: {
        consultantProfile: true,
        consultantReviews: {
          include: {
            client: {
              select: {
                name: true,
                avatar: true
              }
            }
          },
          orderBy: {
            createdAt: 'desc'
          },
          take: 3
        },
        _count: {
          select: {
            consultantReviews: true
          }
        }
      },
      skip,
      take: limit,
      orderBy: {
        consultantProfile: {
          isOnline: 'desc'
        }
      }
    })

    // Calculate average ratings for each consultant
    const consultantsWithRatings = await Promise.all(
      consultants.map(async (consultant) => {
        const ratings = await db.review.groupBy({
          by: ['consultantId'],
          where: {
            consultantId: consultant.id,
            isPublic: true
          },
          _avg: {
            rating: true
          },
          _count: {
            rating: true
          }
        })

        const avgRating = ratings.length > 0 ? ratings[0]._avg.rating : 0
        const totalReviews = ratings.length > 0 ? ratings[0]._count.rating : 0

        return {
          id: consultant.id,
          name: consultant.name,
          email: consultant.email,
          avatar: consultant.avatar,
          phone: consultant.phone,
          role: consultant.role,
          consultantProfile: consultant.consultantProfile,
          averageRating: avgRating || 0,
          totalReviews: totalReviews || 0,
          recentReviews: consultant.consultantReviews
        }
      })
    )

    // Get total count for pagination
    const total = await db.user.count({ where })

    return NextResponse.json({
      consultants: consultantsWithRatings,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Error fetching consultants:', error)
    return NextResponse.json(
      { error: 'Failed to fetch consultants' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      userId,
      bio,
      experience,
      qualifications,
      skills,
      category,
      subcategory,
      firstSessionPrice,
      regularSessionPrice,
      availability
    } = body

    // Check if user exists and is a consultant
    const user = await db.user.findUnique({
      where: { id: userId }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    if (user.role !== 'CONSULTANT') {
      return NextResponse.json(
        { error: 'User is not a consultant' },
        { status: 400 }
      )
    }

    // Create or update consultant profile
    const consultantProfile = await db.consultantProfile.upsert({
      where: { userId },
      update: {
        bio,
        experience,
        qualifications: JSON.stringify(qualifications),
        skills: JSON.stringify(skills),
        category,
        subcategory,
        firstSessionPrice,
        regularSessionPrice,
        availability: JSON.stringify(availability),
        profileCompleted: true
      },
      create: {
        userId,
        bio,
        experience,
        qualifications: JSON.stringify(qualifications),
        skills: JSON.stringify(skills),
        category,
        subcategory,
        firstSessionPrice,
        regularSessionPrice,
        availability: JSON.stringify(availability),
        profileCompleted: true
      }
    })

    return NextResponse.json({
      message: 'Consultant profile created/updated successfully',
      consultantProfile
    })
  } catch (error) {
    console.error('Error creating consultant profile:', error)
    return NextResponse.json(
      { error: 'Failed to create consultant profile' },
      { status: 500 }
    )
  }
}