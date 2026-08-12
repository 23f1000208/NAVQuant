import React from 'react';
import { Star } from 'lucide-react';

interface StarRatingProps {
  rating: number; // 1 to 5
  maxRating?: number;
  size?: 'sm' | 'md' | 'lg';
  showScore?: boolean;
  interactive?: boolean;
  onChange?: (newRating: number) => void;
}

export const StarRating: React.FC<StarRatingProps> = ({
  rating,
  maxRating = 5,
  size = 'md',
  showScore = false,
  interactive = false,
  onChange
}) => {
  const [hoverRating, setHoverRating] = React.useState<number | null>(null);

  const starSizes = {
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  };

  const currentDisplay = hoverRating !== null ? hoverRating : rating;

  return (
    <div className="inline-flex items-center gap-1">
      <div className="flex items-center gap-0.5">
        {Array.from({ length: maxRating }).map((_, index) => {
          const starValue = index + 1;
          const isFilled = currentDisplay >= starValue;
          const isHalf = !isFilled && currentDisplay >= starValue - 0.5;

          return (
            <button
              key={index}
              type="button"
              disabled={!interactive}
              onClick={() => interactive && onChange && onChange(starValue)}
              onMouseEnter={() => interactive && setHoverRating(starValue)}
              onMouseLeave={() => interactive && setHoverRating(null)}
              className={`${interactive ? 'cursor-pointer p-0.5 hover:scale-110 transition-transform' : 'cursor-default'} focus:outline-none`}
            >
              <Star
                className={`${starSizes[size]} transition-colors ${
                  isFilled
                    ? 'text-amber-400 fill-amber-400 drop-shadow-[0_0_6px_rgba(251,191,36,0.5)]'
                    : isHalf
                    ? 'text-amber-400 fill-amber-400/50'
                    : 'text-slate-700 fill-slate-800'
                }`}
              />
            </button>
          );
        })}
      </div>
      {showScore && (
        <span className="text-xs font-bold text-amber-300 ml-1 font-mono">
          {rating.toFixed(1)} ★
        </span>
      )}
    </div>
  );
};
