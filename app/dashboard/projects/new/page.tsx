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
  Lightbulb,
  CheckCircle,
  AlertCircle
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

  const canProceedToNext = () => {
    if (currentStep === 1) {
      return formData.title && formData.description
    }
    if (currentStep === 2) {
      return formData.targetAmount && formData.equityPercentage && formData.endDate
    }
    return true
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
                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300 ${
                  currentStep >= step 
                    ? 'bg-primary-600 text-white shadow-lg' 
                    : 'bg-gray-200 text-gray-500'
                }`}>
                  {currentStep > step ? <CheckCircle size={20} /> : step}
                </div>
                {step < 3 && (
                  <div className={`w-20 h-1 mx-3 rounded-full transition-all duration-300 ${
                    currentStep > step ? 'bg-primary-600' : 'bg-gray-200'
                  }`}></div>
                )}
              </div>
            ))}
          </div>
          <div className="text-center mt-4">
            <p className="text-sm text-gray-600 font-medium">
              {currentStep === 1 && 'معلومات المشروع الأساسية'}
              {currentStep === 2 && 'تفاصيل التمويل'}
              {currentStep === 3 && 'مراجعة وإرسال'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <div className="card shadow-xl">
              <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-primary-50 to-blue-50">
                <h2 className="text-xl font-semibold text-gray-900">إنشاء مشروع جديد</h2>
                <p className="text-gray-600 mt-1">أضف تفاصيل مشروعك لجذب المستثمرين</p>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                {/* Step 1: Basic Information */}
                {currentStep === 1 && (
                  <div className="space-y-6">
                    <div className="text-center mb-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">معلومات المشروع الأساسية</h3>
                      <p className="text-gray-600">ابدأ بإدخال المعلومات الأساسية لمشروعك</p>
                    </div>

                    {/* Project Title */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        عنوان المشروع *
                      </label>
                      <input
                        type="text"
                        value={formData.title}
                        onChange={(e) => handleInputChange('title', e.target.value)}
                        className="input-field focus:ring-2 focus:ring-primary-500 focus:border-transparent"
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
                        className="input-field focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        rows={6}
                        placeholder="اشرح فكرة مشروعك وأهدافه بالتفصيل"
                        required
                      />
                    </div>

                    {/* Category Selection */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-4">
                        فئة المشروع *
                      </label>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {PROJECT_CATEGORIES.map(category => (
                          <button
                            key={category}
                            type="button"
                            onClick={() => {
                              setSelectedCategory(category)
                              handleInputChange('category', category)
                            }}
                            className={`p-4 rounded-lg border-2 transition-all duration-200 hover:shadow-md ${
                              selectedCategory === category
                                ? 'border-primary-600 bg-primary-50 text-primary-700 shadow-md'
                                : 'border-gray-200 hover:border-gray-300 bg-white hover:bg-gray-50'
                            }`}
                          >
                            <div className="flex items-center space-x-2">
                              <div className="text-primary-600">
                                {CATEGORY_ICONS[category as keyof typeof CATEGORY_ICONS]}
                              </div>
                              <span className="text-sm font-medium">
                                {CATEGORY_LABELS[category as keyof typeof CATEGORY_LABELS]}
                              </span>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="flex justify-between pt-6">
                      <button
                        type="button"
                        onClick={() => router.back()}
                        className="btn-outline"
                      >
                        إلغاء
                      </button>
                      <button
                        type="button"
                        onClick={() => setCurrentStep(2)}
                        disabled={!canProceedToNext()}
                        className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        التالي
                      </button>
                    </div>
                  </div>
                )}

                {/* Step 2: Funding Details */}
                {currentStep === 2 && (
                  <div className="space-y-6">
                    <div className="text-center mb-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">تفاصيل التمويل</h3>
                      <p className="text-gray-600">حدد متطلبات التمويل وشروط الاستثمار</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Target Amount */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          المبلغ المطلوب (د.ج) *
                        </label>
                        <div className="relative">
                          <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                          <input
                            type="number"
                            value={formData.targetAmount}
                            onChange={(e) => handleInputChange('targetAmount', e.target.value)}
                            className="input-field pl-10 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            placeholder="أدخل المبلغ المطلوب"
                            min="1000"
                            required
                          />
                        </div>
                      </div>

                      {/* Equity Percentage */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          نسبة الأسهم المقدمة (%) *
                        </label>
                        <div className="relative">
                          <Target className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                          <input
                            type="number"
                            value={formData.equityPercentage}
                            onChange={(e) => handleInputChange('equityPercentage', e.target.value)}
                            className="input-field pl-10 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            placeholder="أدخل نسبة الأسهم"
                            min="1"
                            max="100"
                            step="0.1"
                            required
                          />
                        </div>
                      </div>
                    </div>

                    {/* End Date */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        تاريخ انتهاء الحملة *
                      </label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                        <input
                          type="date"
                          value={formData.endDate}
                          onChange={(e) => handleInputChange('endDate', e.target.value)}
                          className="input-field pl-10 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          min={new Date().toISOString().split('T')[0]}
                          required
                        />
                      </div>
                    </div>

                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                      <h4 className="font-medium text-blue-900 mb-2 flex items-center">
                        <Lightbulb className="w-4 h-4 mr-2" />
                        نصائح لجذب المستثمرين
                      </h4>
                      <ul className="text-sm text-blue-800 space-y-1">
                        <li>• اكتب وصفاً مفصلاً ومقنعاً لمشروعك</li>
                        <li>• حدد مبلغاً واقعياً ومبرراً</li>
                        <li>• قدم نسبة أسهم عادلة ومغرية</li>
                        <li>• اذكر الفوائد المتوقعة للمستثمرين</li>
                      </ul>
                    </div>

                    <div className="flex justify-between pt-6">
                      <button
                        type="button"
                        onClick={() => setCurrentStep(1)}
                        className="btn-outline"
                      >
                        السابق
                      </button>
                      <button
                        type="button"
                        onClick={() => setCurrentStep(3)}
                        disabled={!canProceedToNext()}
                        className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        التالي
                      </button>
                    </div>
                  </div>
                )}

                {/* Step 3: Review and Submit */}
                {currentStep === 3 && (
                  <div className="space-y-6">
                    <div className="text-center mb-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">مراجعة وإرسال</h3>
                      <p className="text-gray-600">راجع معلومات مشروعك قبل الإرسال</p>
                    </div>

                    <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium text-gray-600">عنوان المشروع</label>
                          <p className="text-gray-900 font-medium">{formData.title}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-600">الفئة</label>
                          <p className="text-gray-900 font-medium">
                            {CATEGORY_LABELS[formData.category as keyof typeof CATEGORY_LABELS]}
                          </p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-600">المبلغ المطلوب</label>
                          <p className="text-gray-900 font-medium">{formData.targetAmount} د.ج</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-600">نسبة الأسهم</label>
                          <p className="text-gray-900 font-medium">{formData.equityPercentage}%</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-600">تاريخ الانتهاء</label>
                          <p className="text-gray-900 font-medium">{formData.endDate}</p>
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">وصف المشروع</label>
                        <p className="text-gray-900 mt-1">{formData.description}</p>
                      </div>
                    </div>

                    <div className="flex justify-between pt-6">
                      <button
                        type="button"
                        onClick={() => setCurrentStep(2)}
                        className="btn-outline"
                      >
                        السابق
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
                  </div>
                )}
              </form>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="card sticky top-8 shadow-lg">
              <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-primary-50 to-blue-50">
                <h3 className="text-lg font-semibold text-gray-900">دليل إنشاء المشروع</h3>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex items-start space-x-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    currentStep >= 1 ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-500'
                  }`}>
                    <span className="text-sm font-medium">1</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">معلومات أساسية</h4>
                    <p className="text-sm text-gray-600">أدخل عنوان ووصف المشروع</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    currentStep >= 2 ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-500'
                  }`}>
                    <span className="text-sm font-medium">2</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">تفاصيل التمويل</h4>
                    <p className="text-sm text-gray-600">حدد المبلغ ونسبة الأسهم</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    currentStep >= 3 ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-500'
                  }`}>
                    <span className="text-sm font-medium">3</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">مراجعة وإرسال</h4>
                    <p className="text-sm text-gray-600">راجع المعلومات وأرسل المشروع</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 