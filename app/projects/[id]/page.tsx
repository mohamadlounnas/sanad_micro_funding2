'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { 
  ArrowLeft, 
  MapPin, 
  Users, 
  Calendar, 
  DollarSign, 
  TrendingUp, 
  Building2, 
  Coffee, 
  Smartphone, 
  Truck, 
  Leaf, 
  Briefcase,
  Eye,
  Share2,
  Bookmark,
  AlertCircle
} from 'lucide-react'
import InvestmentModal from '@/components/InvestmentModal'

// Category mapping with Arabic names and icons
const categories = {
  FOOD_AND_BEVERAGE: { name: 'الطعام والمشروبات', icon: Coffee, color: 'bg-orange-100 text-orange-600' },
  TECHNOLOGY: { name: 'التكنولوجيا', icon: Smartphone, color: 'bg-blue-100 text-blue-600' },
  MANUFACTURING: { name: 'التصنيع', icon: Building2, color: 'bg-purple-100 text-purple-600' },
  SERVICES: { name: 'الخدمات', icon: Briefcase, color: 'bg-green-100 text-green-600' },
  AGRICULTURE: { name: 'الزراعة', icon: Leaf, color: 'bg-emerald-100 text-emerald-600' }
}

interface Project {
  id: string
  title: string
  description: string
  category: string
  targetAmount: number
  raisedAmount: number
  equityPercentage: number
  daysLeft: number
  status: string
  owner: {
    name: string
    email: string
  }
  investorsCount: number
  createdAt: string
  endDate: string
  location: string
  businessPlan?: string
  financialProjections?: string
  team?: string[]
  risks?: string[]
  milestones?: Array<{
    title: string
    description: string
    targetDate: string
    amount: number
  }>
}

