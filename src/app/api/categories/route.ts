import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { CategoryEnum } from '@prisma/client'

export async function GET(request: NextRequest) {
  try {
    // Get all categories with consultant counts
    const categories = await Promise.all(
      Object.values(CategoryEnum).map(async (category) => {
        const count = await db.consultantProfile.count({
          where: {
            category,
            isApproved: true,
            user: {
              role: 'CONSULTANT'
            }
          }
        })

        return {
          id: category.toLowerCase(),
          name: category.charAt(0) + category.slice(1).toLowerCase(),
          value: category,
          count
        }
      })
    )

    // Add icons for categories
    const categoryIcons: Record<string, string> = {
      'career': '💼',
      'education': '📚',
      'finance': '💰',
      'business': '🏢',
      'wellness': '🧘',
      'technology': '💻',
      'legal': '⚖️',
      'marketing': '📱',
      'other': '📋'
    }

    const categoriesWithIcons = categories.map(cat => ({
      ...cat,
      icon: categoryIcons[cat.id] || '📋'
    }))

    // Sort by count (descending) and then by name
    categoriesWithIcons.sort((a, b) => {
      if (b.count !== a.count) {
        return b.count - a.count
      }
      return a.name.localeCompare(b.name)
    })

    return NextResponse.json({
      categories: categoriesWithIcons
    })
  } catch (error) {
    console.error('Error fetching categories:', error)
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, description, icon, isActive = true } = body

    // This would be for admin to add new categories
    // For now, we'll return an error since we're using enums
    return NextResponse.json(
      { error: 'Categories are predefined. Please use the available categories.' },
      { status: 400 }
    )
  } catch (error) {
    console.error('Error creating category:', error)
    return NextResponse.json(
      { error: 'Failed to create category' },
      { status: 500 }
    )
  }
}