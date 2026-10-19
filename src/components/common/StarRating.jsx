import React from 'react'
import { Star } from 'lucide-react'

export const StarRating = ({
  rating = 0,
  max = 5,
  size = 16,
  interactive = false,
  onChange,
  className = '',
}) => {
  const currentRating = Math.round(rating)

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      {Array.from({ length: max }).map((_, index) => {
        const starValue = index + 1
        const isFilled = starValue <= currentRating

        return (
          <button
            type="button"
            key={index}
            disabled={!interactive}
            onClick={() => interactive && onChange && onChange(starValue)}
            className={`${
              interactive ? 'cursor-pointer hover:scale-110 transition-transform' : 'cursor-default'
            } focus:outline-none`}
          >
            <Star
              size={size}
              className={`${
                isFilled
                  ? 'text-amber-400 fill-amber-400'
                  : 'text-slate-300 dark:text-slate-600'
              }`}
            />
          </button>
        )
      })}
    </div>
  )
}

export default StarRating
