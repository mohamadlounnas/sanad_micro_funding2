'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Eye, EyeOff, User, Lock, Mail, Phone, Building2, Users } from 'lucide-react'

export default function HomePage() {
  const [isLogin, setIsLogin] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    phone: '',
    role: 'INVESTOR'
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register'
    
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      
      if (response.ok) {
        const data = await response.json()
        localStorage.setItem('token', data.token)
        window.location.href = '/dashboard'
      } else {
        alert('خطأ: ' + (await response.text()))
      }
    } catch (error) {
      console.error('Error:', error)
      alert('حدث خطأ')
    }
  }

  return (
    <div dir="rtl" className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-secondary-50 pt-16">
      <div className="max-w-md w-full space-y-8 p-8">
        {/* Header Section */}
        <div className="text-center space-y-4">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-primary-400 to-primary-600 blur-xl opacity-20"></div>
            <h1 className="relative text-5xl font-bold text-gray-900 mb-2 font-arabic">ساند</h1>
          </div>
          <h2 className="text-2xl font-semibold text-primary-600 mb-2">Sanad</h2>
          <p className="text-gray-600 text-lg">منصة الاستثمار الصغير في الجزائر</p>
          <div className="w-24 h-1 bg-gradient-to-r from-primary-500 to-secondary-500 mx-auto rounded-full"></div>
        </div>

        {/* Main Card */}
        <div className="card shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
          {/* Tab Buttons */}
          <div className="flex mb-8 rounded-xl overflow-hidden shadow-sm">
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-4 px-6 font-medium transition-all duration-300 text-lg ${
                isLogin 
                  ? 'bg-primary-600 text-white shadow-lg transform scale-105' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              تسجيل الدخول
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-4 px-6 font-medium transition-all duration-300 text-lg ${
                !isLogin 
                  ? 'bg-primary-600 text-white shadow-lg transform scale-105' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              إنشاء حساب
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {!isLogin && (
              <>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2 text-right">
                    الاسم الكامل
                  </label>
                  <div className="relative">
                    <User className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <input
                      type="text"
                      required
                      className="input-field pr-12 text-right"
                      placeholder="أدخل اسمك الكامل"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2 text-right">
                    رقم الهاتف
                  </label>
                  <div className="relative">
                    <Phone className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <input
                      type="tel"
                      className="input-field pr-12 text-right"
                      placeholder="أدخل رقم هاتفك"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2 text-right">
                    نوع الحساب
                  </label>
                  <div className="relative">
                    <select
                      className="input-field pr-12 text-right appearance-none"
                      value={formData.role}
                      onChange={(e) => setFormData({...formData, role: e.target.value})}
                    >
                      <option value="INVESTOR">مستثمر</option>
                      <option value="ENTREPRENEUR">رجل أعمال</option>
                    </select>
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                      {formData.role === 'INVESTOR' ? <Users className="h-5 w-5 text-gray-400" /> : <Building2 className="h-5 w-5 text-gray-400" />}
                    </div>
                  </div>
                </div>
              </>
            )}

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 mb-2 text-right">
                البريد الإلكتروني
              </label>
              <div className="relative">
                <Mail className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="email"
                  required
                  className="input-field pr-12 text-right"
                  placeholder="أدخل بريدك الإلكتروني"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 mb-2 text-right">
                كلمة المرور
              </label>
              <div className="relative">
                <Lock className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  className="input-field pr-12 pl-12 text-right"
                  placeholder="أدخل كلمة المرور"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="btn-primary w-full py-4 text-lg font-medium shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
            >
              {isLogin ? 'تسجيل الدخول' : 'إنشاء حساب'}
            </button>
          </form>
        </div>

        {/* Footer */}
        <div className="text-center space-y-4">
          <div className="space-y-2">
            <p className="text-gray-700 font-medium">تمكين الأحلام، بناء المستقبل</p>
            <p className="text-sm text-gray-600">ربط المستثمرين بأحلام المشاريع الصغيرة في الجزائر</p>
          </div>
          
          {/* Navigation Links */}
          <div className="flex justify-center space-x-6 space-x-reverse mt-6">
            <Link 
              href="/projects" 
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-primary-600 bg-primary-50 rounded-lg hover:bg-primary-100 transition-colors duration-200"
            >
              اكتشف المشاريع
            </Link>
            <Link 
              href="/dashboard" 
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-600 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
            >
              لوحة التحكم
            </Link>
          </div>
          
          <div className="flex justify-center space-x-4 space-x-reverse">
            <div className="w-2 h-2 bg-primary-400 rounded-full animate-pulse"></div>
            <div className="w-2 h-2 bg-secondary-400 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
            <div className="w-2 h-2 bg-primary-500 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
          </div>
        </div>
      </div>
    </div>
  )
} 