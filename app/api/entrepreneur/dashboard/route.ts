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

    // Get user's projects
    const projects = await prisma.project.findMany({
      where: { ownerId: userId },
      include: {
        _count: {
          select: {
            investments: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    // Calculate stats
    const totalRaised = projects.reduce((sum: number, project: any) => sum + project.raisedAmount, 0)
    const activeProjects = projects.filter((project: any) => project.status === 'ACTIVE').length
    
    // Get total unique investors across all projects
    const totalInvestors = await prisma.investment.groupBy({
      by: ['investorId'],
      where: {
        project: {
          ownerId: userId
        }
      },
      _count: {
        investorId: true
      }
    })

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
      stats: {
        totalRaised,
        activeProjects,
        totalInvestors: totalInvestors.length
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