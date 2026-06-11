/**
 * Helper para obtener imágenes representativas según la categoría del servicio
 */

const CATEGORY_IMAGES = {
  musica: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop&q=80',
  tecnologia: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=600&auto=format&fit=crop&q=80',
  educacion: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&auto=format&fit=crop&q=80',
  limpieza: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600&auto=format&fit=crop&q=80',
  salud: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=600&auto=format&fit=crop&q=80',
  hogar: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=600&auto=format&fit=crop&q=80',
  cocina: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=600&auto=format&fit=crop&q=80',
  arte: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=600&auto=format&fit=crop&q=80',
  deporte: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=600&auto=format&fit=crop&q=80',
  belleza: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=600&auto=format&fit=crop&q=80',
  fotografia: 'https://images.unsplash.com/photo-1452780212940-6f5c0d14d84a?w=600&auto=format&fit=crop&q=80',
  transporte: 'https://images.unsplash.com/photo-1516576885230-ea65f7c16c6d?w=600&auto=format&fit=crop&q=80',
  reparacion: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&auto=format&fit=crop&q=80',
  mascotas: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=600&auto=format&fit=crop&q=80',
};

const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1557683316-973673baf926?w=600&auto=format&fit=crop&q=80'; // Gradiente abstracto

/**
 * Remueve acentos y diacríticos de un string
 */
const removeAccents = (str) => {
  if (!str) return '';
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
};

/**
 * Obtener URL de imagen por categoría con normalización y fallback
 * @param {string} category - Nombre de la categoría
 * @returns {string} URL de la imagen
 */
export const getCategoryImage = (category) => {
  if (!category) return DEFAULT_IMAGE;
  
  // Normalizar: quitar espacios, acentos y convertir a minúsculas
  const normalized = removeAccents(category.trim()).toLowerCase();
  
  return CATEGORY_IMAGES[normalized] || DEFAULT_IMAGE;
};

export default {
  getCategoryImage,
  DEFAULT_IMAGE,
};
