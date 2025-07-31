import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { prisma } from './prisma'

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12)
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword)
}

export function generateToken(userId: string, email: string, role: string): string {
  return jwt.sign(
    { userId, email, role },
    process.env.JWT_SECRET || 'fallback-secret',
    { expiresIn: '7d' }
  )
}

export function verifyToken(token: string) {
  try {
    return jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret') as any
  } catch (error) {
    return null
  }
}

export async function authenticateUser(email: string, password: string) {
  const user = await prisma.user.findUnique({
    where: { email }
  })

  if (!user) {
    return null
  }

  const isValid = await verifyPassword(password, user.password)
  
  if (!isValid) {
    return null
  }

  return user
} 