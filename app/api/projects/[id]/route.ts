import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getMockData } from '@/lib/mockData'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const projectId = params.id

    try {
      // Try to get project from database
      const project = await prisma.project.findUnique({
        where: { id: projectId },
        include: {
          owner: {
            select: {
              name: true,
              email: true
            }
          },
          _count: {
            select: {
              investments: true
            }
          }
        }
      })

      if (!project) {
        return NextResponse.json(
          { error: 'Project not found' },
          { status: 404 }
        )
      }

      // Calculate additional fields
      const daysLeft = Math.ceil((new Date(project.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
      
      const projectWithCalculations = {
        ...project,
        daysLeft: Math.max(0, daysLeft),
        investorsCount: project._count.investments,
        // Add mock data for additional fields
        businessPlan: 'هذا المشروع يهدف إلى إنشاء منصة رقمية متكاملة لربط المستثمرين بالمقاولين في الجزائر. سيوفر المشروع حلولاً مبتكرة للتمويل الجماعي مع ضمان الشفافية والأمان في جميع المعاملات.',
        financialProjections: 'يتوقع المشروع تحقيق عوائد سنوية تتراوح بين 15-25% للمستثمرين، مع نمو مستدام في السوق الجزائري المتنامي.',
        team: [
          'أحمد محمد - المدير التنفيذي',
          'فاطمة علي - مدير التطوير',
          'محمد حسن - مدير المالية',
          'سارة أحمد - مدير التسويق'
        ],
        risks: [
          'تقلبات السوق الاقتصادية',
          'التغييرات في التشريعات',
          'المنافسة من الشركات الكبيرة',
          'مخاطر التكنولوجيا'
        ],
        milestones: [
          {
            title: 'إطلاق النسخة التجريبية',
            description: 'إطلاق المنصة مع الميزات الأساسية',
            targetDate: '2024-06-01',
            amount: 500000
          },
          {
            title: 'توسيع السوق',
            description: 'الوصول إلى 1000 مستخدم نشط',
            targetDate: '2024-09-01',
            amount: 1000000
          },
          {
            title: 'الربحية',
            description: 'تحقيق الربحية الشهرية',
            targetDate: '2024-12-01',
            amount: 1500000
          }
        ]
      }

      return NextResponse.json({ project: projectWithCalculations })

    } catch (dbError) {
      console.error('Database error, using mock data:', dbError)
      
      // Fallback to mock data
      const mockData = getMockData('mock-user-id', 'INVESTOR')
      const mockProject = mockData.projects.find((p: any) => p.id === projectId)
      
      if (!mockProject) {
        return NextResponse.json(
          { error: 'Project not found' },
          { status: 404 }
        )
      }

      return NextResponse.json({ project: mockProject })
    }

  } catch (error) {
    console.error('Get project error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 