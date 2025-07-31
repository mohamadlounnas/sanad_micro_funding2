import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

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

    const { projectId, amount } = await request.json()

    if (!projectId || !amount) {
      return NextResponse.json(
        { error: 'Project ID and amount are required' },
        { status: 400 }
      )
    }

    // Get user info
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId }
    })

    if (!user || user.role !== 'INVESTOR') {
      return NextResponse.json(
        { error: 'Only investors can make investments' },
        { status: 403 }
      )
    }

    // Get project info
    const project = await prisma.project.findUnique({
      where: { id: projectId }
    })

    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      )
    }

    if (project.status !== 'ACTIVE') {
      return NextResponse.json(
        { error: 'Project is not active for investment' },
        { status: 400 }
      )
    }

    // Validate investment amount
    const minInvestment = 10000
    const maxInvestment = Math.min(project.targetAmount * 0.1, project.targetAmount - project.raisedAmount)
    const remainingAmount = project.targetAmount - project.raisedAmount

    if (amount < minInvestment) {
      return NextResponse.json(
        { error: `Minimum investment amount is ${minInvestment.toLocaleString()} DZD` },
        { status: 400 }
      )
    }

    if (amount > maxInvestment) {
      return NextResponse.json(
        { error: `Maximum investment amount is ${maxInvestment.toLocaleString()} DZD` },
        { status: 400 }
      )
    }

    if (amount > remainingAmount) {
      return NextResponse.json(
        { error: `Remaining amount for investment is ${remainingAmount.toLocaleString()} DZD` },
        { status: 400 }
      )
    }

    // Check if user has already invested in this project
    const existingInvestment = await prisma.investment.findFirst({
      where: {
        projectId: projectId,
        investorId: decoded.userId
      }
    })

    if (existingInvestment) {
      return NextResponse.json(
        { error: 'You have already invested in this project' },
        { status: 400 }
      )
    }

    // Create investment
    const investment = await prisma.investment.create({
      data: {
        projectId: projectId,
        investorId: decoded.userId,
        amount: amount,
        status: 'ACTIVE',
        equityPercentage: (amount / project.targetAmount) * project.equityPercentage
      }
    })

    // Update project raised amount
    await prisma.project.update({
      where: { id: projectId },
      data: {
        raisedAmount: {
          increment: amount
        }
      }
    })

    return NextResponse.json({
      message: 'Investment created successfully',
      investment: {
        id: investment.id,
        amount: investment.amount,
        equityPercentage: investment.equityPercentage,
        status: investment.status,
        createdAt: investment.createdAt
      }
    })

  } catch (error) {
    console.error('Investment error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

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

    // Get user's investments
    const investments = await prisma.investment.findMany({
      where: { investorId: decoded.userId },
      include: {
        project: {
          select: {
            id: true,
            title: true,
            category: true,
            status: true,
            targetAmount: true,
            raisedAmount: true,
            equityPercentage: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json({ investments })

  } catch (error) {
    console.error('Get investments error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 