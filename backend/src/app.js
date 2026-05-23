import express from 'express';
import cors from 'cors';
import apiRouter from './routes/index.js';
import { errorHandler } from './middleware/errorHandler.js';
import { notFoundHandler } from './middleware/notFoundHandler.js';

const app = express();

// 1. Middlewares globales
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 2. Ruta de bienvenida / salud (Ideal para verificación y Render logs)
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    name: 'COTAL — Conecta de Talentos Locales API',
    description: 'Fase 1: Backend completo profesional en Node.js, Express, Prisma y PostgreSQL.',
    version: '1.0.0',
    status: 'online',
    timestamp: new Date().toISOString(),
  });
});

// 3. Montar el enrutador principal bajo el prefijo /api
app.use('/api', apiRouter);

// 4. Capturar rutas inexistentes
app.use(notFoundHandler);

// 5. Capturar errores globales y enviar respuesta unificada
app.use(errorHandler);

export default app;
