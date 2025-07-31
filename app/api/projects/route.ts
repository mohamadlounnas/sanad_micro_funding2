import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { mockProjects } from '@/lib/mockData'

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'No token provided' },
        { status: 401 }
      )
    }

    const token = authHeader.substring(7)
    const decoded = verifyToken(token)

    if (!decoded) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      )
    }

    const { title, description, category, targetAmount, endDate, equityPercentage } = await request.json()

    if (!title || !description || !category || !targetAmount || !endDate || !equityPercentage) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      )
    }

    const project = await prisma.project.create({
      data: {
        title,
        description,
        category,
        targetAmount: parseFloat(targetAmount),
        raisedAmount: 0,
        endDate: new Date(endDate),
        equityPercentage: parseFloat(equityPercentage),
        status: 'ACTIVE',
        ownerId: decoded.userId
      }
    })

    return NextResponse.json({ project })
  } catch (error) {
    console.error('Project creation error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const projects = await prisma.project.findMany({
      where: { status: 'ACTIVE' },
      include: {
        owner: {
          select: {
            name: true
          }
        },
        _count: {
          select: {
            investments: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    const projectsWithCalculations = projects.map((project: any) => {
      const daysLeft = Math.ceil((new Date(project.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
      return {
        ...project,
        daysLeft: Math.max(0, daysLeft),
        investorsCount: project._count.investments
      }
    })

    return NextResponse.json({ projects: projectsWithCalculations })
  } catch (error) {
    console.error('Projects fetch error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 