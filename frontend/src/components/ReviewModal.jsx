import React, { useState } from 'react';
import RatingStars from './RatingStars';
import reviewService from '../services/reviewService';

export default function ReviewModal({ isOpen, onClose, request, onSuccess }) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen || !request) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await reviewService.createReview({
        requestId: request.id,
        rating,
        comment: comment.trim() || null,
      });

      if (response.success) {
        onSuccess(response.data);
        onClose();
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Error al guardar la calificación.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl border border-slate-100 overflow-hidden animate-fade-in-up">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-indigo-800 px-6 py-5 text-white flex justify-between items-center">
          <div>
            <h3 className="font-bold text-lg">Calificar servicio</h3>
            <p className="text-indigo-200 text-xs mt-0.5">{request.service?.title}</p>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white hover:bg-white/10 w-8 h-8 rounded-full flex items-center justify-center transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {error && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-600 rounded-xl text-sm font-medium">
              {error}
            </div>
          )}

          {/* Stars Selection */}
          <div className="flex flex-col items-center gap-2 py-2">
            <span className="text-slate-500 text-xs font-semibold uppercase tracking-wider">¿Qué calificación le das?</span>
            <RatingStars rating={rating} interactive={true} onChange={setRating} size={8} />
            <span className="text-indigo-600 font-bold text-sm mt-1">
              {rating === 5 && '🌟 ¡Excelente!'}
              {rating === 4 && '👍 Muy Bueno'}
              {rating === 3 && '👌 Bueno'}
              {rating === 2 && '👎 Regular'}
              {rating === 1 && '⭐ Malo'}
            </span>
          </div>

          {/* Comment input */}
          <div className="space-y-1.5">
            <label className="block text-slate-700 text-sm font-semibold">Comentario opcional</label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Cuéntanos un poco sobre tu experiencia con el prestador..."
              rows={3}
              maxLength={200}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm resize-none"
            />
            <div className="text-right text-2xs text-slate-400">
              {comment.length}/200 caracteres
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 px-5 py-3 rounded-xl border border-slate-200 text-slate-700 font-semibold hover:bg-slate-50 active:scale-95 transition-all text-sm"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-lg hover:shadow-indigo-500/25 disabled:opacity-50 active:scale-95 transition-all text-sm"
            >
              {loading ? 'Enviando...' : 'Enviar calificación'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
