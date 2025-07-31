'use client'

import { useState } from 'react'
import { X, DollarSign, AlertCircle } from 'lucide-react'

interface InvestmentModalProps {
  isOpen: boolean
  onClose: () => void
  project: any
  onInvest: (amount: number) => Promise<void>
}

export default function InvestmentModal({ isOpen, onClose, project, onInvest }: InvestmentModalProps) {
  const [amount, setAmount] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const investmentAmount = parseFloat(amount)
      if (investmentAmount <= 0) {
        setError('المبلغ يجب أن يكون أكبر من صفر')
        return
      }

      if (investmentAmount > project.targetAmount - project.raisedAmount) {
        setError('المبلغ يتجاوز المبلغ المتبقي المطلوب')
        return
      }

      await onInvest(investmentAmount)
      onClose()
    } catch (error) {
      setError('حدث خطأ أثناء الاستثمار')
    } finally {
      setLoading(false)
    }
  }

  const remainingAmount = project.targetAmount - project.raisedAmount
  const progress = (project.raisedAmount / project.targetAmount) * 100

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-md w-full mx-4">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">استثمار في المشروع</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6">
          <div className="mb-6">
            <h4 className="font-medium text-gray-900 mb-2">{project.title}</h4>
            <p className="text-sm text-gray-600 mb-4">{project.description}</p>
            
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">المبلغ المطلوب:</span>
                <span className="font-medium">{project.targetAmount.toLocaleString()} د.ج</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">المبلغ المحصل:</span>
                <span className="font-medium">{project.raisedAmount.toLocaleString()} د.ج</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">المبلغ المتبقي:</span>
                <span className="font-medium text-primary-600">{remainingAmount.toLocaleString()} د.ج</span>
              </div>
              
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-primary-600 h-2 rounded-full" 
                  style={{ width: `${Math.min(progress, 100)}%` }}
                ></div>
              </div>
              
              <div className="text-xs text-gray-500 text-center">
                {progress.toFixed(1)}% مكتمل
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                مبلغ الاستثمار (د.ج)
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="input-field pl-10"
                  placeholder="أدخل المبلغ"
                  min="1"
                  max={remainingAmount}
                  step="100"
                  required
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                الحد الأقصى: {remainingAmount.toLocaleString()} د.ج
              </p>
            </div>

            {error && (
              <div className="flex items-center space-x-2 text-red-600 text-sm">
                <AlertCircle size={16} />
                <span>{error}</span>
              </div>
            )}

            <div className="flex space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="btn-outline flex-1"
              >
                إلغاء
              </button>
              <button
                type="submit"
                disabled={loading || !amount}
                className="btn-primary flex-1 flex items-center justify-center space-x-2"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                  <DollarSign size={16} />
                )}
                <span>{loading ? 'جاري الاستثمار...' : 'استثمر الآن'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
} 