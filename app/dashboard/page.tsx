'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
  User, 
  Briefcase, 
  TrendingUp, 
  DollarSign, 
  Plus,
  LogOut,
  Eye,
  Users,
  Target
} from 'lucide-react'

const CATEGORY_LABELS = {
  TECHNOLOGY: 'التكنولوجيا',
  FOOD_AND_BEVERAGE: 'الطعام والمشروبات',
  RETAIL: 'التجارة',
  SERVICES: 'الخدمات',
  MANUFACTURING: 'التصنيع',
  AGRICULTURE: 'الزراعة',
  HEALTHCARE: 'الرعاية الصحية',
  EDUCATION: 'التعليم',
  ENTERTAINMENT: 'الترفيه',
  OTHER: 'أخرى'
}

const getCategoryLabel = (category: string) => {
  return CATEGORY_LABELS[category as keyof typeof CATEGORY_LABELS] || category
}

interface User {
  id: string
  email: string
  name: string
  role: 'INVESTOR' | 'ENTREPRENEUR'
}

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/')
      return
    }

    // Verify token and get user data
    fetch('/api/auth/me', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    .then(res => res.json())
    .then(data => {
      if (data.user) {
        setUser(data.user)
      } else {
        router.push('/')
      }
    })
    .catch(() => {
      router.push('/')
    })
    .finally(() => {
      setLoading(false)
    })
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem('token')
    router.push('/')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-primary-600">ساند</h1>
              <span className="ml-2 text-gray-500">Sanad</span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">مرحباً، {user.name}</span>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 text-gray-500 hover:text-gray-700"
              >
                <LogOut size={20} />
                <span>تسجيل الخروج</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Role-based Dashboard */}
        {user.role === 'INVESTOR' ? (
          <InvestorDashboard />
        ) : (
          <EntrepreneurDashboard />
        )}
      </div>
    </div>
  )
}

