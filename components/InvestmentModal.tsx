'use client'

import { useState, useEffect } from 'react'
import { X, DollarSign, TrendingUp, AlertCircle, CheckCircle, Info } from 'lucide-react'

interface Project {
  id: string
  title: string
  targetAmount: number
  raisedAmount: number
  equityPercentage: number
  daysLeft: number
  status: string
}

interface InvestmentModalProps {
  project: Project
  onClose: () => void
  onSuccess: () => void
}

export default function InvestmentModal({ project, onClose, onSuccess }: InvestmentModalProps) {
  const [investmentAmount, setInvestmentAmount] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const minInvestment = 10000
  const maxInvestment = Math.min(project.targetAmount * 0.1, project.targetAmount - project.raisedAmount)
  const remainingAmount = project.targetAmount - project.raisedAmount

  const calculateEquityPercentage = (amount: number) => {
    return (amount / project.targetAmount) * project.equityPercentage
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ar-DZ', {
      style: 'currency',
      currency: 'DZD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  const validateInvestment = (amount: number) => {
    if (amount < minInvestment) {
      return `الحد الأدنى للاستثمار هو ${formatCurrency(minInvestment)}`
    }
    if (amount > maxInvestment) {
      return `الحد الأقصى للاستثمار هو ${formatCurrency(maxInvestment)}`
    }
    if (amount > remainingAmount) {
      return `المبلغ المتبقي للاستثمار هو ${formatCurrency(remainingAmount)}`
    }
    return ''
  }

  const handleInvestmentChange = (value: string) => {
    const amount = parseInt(value) || 0
    setInvestmentAmount(value)
    setError(validateInvestment(amount))
  }

  const handleQuickAmount = (percentage: number) => {
    const amount = Math.floor(remainingAmount * percentage)
    const validAmount = Math.min(amount, maxInvestment)
    setInvestmentAmount(validAmount.toString())
    setError(validateInvestment(validAmount))
  }

  const handleSubmit = async () => {
    const amount = parseInt(investmentAmount)
    const validationError = validateInvestment(amount)
    
    if (validationError) {
      setError(validationError)
      return
    }

    setLoading(true)
    setError('')

    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/investments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          projectId: project.id,
          amount: amount
        })
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess(true)
        setTimeout(() => {
          onSuccess()
        }, 2000)
      } else {
        setError(data.error || 'حدث خطأ أثناء الاستثمار')
      }
    } catch (error) {
      setError('حدث خطأ في الاتصال')
    } finally {
      setLoading(false)
    }
  }

  const equityPercentage = calculateEquityPercentage(parseInt(investmentAmount) || 0)

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">استثمار في المشروع</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Project Info */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-2">{project.title}</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">المبلغ المطلوب:</span>
                <span className="font-medium">{formatCurrency(project.targetAmount)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">المبلغ المحصل:</span>
                <span className="font-medium text-primary-600">{formatCurrency(project.raisedAmount)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">المبلغ المتبقي:</span>
                <span className="font-medium">{formatCurrency(remainingAmount)}</span>
              </div>
            </div>
          </div>

          {/* Investment Amount */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              مبلغ الاستثمار
            </label>
            <div className="relative">
              <DollarSign className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="number"
                value={investmentAmount}
                onChange={(e) => handleInvestmentChange(e.target.value)}
                placeholder="أدخل مبلغ الاستثمار"
                className="w-full pr-10 pl-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-right"
                min={minInvestment}
                max={maxInvestment}
              />
            </div>
            {error && (
              <div className="flex items-center space-x-2 space-x-reverse mt-2 text-red-600 text-sm">
                <AlertCircle className="h-4 w-4" />
                <span>{error}</span>
              </div>
            )}
          </div>

          {/* Quick Amount Buttons */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              مبالغ سريعة
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => handleQuickAmount(0.1)}
                className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                10%
              </button>
              <button
                onClick={() => handleQuickAmount(0.25)}
                className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                25%
              </button>
              <button
                onClick={() => handleQuickAmount(0.5)}
                className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                50%
              </button>
            </div>
          </div>

          {/* Investment Summary */}
          {investmentAmount && !error && (
            <div className="bg-primary-50 rounded-lg p-4">
              <h4 className="font-semibold text-primary-900 mb-3">ملخص الاستثمار</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-primary-700">مبلغ الاستثمار:</span>
                  <span className="font-medium text-primary-900">{formatCurrency(parseInt(investmentAmount))}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-primary-700">نسبة الملكية:</span>
                  <span className="font-medium text-primary-900">{equityPercentage.toFixed(2)}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-primary-700">المشروع:</span>
                  <span className="font-medium text-primary-900">{project.title}</span>
                </div>
              </div>
            </div>
          )}

          {/* Investment Limits */}
          <div className="bg-yellow-50 rounded-lg p-4">
            <div className="flex items-start space-x-2 space-x-reverse">
              <Info className="h-5 w-5 text-yellow-600 mt-0.5" />
              <div className="text-sm text-yellow-800">
                <p className="font-medium mb-1">حدود الاستثمار:</p>
                <ul className="space-y-1 text-xs">
                  <li>• الحد الأدنى: {formatCurrency(minInvestment)}</li>
                  <li>• الحد الأقصى: {formatCurrency(maxInvestment)}</li>
                  <li>• نسبة الملكية المتاحة: {project.equityPercentage}%</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Success Message */}
          {success && (
            <div className="bg-green-50 rounded-lg p-4">
              <div className="flex items-center space-x-2 space-x-reverse">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span className="text-green-800 font-medium">تم الاستثمار بنجاح!</span>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            إلغاء
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading || !!error || !investmentAmount || success}
            className="btn-primary px-6 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'جاري الاستثمار...' : 'تأكيد الاستثمار'}
          </button>
        </div>
      </div>
    </div>
  )
} 