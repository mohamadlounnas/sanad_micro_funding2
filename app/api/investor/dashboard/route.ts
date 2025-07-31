import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { getMockData } from '@/lib/mockData'

export async function GET(request: NextRequest) {
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

    const userId = decoded.userId

    // Get user's investments
    const investments = await prisma.investment.findMany({
      where: { investorId: userId },
      include: {
        project: {
          select: {
            id: true,
            title: true,
            category: true,
            status: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    // Get available projects (excluding user's own projects)
    const projects = await prisma.project.findMany({
      where: {
        status: 'ACTIVE',
        ownerId: { not: userId }
      },
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

    // Calculate stats
    const totalInvested = investments.reduce((sum: number, inv: any) => sum + inv.amount, 0)
    const activeInvestments = investments.filter((inv: any) => inv.status === 'ACTIVE').length
    const totalReturn = investments.reduce((sum: number, inv: any) => sum + (inv.returnAmount || 0), 0)

    // Add calculated fields to projects
    const projectsWithCalculations = projects.map((project: any) => {
      const daysLeft = Math.ceil((new Date(project.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
      return {
        ...project,
        daysLeft: Math.max(0, daysLeft),
        investorsCount: project._count.investments
      }
    })

    return NextResponse.json({
      projects: projectsWithCalculations,
      investments,
      stats: {
        totalInvested,
        activeInvestments,
        totalReturn
      }
    })
  } catch (error) {
    console.error('Dashboard error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 