function InvestorDashboard() {
  const [projects, setProjects] = useState([])
  const [investments, setInvestments] = useState([])
  const [stats, setStats] = useState({
    totalInvested: 0,
    activeInvestments: 0,
    totalReturn: 0
  })

  useEffect(() => {
    // Fetch investor data
    fetch('/api/investor/dashboard')
      .then(res => res.json())
      .then(data => {
        setProjects(data.projects || [])
        setInvestments(data.investments || [])
        setStats(data.stats || {})
      })
      .catch(error => {
        console.error('Error fetching investor data:', error)
      })
  }, [])

  // Refresh data when returning to dashboard
  const refreshData = () => {
    fetch('/api/investor/dashboard')
      .then(res => res.json())
      .then(data => {
        setProjects(data.projects || [])
        setInvestments(data.investments || [])
        setStats(data.stats || {})
      })
      .catch(error => {
        console.error('Error refreshing investor data:', error)
      })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <User className="text-primary-600" size={24} />
          <h2 className="text-2xl font-bold text-gray-900">لوحة المستثمر</h2>
        </div>
        <button
          onClick={refreshData}
          className="btn-outline flex items-center space-x-2"
        >
          <TrendingUp size={20} />
          <span>تحديث البيانات</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card p-6">
          <div className="flex items-center">
            <DollarSign className="text-primary-600" size={24} />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">إجمالي الاستثمارات</p>
              <p className="text-2xl font-bold text-gray-900">{(stats.totalInvested || 0).toLocaleString()} د.ج</p>
            </div>
          </div>
        </div>
        <div className="card p-6">
          <div className="flex items-center">
            <TrendingUp className="text-secondary-600" size={24} />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">الاستثمارات النشطة</p>
              <p className="text-2xl font-bold text-gray-900">{stats.activeInvestments || 0}</p>
            </div>
          </div>
        </div>
        <div className="card p-6">
          <div className="flex items-center">
            <Target className="text-accent-600" size={24} />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">إجمالي العوائد</p>
              <p className="text-2xl font-bold text-gray-900">{(stats.totalReturn || 0).toLocaleString()} د.ج</p>
            </div>
          </div>
        </div>
      </div>

      {/* Investment Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Available Projects */}
        <div className="card">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">المشاريع المتاحة للاستثمار</h3>
          </div>
          <div className="p-6">
            {projects.length === 0 ? (
              <p className="text-gray-500 text-center py-8">لا توجد مشاريع متاحة حالياً</p>
            ) : (
              <div className="space-y-4">
                {projects.slice(0, 3).map((project: any) => (
                  <ProjectCard key={project.id} project={project} />
                ))}
                {projects.length > 3 && (
                  <div className="text-center pt-4">
                    <button className="btn-outline">
                      عرض جميع المشاريع ({projects.length})
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* My Investments */}
        <div className="card">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">استثماراتي</h3>
          </div>
          <div className="p-6">
            {investments.length === 0 ? (
              <p className="text-gray-500 text-center py-8">لم تقم بأي استثمارات بعد</p>
            ) : (
              <div className="space-y-4">
                {investments.map((investment: any) => (
                  <InvestmentCard key={investment.id} investment={investment} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Investment Analytics */}
      <div className="card">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">تحليلات الاستثمار</h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{investments.length}</div>
              <div className="text-sm text-gray-600">إجمالي الاستثمارات</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {investments.filter((inv: any) => inv.status === 'ACTIVE').length}
              </div>
              <div className="text-sm text-gray-600">الاستثمارات النشطة</div>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">
                {projects.length}
              </div>
              <div className="text-sm text-gray-600">المشاريع المتاحة</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {((stats.totalReturn || 0) / (stats.totalInvested || 1) * 100).toFixed(1)}%
              </div>
              <div className="text-sm text-gray-600">معدل العائد</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function EntrepreneurDashboard() {
  const [projects, setProjects] = useState([])
  const [stats, setStats] = useState({
    totalRaised: 0,
    activeProjects: 0,
    totalInvestors: 0
  })

  useEffect(() => {
    // Fetch entrepreneur data
    fetch('/api/entrepreneur/dashboard')
      .then(res => res.json())
      .then(data => {
        setProjects(data.projects || [])
        setStats(data.stats || {})
      })
      .catch(error => {
        console.error('Error fetching dashboard data:', error)
      })
  }, [])

  // Refresh data when returning to dashboard
  const refreshData = () => {
    fetch('/api/entrepreneur/dashboard')
      .then(res => res.json())
      .then(data => {
        setProjects(data.projects || [])
        setStats(data.stats || {})
      })
      .catch(error => {
        console.error('Error refreshing dashboard data:', error)
      })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Briefcase className="text-primary-600" size={24} />
          <h2 className="text-2xl font-bold text-gray-900">لوحة المقاول</h2>
        </div>
        <div className="flex items-center space-x-4">
          <button
            onClick={refreshData}
            className="btn-outline flex items-center space-x-2"
          >
            <TrendingUp size={20} />
            <span>تحديث البيانات</span>
          </button>
          <button
            onClick={() => window.location.href = '/dashboard/projects/new'}
            className="btn-primary flex items-center space-x-2"
          >
            <Plus size={20} />
            <span>إضافة مشروع جديد</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card p-6">
          <div className="flex items-center">
            <DollarSign className="text-primary-600" size={24} />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">إجمالي التمويل المحصل</p>
              <p className="text-2xl font-bold text-gray-900">{(stats.totalRaised || 0).toLocaleString()} د.ج</p>
            </div>
          </div>
        </div>
        <div className="card p-6">
          <div className="flex items-center">
            <TrendingUp className="text-secondary-600" size={24} />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">المشاريع النشطة</p>
              <p className="text-2xl font-bold text-gray-900">{stats.activeProjects || 0}</p>
            </div>
          </div>
        </div>
        <div className="card p-6">
          <div className="flex items-center">
            <Users className="text-accent-600" size={24} />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">إجمالي المستثمرين</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalInvestors || 0}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Project Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* My Projects */}
        <div className="card">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">مشاريعي</h3>
          </div>
          <div className="p-6">
            {projects.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500 mb-4">لا توجد مشاريع بعد</p>
                <button
                  onClick={() => window.location.href = '/dashboard/projects/new'}
                  className="btn-primary"
                >
                  إنشاء مشروع أول
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {projects.map((project: any) => (
                  <MyProjectCard key={project.id} project={project} />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="card">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">النشاط الأخير</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {projects.length > 0 ? (
                projects.slice(0, 3).map((project: any) => (
                  <div key={project.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-2 h-2 bg-primary-600 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{project.title}</p>
                      <p className="text-xs text-gray-500">
                        {project.investorsCount || 0} مستثمر • {((project.raisedAmount || 0) / (project.targetAmount || 1) * 100).toFixed(1)}% مكتمل
                      </p>
                    </div>
                    <span className="text-xs text-gray-400">
                      {project.daysLeft || 0} يوم متبقي
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-4">لا يوجد نشاط حديث</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Project Analytics */}
      <div className="card">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">تحليلات المشاريع</h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{projects.length}</div>
              <div className="text-sm text-gray-600">إجمالي المشاريع</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {projects.filter((p: any) => p.status === 'ACTIVE').length}
              </div>
              <div className="text-sm text-gray-600">المشاريع النشطة</div>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">
                {projects.reduce((sum: number, p: any) => sum + (p.investorsCount || 0), 0)}
              </div>
              <div className="text-sm text-gray-600">إجمالي المستثمرين</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {projects.reduce((sum: number, p: any) => sum + (p.raisedAmount || 0), 0).toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">إجمالي التمويل (د.ج)</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function ProjectCard({ project }: { project: any }) {
  const progress = ((project.raisedAmount || 0) / (project.targetAmount || 1)) * 100

  return (
    <div className="card p-4 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <h4 className="font-semibold text-gray-900 text-sm">{project.title}</h4>
        <span className="px-2 py-1 text-xs font-medium bg-primary-100 text-primary-800 rounded">
          {getCategoryLabel(project.category)}
        </span>
      </div>
      <p className="text-gray-600 text-xs mb-3 line-clamp-2">{project.description}</p>
      
      <div className="space-y-2">
        <div className="flex justify-between text-xs">
          <span className="text-gray-600">المبلغ المطلوب:</span>
          <span className="font-medium">{(project.targetAmount || 0).toLocaleString()} د.ج</span>
        </div>
        <div className="flex justify-between text-xs">
          <span className="text-gray-600">المبلغ المحصل:</span>
          <span className="font-medium text-primary-600">{(project.raisedAmount || 0).toLocaleString()} د.ج</span>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-1.5">
          <div 
            className="bg-primary-600 h-1.5 rounded-full transition-all duration-300" 
            style={{ width: `${Math.min(progress, 100)}%` }}
          ></div>
        </div>
        
        <div className="flex justify-between text-xs text-gray-500">
          <span>{progress.toFixed(1)}% مكتمل</span>
          <span>{project.daysLeft || 0} يوم متبقي</span>
        </div>
      </div>
      
      <button className="btn-primary w-full mt-3 text-xs py-2">
        استثمر الآن
      </button>
    </div>
  )
}

function InvestmentCard({ investment }: { investment: any }) {
  return (
    <div className="card p-4">
      <div className="flex justify-between items-start">
        <div>
          <h4 className="font-semibold text-gray-900">{investment.project.title}</h4>
          <p className="text-sm text-gray-600">{getCategoryLabel(investment.project.category)}</p>
        </div>
        <span className="px-2 py-1 text-xs font-medium bg-secondary-100 text-secondary-800 rounded">
          {investment.status}
        </span>
      </div>
      <div className="mt-3 space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">المبلغ المستثمر:</span>
          <span className="font-medium">{(investment.amount || 0).toLocaleString()} د.ج</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">تاريخ الاستثمار:</span>
          <span className="font-medium">{new Date(investment.createdAt).toLocaleDateString('ar-SA')}</span>
        </div>
      </div>
    </div>
  )
}

function MyProjectCard({ project }: { project: any }) {
  const progress = ((project.raisedAmount || 0) / (project.targetAmount || 1)) * 100

  return (
    <div className="card p-4 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <h4 className="font-semibold text-gray-900 text-sm">{project.title}</h4>
        <span className={`px-2 py-1 text-xs font-medium rounded ${
          project.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
        }`}>
          {project.status === 'ACTIVE' ? 'نشط' : 'معلق'}
        </span>
      </div>
      <p className="text-gray-600 text-xs mb-3 line-clamp-2">{project.description}</p>
      
      <div className="space-y-2">
        <div className="flex justify-between text-xs">
          <span className="text-gray-600">المبلغ المطلوب:</span>
          <span className="font-medium">{(project.targetAmount || 0).toLocaleString()} د.ج</span>
        </div>
        <div className="flex justify-between text-xs">
          <span className="text-gray-600">المبلغ المحصل:</span>
          <span className="font-medium text-primary-600">{(project.raisedAmount || 0).toLocaleString()} د.ج</span>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-1.5">
          <div 
            className="bg-primary-600 h-1.5 rounded-full transition-all duration-300" 
            style={{ width: `${Math.min(progress, 100)}%` }}
          ></div>
        </div>
        
        <div className="flex justify-between text-xs text-gray-500">
          <span>{progress.toFixed(1)}% مكتمل</span>
          <span>{project.investorsCount || 0} مستثمر</span>
        </div>
      </div>
      
      <div className="flex space-x-2 mt-3">
        <button className="btn-outline flex-1 text-xs py-1">
          تعديل
        </button>
        <button className="btn-outline flex-1 text-xs py-1">
          تفاصيل
        </button>
      </div>
    </div>
  )
} 