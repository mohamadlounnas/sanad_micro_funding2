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

    // Check if project exists and is active
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
        { error: 'Project is not active' },
        { status: 400 }
      )
    }

    // Check if user is not investing in their own project
    if (project.ownerId === decoded.userId) {
      return NextResponse.json(
        { error: 'Cannot invest in your own project' },
        { status: 400 }
      )
    }

    // Check if project has reached its target
    if (project.raisedAmount >= project.targetAmount) {
      return NextResponse.json(
        { error: 'Project has reached its funding target' },
        { status: 400 }
      )
    }

    // Check if investment amount is valid
    const investmentAmount = parseFloat(amount)
    if (investmentAmount <= 0) {
      return NextResponse.json(
        { error: 'Investment amount must be greater than 0' },
        { status: 400 }
      )
    }

    // Check if investment would exceed target amount
    if (project.raisedAmount + investmentAmount > project.targetAmount) {
      return NextResponse.json(
        { error: 'Investment would exceed project target amount' },
        { status: 400 }
      )
    }

    // Create investment
    const investment = await prisma.investment.create({
      data: {
        amount: investmentAmount,
        status: 'ACTIVE',
        investorId: decoded.userId,
        projectId: projectId
      }
    })

    // Update project raised amount
    await prisma.project.update({
      where: { id: projectId },
      data: {
        raisedAmount: project.raisedAmount + investmentAmount
      }
    })

    return NextResponse.json({ investment })
  } catch (error) {
    console.error('Investment creation error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 