export default function ProjectDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [project, setProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)
  const [showInvestmentModal, setShowInvestmentModal] = useState(false)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/')
      return
    }

    // Get user info
    fetch('/api/auth/me', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    .then(res => res.json())
    .then(data => {
      if (data.user) {
        setUser(data.user)
      }
    })
    .catch(() => {
      router.push('/')
    })

    // Fetch project details
    fetch(`/api/projects/${params.id}`)
      .then(res => res.json())
      .then(data => {
        setProject(data.project)
      })
      .catch(error => {
        console.error('Error fetching project:', error)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [params.id, router])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ar-DZ', {
      style: 'currency',
      currency: 'DZD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  const getProgressPercentage = (raised: number, target: number) => {
    return Math.min((raised / target) * 100, 100)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-green-100 text-green-800'
      case 'COMPLETED':
        return 'bg-blue-100 text-blue-800'
      case 'CANCELLED':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const handleInvest = () => {
    if (!user) {
      router.push('/')
      return
    }
    setShowInvestmentModal(true)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">المشروع غير موجود</h2>
          <p className="text-gray-600">المشروع الذي تبحث عنه غير متاح</p>
        </div>
      </div>
    )
  }

  const CategoryIcon = categories[project.category as keyof typeof categories]?.icon || Building2
  const categoryColor = categories[project.category as keyof typeof categories]?.color || 'bg-gray-100 text-gray-600'
  const progressPercentage = getProgressPercentage(project.raisedAmount, project.targetAmount)

  return (
    <div dir="rtl" className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <button
              onClick={() => router.back()}
              className="flex items-center space-x-2 space-x-reverse text-gray-600 hover:text-primary-600 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>العودة</span>
            </button>
            <div className="flex items-center space-x-4 space-x-reverse">
              <button className="flex items-center space-x-2 space-x-reverse text-gray-600 hover:text-primary-600 transition-colors">
                <Bookmark className="h-5 w-5" />
                <span>حفظ</span>
              </button>
              <button className="flex items-center space-x-2 space-x-reverse text-gray-600 hover:text-primary-600 transition-colors">
                <Share2 className="h-5 w-5" />
                <span>مشاركة</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Project Header */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="flex items-start justify-between mb-6">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 space-x-reverse mb-4">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${categoryColor}`}>
                      <CategoryIcon className="h-4 w-4 ml-1" />
                      {categories[project.category as keyof typeof categories]?.name}
                    </span>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                      {project.status === 'ACTIVE' ? 'نشط' : project.status}
                    </span>
                  </div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-4">{project.title}</h1>
                  <p className="text-gray-600 text-lg leading-relaxed">{project.description}</p>
                </div>
              </div>

              {/* Project Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-6 border-t border-gray-200">
                <div className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <Users className="h-5 w-5 text-gray-400" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900">{project.investorsCount}</div>
                  <div className="text-sm text-gray-500">مستثمر</div>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <Calendar className="h-5 w-5 text-gray-400" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900">{project.daysLeft}</div>
                  <div className="text-sm text-gray-500">يوم متبقي</div>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <TrendingUp className="h-5 w-5 text-gray-400" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900">{project.equityPercentage}%</div>
                  <div className="text-sm text-gray-500">نسبة الملكية</div>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <MapPin className="h-5 w-5 text-gray-400" />
                  </div>
                  <div className="text-sm font-medium text-gray-900">{project.location}</div>
                  <div className="text-sm text-gray-500">الموقع</div>
                </div>
              </div>
            </div>

            {/* Funding Progress */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">تقدم التمويل</h2>
              
              <div className="space-y-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">المبلغ المطلوب</span>
                  <span className="font-medium">{formatCurrency(project.targetAmount)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">المبلغ المحصل</span>
                  <span className="font-medium text-primary-600">{formatCurrency(project.raisedAmount)}</span>
                </div>
                
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-gradient-to-r from-primary-500 to-primary-600 h-3 rounded-full transition-all duration-300"
                    style={{ width: `${progressPercentage}%` }}
                  ></div>
                </div>
                
                <div className="flex justify-between text-sm text-gray-500">
                  <span>{progressPercentage.toFixed(1)}% محقق</span>
                  <span>{project.equityPercentage}% حصة متاحة</span>
                </div>
              </div>
            </div>

            {/* Project Details */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">تفاصيل المشروع</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">خطة العمل</h3>
                  <p className="text-gray-600 leading-relaxed">
                    {project.businessPlan || 'سيتم إضافة خطة العمل قريباً...'}
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">التوقعات المالية</h3>
                  <p className="text-gray-600 leading-relaxed">
                    {project.financialProjections || 'سيتم إضافة التوقعات المالية قريباً...'}
                  </p>
                </div>

                {project.team && project.team.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">فريق العمل</h3>
                    <div className="space-y-2">
                      {project.team.map((member, index) => (
                        <div key={index} className="flex items-center space-x-2 space-x-reverse">
                          <div className="w-2 h-2 bg-primary-600 rounded-full"></div>
                          <span className="text-gray-600">{member}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {project.risks && project.risks.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">المخاطر</h3>
                    <div className="space-y-2">
                      {project.risks.map((risk, index) => (
                        <div key={index} className="flex items-center space-x-2 space-x-reverse">
                          <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                          <span className="text-gray-600">{risk}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {project.milestones && project.milestones.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">المراحل الرئيسية</h3>
                    <div className="space-y-4">
                      {project.milestones.map((milestone, index) => (
                        <div key={index} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-medium text-gray-900">{milestone.title}</h4>
                            <span className="text-sm text-gray-500">{milestone.targetDate}</span>
                          </div>
                          <p className="text-gray-600 text-sm mb-2">{milestone.description}</p>
                          <div className="text-sm text-primary-600 font-medium">
                            {formatCurrency(milestone.amount)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Investment Card */}
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
              <h3 className="text-xl font-bold text-gray-900 mb-4">استثمر في هذا المشروع</h3>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">الحد الأدنى للاستثمار</span>
                  <span className="font-medium">{formatCurrency(10000)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">الحد الأقصى للاستثمار</span>
                  <span className="font-medium">{formatCurrency(project.targetAmount * 0.1)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">نسبة الملكية المتاحة</span>
                  <span className="font-medium">{project.equityPercentage}%</span>
                </div>
              </div>

              <button
                onClick={handleInvest}
                disabled={project.status !== 'ACTIVE'}
                className="w-full btn-primary py-3 text-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                استثمر الآن
              </button>

              <div className="mt-4 text-center">
                <p className="text-sm text-gray-500">
                  {project.status === 'ACTIVE' 
                    ? 'هذا المشروع متاح للاستثمار'
                    : 'هذا المشروع غير متاح للاستثمار حالياً'
                  }
                </p>
              </div>
            </div>

            {/* Project Owner */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">صاحب المشروع</h3>
              
              <div className="flex items-center space-x-3 space-x-reverse">
                <div className="w-12 h-12 bg-gradient-to-br from-primary-100 to-primary-200 rounded-full flex items-center justify-center">
                  <Users className="h-6 w-6 text-primary-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">{project.owner.name}</h4>
                  <p className="text-sm text-gray-500">{project.owner.email}</p>
                </div>
              </div>
            </div>

            {/* Project Timeline */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">جدول المشروع</h3>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-3 space-x-reverse">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">تاريخ البدء</p>
                    <p className="text-xs text-gray-500">{new Date(project.createdAt).toLocaleDateString('ar-SA')}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 space-x-reverse">
                  <div className="w-3 h-3 bg-primary-500 rounded-full"></div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">تاريخ الانتهاء</p>
                    <p className="text-xs text-gray-500">{new Date(project.endDate).toLocaleDateString('ar-SA')}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Investment Modal */}
      {showInvestmentModal && project && (
        <InvestmentModal
          project={project}
          onClose={() => setShowInvestmentModal(false)}
          onSuccess={() => {
            setShowInvestmentModal(false)
            // Refresh project data
            window.location.reload()
          }}
        />
      )}
    </div>
  )
} 