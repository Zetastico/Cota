import app from './app.js';
import { PORT } from './config/config.js';
import prisma from './config/db.js';

// Levantar el servidor HTTP
const server = app.listen(PORT, () => {
  console.log(`===================================================`);
  console.log(`  Servidor COTAL corriendo en el puerto: ${PORT}`);
  console.log(`  Modo: ${process.env.NODE_ENV || 'development'}`);
  console.log(`  Acceso local: http://localhost:${PORT}`);
  console.log(`===================================================`);
});

/**
 * Apagado ordenado del servidor (Graceful Shutdown)
 * Cierra el puerto HTTP y luego la conexión a la Base de Datos
 */
const shutdown = async (signal) => {
  console.log(`\n[${signal}] Iniciando apagado gradual del servidor...`);
  
  server.close(async () => {
    console.log('  [+] Servidor HTTP detenido.');
    
    try {
      await prisma.$disconnect();
      console.log('  [+] Cliente Prisma desconectado de PostgreSQL de forma limpia.');
    } catch (dbError) {
      console.error('  [!] Error al desconectar Prisma Client:', dbError);
    }
    
    console.log('[*] Apagado completado. Saliendo del proceso.');
    process.exit(0);
  });

  // Si no puede apagarse de forma limpia en 10 segundos, forzar cierre
  setTimeout(() => {
    console.error('[!] Apagado forzado por tiempo límite excedido.');
    process.exit(1);
  }, 10000);
};

// Escuchar señales de terminación del sistema (Render y Docker envían SIGTERM)
process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
