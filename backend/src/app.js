import express from 'express';
import cors from 'cors';
import apiRouter from './routes/index.js';
import { errorHandler } from './middleware/errorHandler.js';
import { notFoundHandler } from './middleware/notFoundHandler.js';

const app = express();

// 1. Middlewares globales
app.use(
  cors({
    origin: [
      'http://localhost:5173',
      'https://cota-frontend.vercel.app',
      'https://cotal-render.onrender.com',
    ],
    credentials: true,
  })
)
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

app.use('/api', apiRouter);

// Evita que el navegador genere error al pedir el favicon automáticamente
app.get('/favicon.ico', (req, res) => {
  res.status(204).end();
});

app.use(notFoundHandler);
app.use(errorHandler);



export default app;
