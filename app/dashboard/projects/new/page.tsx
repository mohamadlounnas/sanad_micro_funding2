'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { 
  ArrowLeft, 
  Save, 
  Upload, 
  DollarSign, 
  Calendar, 
  Target, 
  FileText,
  Image,
  TrendingUp,
  Users,
  Globe,
  Lightbulb
} from 'lucide-react'

const PROJECT_CATEGORIES = [
  'TECHNOLOGY',
  'FOOD_AND_BEVERAGE',
  'RETAIL',
  'SERVICES',
  'MANUFACTURING',
  'AGRICULTURE',
  'HEALTHCARE',
  'EDUCATION',
  'ENTERTAINMENT',
  'OTHER'
]

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

const CATEGORY_ICONS = {
  TECHNOLOGY: <Globe className="w-5 h-5" />,
  FOOD_AND_BEVERAGE: <DollarSign className="w-5 h-5" />,
  RETAIL: <TrendingUp className="w-5 h-5" />,
  SERVICES: <Users className="w-5 h-5" />,
  MANUFACTURING: <Target className="w-5 h-5" />,
  AGRICULTURE: <Image className="w-5 h-5" />,
  HEALTHCARE: <FileText className="w-5 h-5" />,
  EDUCATION: <Lightbulb className="w-5 h-5" />,
  ENTERTAINMENT: <TrendingUp className="w-5 h-5" />,
  OTHER: <Lightbulb className="w-5 h-5" />
}

export default function NewProjectPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'TECHNOLOGY',
    targetAmount: '',
    endDate: '',
    equityPercentage: ''
  })
  const [currentStep, setCurrentStep] = useState(1)
  const [selectedCategory, setSelectedCategory] = useState('TECHNOLOGY')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        const result = await response.json()
        alert('تم إنشاء المشروع بنجاح!')
        router.push('/dashboard')
        // Force refresh the dashboard data
        window.location.reload()
      } else {
        const error = await response.json()
        alert(error.error || 'حدث خطأ أثناء إنشاء المشروع')
      }
    } catch (error) {
      alert('حدث خطأ أثناء إنشاء المشروع')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-gray-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <button
                onClick={() => router.back()}
                className="flex items-center space-x-2 text-gray-500 hover:text-gray-700 transition-colors"
              >
                <ArrowLeft size={20} />
                <span>العودة</span>
              </button>
            </div>
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-primary-600">ساند</h1>
              <span className="ml-2 text-gray-500">Sanad</span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-4">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium ${
                  currentStep >= step 
                    ? 'bg-primary-600 text-white' 
                    : 'bg-gray-200 text-gray-500'
                }`}>
                  {step}
                </div>
                {step < 3 && (
                  <div className={`w-16 h-1 mx-2 ${
                    currentStep > step ? 'bg-primary-600' : 'bg-gray-200'
                  }`}></div>
                )}
              </div>
            ))}
          </div>
          <div className="text-center mt-4">
            <p className="text-sm text-gray-600">
              {currentStep === 1 && 'معلومات المشروع الأساسية'}
              {currentStep === 2 && 'تفاصيل التمويل'}
              {currentStep === 3 && 'مراجعة وإرسال'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <div className="card">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">إنشاء مشروع جديد</h2>
                <p className="text-gray-600 mt-1">أضف تفاصيل مشروعك لجذب المستثمرين</p>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Project Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                عنوان المشروع *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                className="input-field"
                placeholder="أدخل عنوان المشروع"
                required
              />
            </div>

            {/* Project Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                وصف المشروع *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                className="input-field"
                rows={4}
                placeholder="اشرح فكرة مشروعك وأهدافه"
                required
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                فئة المشروع *
              </label>
              <select
                value={formData.category}
                onChange={(e) => handleInputChange('category', e.target.value)}
                className="input-field"
                required
              >
                {PROJECT_CATEGORIES.map(category => (
                  <option key={category} value={category}>
                    {CATEGORY_LABELS[category as keyof typeof CATEGORY_LABELS]}
                  </option>
                ))}
              </select>
            </div>

            {/* Target Amount */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                المبلغ المطلوب (د.ج) *
              </label>
              <input
                type="number"
                value={formData.targetAmount}
                onChange={(e) => handleInputChange('targetAmount', e.target.value)}
                className="input-field"
                placeholder="أدخل المبلغ المطلوب"
                min="1000"
                required
              />
            </div>

            {/* End Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                تاريخ انتهاء الحملة *
              </label>
              <input
                type="date"
                value={formData.endDate}
                onChange={(e) => handleInputChange('endDate', e.target.value)}
                className="input-field"
                min={new Date().toISOString().split('T')[0]}
                required
              />
            </div>

            {/* Equity Percentage */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                نسبة الأسهم المقدمة (%) *
              </label>
              <input
                type="number"
                value={formData.equityPercentage}
                onChange={(e) => handleInputChange('equityPercentage', e.target.value)}
                className="input-field"
                placeholder="أدخل نسبة الأسهم"
                min="1"
                max="100"
                step="0.1"
                required
              />
              <p className="text-sm text-gray-500 mt-1">
                هذه هي النسبة المئوية من الشركة التي ستقدمها للمستثمرين
              </p>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end space-x-4 pt-6">
              <button
                type="button"
                onClick={() => router.back()}
                className="btn-outline"
              >
                إلغاء
              </button>
              <button
                type="submit"
                disabled={loading}
                className="btn-primary flex items-center space-x-2"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                  <Save size={20} />
                )}
                <span>{loading ? 'جاري الإنشاء...' : 'إنشاء المشروع'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
} 