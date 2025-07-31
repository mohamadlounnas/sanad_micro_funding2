'use client'

import { useState, useEffect } from 'react'
import { Search, Filter, MapPin, Users, Calendar, DollarSign, TrendingUp, Building2, Coffee, Smartphone, Truck, Leaf, Briefcase } from 'lucide-react'
import { mockProjects } from '@/lib/mockData'

// Category mapping with Arabic names and icons
const categories = {
  FOOD_AND_BEVERAGE: { name: 'الطعام والمشروبات', icon: Coffee, color: 'bg-orange-100 text-orange-600' },
  TECHNOLOGY: { name: 'التكنولوجيا', icon: Smartphone, color: 'bg-blue-100 text-blue-600' },
  MANUFACTURING: { name: 'التصنيع', icon: Building2, color: 'bg-purple-100 text-purple-600' },
  SERVICES: { name: 'الخدمات', icon: Briefcase, color: 'bg-green-100 text-green-600' },
  AGRICULTURE: { name: 'الزراعة', icon: Leaf, color: 'bg-emerald-100 text-emerald-600' }
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState(mockProjects)
  const [filteredProjects, setFilteredProjects] = useState(mockProjects)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('ALL')
  const [sortBy, setSortBy] = useState('newest')

  // Filter and search projects
  useEffect(() => {
    let filtered = projects

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(project =>
        project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.owner.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Filter by category
    if (selectedCategory !== 'ALL') {
      filtered = filtered.filter(project => project.category === selectedCategory)
    }

    // Sort projects
    switch (sortBy) {
      case 'newest':
        filtered = filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        break
      case 'oldest':
        filtered = filtered.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
        break
      case 'highest-amount':
        filtered = filtered.sort((a, b) => b.targetAmount - a.targetAmount)
        break
      case 'lowest-amount':
        filtered = filtered.sort((a, b) => a.targetAmount - b.targetAmount)
        break
      case 'most-funded':
        filtered = filtered.sort((a, b) => (b.raisedAmount / b.targetAmount) - (a.raisedAmount / a.targetAmount))
        break
      case 'ending-soon':
        filtered = filtered.sort((a, b) => a.daysLeft - b.daysLeft)
        break
    }

    setFilteredProjects(filtered)
  }, [projects, searchTerm, selectedCategory, sortBy])

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

  return (
    <div dir="rtl" className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50">
      {/* Page Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold text-gray-900 font-arabic">اكتشف المشاريع</h1>
            <p className="text-lg text-gray-600">ابحث عن فرص الاستثمار المثيرة في الجزائر</p>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="ابحث عن مشروع..."
                className="w-full pr-10 pl-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-right"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Category Filter */}
            <select
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-right appearance-none"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="ALL">جميع الفئات</option>
              {Object.entries(categories).map(([key, category]) => (
                <option key={key} value={key}>{category.name}</option>
              ))}
            </select>

            {/* Sort */}
            <select
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-right appearance-none"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="newest">الأحدث</option>
              <option value="oldest">الأقدم</option>
              <option value="highest-amount">أعلى مبلغ</option>
              <option value="lowest-amount">أقل مبلغ</option>
              <option value="most-funded">الأكثر تمويلاً</option>
              <option value="ending-soon">ينتهي قريباً</option>
            </select>

            {/* Results Count */}
            <div className="flex items-center justify-center px-4 py-3 bg-gray-50 rounded-lg">
              <span className="text-gray-600">
                {filteredProjects.length} مشروع
              </span>
            </div>
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => {
            const CategoryIcon = categories[project.category as keyof typeof categories]?.icon || Building2
            const categoryColor = categories[project.category as keyof typeof categories]?.color || 'bg-gray-100 text-gray-600'
            const progressPercentage = getProgressPercentage(project.raisedAmount, project.targetAmount)

            return (
              <div key={project.id} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                {/* Project Image Placeholder */}
                <div className="h-48 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-t-2xl flex items-center justify-center">
                  <CategoryIcon className="h-16 w-16 text-primary-600 opacity-60" />
                </div>

                {/* Project Content */}
                <div className="p-6 space-y-4">
                  {/* Category Badge */}
                  <div className="flex items-center justify-between">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${categoryColor}`}>
                      <CategoryIcon className="h-4 w-4 ml-1" />
                      {categories[project.category as keyof typeof categories]?.name}
                    </span>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                      {project.status === 'ACTIVE' ? 'نشط' : project.status}
                    </span>
                  </div>

                  {/* Project Title */}
                  <h3 className="text-xl font-bold text-gray-900 line-clamp-2">
                    {project.title}
                  </h3>

                  {/* Project Description */}
                  <p className="text-gray-600 text-sm line-clamp-3">
                    {project.description}
                  </p>

                  {/* Project Owner */}
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <Users className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-600">{project.owner.name}</span>
                  </div>

                  {/* Funding Progress */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">المبلغ المطلوب</span>
                      <span className="font-medium">{formatCurrency(project.targetAmount)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">المبلغ المحصل</span>
                      <span className="font-medium text-primary-600">{formatCurrency(project.raisedAmount)}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-primary-500 to-primary-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${progressPercentage}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>{progressPercentage.toFixed(1)}% محقق</span>
                      <span>{project.equityPercentage}% حصة</span>
                    </div>
                  </div>

                  {/* Project Stats */}
                  <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-100">
                    <div className="text-center">
                      <div className="flex items-center justify-center mb-1">
                        <Users className="h-4 w-4 text-gray-400" />
                      </div>
                      <div className="text-sm font-medium text-gray-900">{project.investorsCount}</div>
                      <div className="text-xs text-gray-500">مستثمر</div>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center mb-1">
                        <Calendar className="h-4 w-4 text-gray-400" />
                      </div>
                      <div className="text-sm font-medium text-gray-900">{project.daysLeft}</div>
                      <div className="text-xs text-gray-500">يوم متبقي</div>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center mb-1">
                        <TrendingUp className="h-4 w-4 text-gray-400" />
                      </div>
                      <div className="text-sm font-medium text-gray-900">{project.equityPercentage}%</div>
                      <div className="text-xs text-gray-500">نسبة الملكية</div>
                    </div>
                  </div>

                                                {/* Action Button */}
                              <button 
                                onClick={() => window.location.href = `/projects/${project.id}`}
                                className="w-full btn-primary py-3 text-sm font-medium"
                              >
                                عرض التفاصيل
                              </button>
                </div>
              </div>
            )
          })}
        </div>

        {/* Empty State */}
        {filteredProjects.length === 0 && (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">لا توجد مشاريع</h3>
            <p className="text-gray-600">جرب تغيير معايير البحث أو الفلترة</p>
          </div>
        )}
      </div>
    </div>
  )
} 