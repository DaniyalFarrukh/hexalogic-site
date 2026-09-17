'use client'

import { useState } from 'react'
import { Star, CheckCircle } from 'lucide-react'
import { submitRating } from '@/app/portal/(authenticated)/[slug]/actions'

export default function ProjectRating({ projectId }: { projectId: string }) {
  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [feedback, setFeedback] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (rating === 0) {
      setError('Please select a star rating')
      return
    }

    setIsSubmitting(true)
    setError(null)

    const res = await submitRating(projectId, rating, feedback)
    setIsSubmitting(false)

    if (res?.error) {
      setError(res.error)
    } else {
      setSubmitted(true)
    }
  }

  if (submitted) {
    return (
      <div className="bg-white border border-gray-200 rounded-2xl p-8 text-center relative overflow-hidden shadow-sm">
        <div className="absolute inset-0 bg-brand-primary/5 pointer-events-none" />
        <CheckCircle className="w-12 h-12 text-brand-primary mx-auto mb-4" aria-hidden="true" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Thank you for your feedback!</h2>
        <p className="text-gray-500">Your review has been submitted successfully.</p>
      </div>
    )
  }

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-sm">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">How was your experience?</h2>
        <p className="text-gray-500 text-sm">Your project is complete. We would love to hear your feedback.</p>
      </div>

      <form onSubmit={handleSubmit} className="max-w-xl mx-auto">
        {error && (
          <div role="alert" className="mb-6 p-3 bg-red-50 border border-red-200 text-red-600 rounded-md text-sm text-center">
            {error}
          </div>
        )}

        <div className="flex justify-center gap-1 mb-8" role="radiogroup" aria-label="Star rating">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              role="radio"
              aria-checked={rating === star}
              aria-label={`${star} star${star === 1 ? '' : 's'}`}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              onClick={() => setRating(star)}
              className="p-1.5 min-w-[44px] min-h-[44px] focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary rounded-lg transition-transform hover:scale-110"
            >
              <Star
                className={`w-9 h-9 transition-colors ${
                  (hoverRating || rating) >= star
                    ? 'fill-brand-primary text-brand-primary'
                    : 'text-gray-300'
                }`}
                aria-hidden="true"
              />
            </button>
          ))}
        </div>

        <div className="space-y-4">
          <label className="block">
            <span className="text-sm font-bold text-gray-900 mb-2 block">Additional Feedback <span className="text-gray-500 font-normal">(Optional)</span></span>
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              maxLength={2000}
              placeholder="What did you love? What could be improved?"
              className="w-full bg-white border border-gray-300 rounded-xl p-4 text-gray-900 placeholder:text-gray-400 focus:border-brand-primary focus:ring-1 focus:ring-brand-primary outline-none transition-colors min-h-[120px]"
            />
          </label>

          <button
            type="submit"
            disabled={isSubmitting || rating === 0}
            className="w-full bg-brand-primary hover:bg-[#ff8947] text-white font-bold uppercase tracking-wider py-4 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Review'}
          </button>
        </div>
      </form>
    </div>
  )
}
