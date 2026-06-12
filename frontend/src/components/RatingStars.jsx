import React, { useState } from 'react';

/**
 * Componente interactivo y estático para mostrar/seleccionar estrellas.
 * @param {number} rating - Valor actual del rating.
 * @param {boolean} interactive - Si es true, permite hacer hover y hacer click para seleccionar.
 * @param {function} onChange - Función callback al cambiar el rating (solo si es interactivo).
 * @param {number} size - Tamaño de las estrellas en px (ej. 5 para w-5 h-5).
 */
export default function RatingStars({ rating = 0, interactive = false, onChange, size = 5 }) {
  const [hoverRating, setHoverRating] = useState(0);

  const handleClick = (value) => {
    if (interactive && onChange) {
      onChange(value);
    }
  };

  const handleMouseEnter = (value) => {
    if (interactive) {
      setHoverRating(value);
    }
  };

  const handleMouseLeave = () => {
    if (interactive) {
      setHoverRating(0);
    }
  };

  const currentVal = hoverRating || rating;

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          onClick={() => handleClick(star)}
          onMouseEnter={() => handleMouseEnter(star)}
          onMouseLeave={handleMouseLeave}
          className={`w-${size} h-${size} transition-all duration-150 ${
            interactive ? 'cursor-pointer hover:scale-110 active:scale-95' : ''
          } ${
            star <= currentVal
              ? 'text-amber-400 fill-current'
              : 'text-slate-300 fill-none'
          }`}
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ))}
    </div>
  );
}
