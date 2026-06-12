import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const HOST_ID = '8da7cc2f-b8cd-4845-b5b7-618bc890ebd1';

const services = [
  {
    title: 'Clases de guitarra para principiantes',
    description: 'Aprende acordes básicos, ritmo y tus primeras canciones desde cero.',
    price: 50,
    category: 'Música',
    status: 'APPROVED',
    ownerId: HOST_ID,
  },
  {
    title: 'Clases de canto personalizado',
    description: 'Entrenamiento vocal, respiración y técnica para mejorar tu voz.',
    price: 70,
    category: 'Música',
    status: 'APPROVED',
    ownerId: HOST_ID,
  },
  {
    title: 'Reparación básica de computadoras',
    description: 'Diagnóstico, limpieza, optimización y solución de problemas comunes.',
    price: 90,
    category: 'Tecnología',
    status: 'APPROVED',
    ownerId: HOST_ID,
  },
  {
    title: 'Instalación de programas esenciales',
    description: 'Instalación de software básico, antivirus, herramientas de oficina y navegadores.',
    price: 45,
    category: 'Tecnología',
    status: 'APPROVED',
    ownerId: HOST_ID,
  },
  {
    title: 'Tutoría de matemáticas escolar',
    description: 'Apoyo en álgebra, geometría, funciones y preparación para exámenes.',
    price: 40,
    category: 'Educación',
    status: 'APPROVED',
    ownerId: HOST_ID,
  },
  {
    title: 'Apoyo en programación básica',
    description: 'Aprende lógica, JavaScript, HTML, CSS y fundamentos de programación.',
    price: 65,
    category: 'Educación',
    status: 'APPROVED',
    ownerId: HOST_ID,
  },
  {
    title: 'Limpieza profunda de habitaciones',
    description: 'Servicio de limpieza detallada para dormitorios, salas pequeñas y espacios personales.',
    price: 80,
    category: 'Limpieza',
    status: 'APPROVED',
    ownerId: HOST_ID,
  },
  {
    title: 'Limpieza general de departamentos',
    description: 'Orden, barrido, trapeado, limpieza de superficies y baños.',
    price: 120,
    category: 'Limpieza',
    status: 'APPROVED',
    ownerId: HOST_ID,
  },
  {
    title: 'Preparación de comida casera',
    description: 'Cocina de platos caseros por encargo para almuerzos familiares.',
    price: 100,
    category: 'Cocina',
    status: 'APPROVED',
    ownerId: HOST_ID,
  },
  {
    title: 'Clases de repostería básica',
    description: 'Aprende a preparar tortas, cupcakes y postres sencillos paso a paso.',
    price: 75,
    category: 'Cocina',
    status: 'APPROVED',
    ownerId: HOST_ID,
  },
  {
    title: 'Entrenamiento funcional personalizado',
    description: 'Rutinas adaptadas a tu nivel físico para mejorar fuerza y resistencia.',
    price: 60,
    category: 'Deporte',
    status: 'APPROVED',
    ownerId: HOST_ID,
  },
  {
    title: 'Clases de fútbol para niños',
    description: 'Entrenamiento técnico, coordinación y fundamentos básicos del fútbol.',
    price: 55,
    category: 'Deporte',
    status: 'APPROVED',
    ownerId: HOST_ID,
  },
  {
    title: 'Corte de cabello a domicilio',
    description: 'Servicio de corte moderno o clásico en la comodidad de tu hogar.',
    price: 45,
    category: 'Belleza',
    status: 'APPROVED',
    ownerId: HOST_ID,
  },
  {
    title: 'Maquillaje para eventos',
    description: 'Maquillaje social para cumpleaños, graduaciones, sesiones o eventos especiales.',
    price: 110,
    category: 'Belleza',
    status: 'APPROVED',
    ownerId: HOST_ID,
  },
  {
    title: 'Sesión fotográfica individual',
    description: 'Fotografías profesionales para perfil, redes sociales o recuerdo personal.',
    price: 150,
    category: 'Fotografía',
    status: 'APPROVED',
    ownerId: HOST_ID,
  },
  {
    title: 'Fotografía para eventos pequeños',
    description: 'Cobertura fotográfica para reuniones, cumpleaños o actividades familiares.',
    price: 250,
    category: 'Fotografía',
    status: 'APPROVED',
    ownerId: HOST_ID,
  },
  {
    title: 'Pintura artística para principiantes',
    description: 'Aprende técnicas básicas con acrílico, color, composición y creatividad.',
    price: 65,
    category: 'Arte',
    status: 'APPROVED',
    ownerId: HOST_ID,
  },
  {
    title: 'Diseño de murales decorativos',
    description: 'Creación de murales personalizados para habitaciones, negocios o espacios creativos.',
    price: 300,
    category: 'Arte',
    status: 'APPROVED',
    ownerId: HOST_ID,
  },
  {
    title: 'Reparación de enchufes y luminarias',
    description: 'Solución de fallas eléctricas simples, cambio de enchufes e instalación de focos.',
    price: 85,
    category: 'Reparación',
    status: 'APPROVED',
    ownerId: HOST_ID,
  },
  {
    title: 'Arreglo básico de muebles',
    description: 'Ajuste de bisagras, reparación simple de sillas, mesas y muebles pequeños.',
    price: 95,
    category: 'Reparación',
    status: 'APPROVED',
    ownerId: HOST_ID,
  },
  {
    title: 'Paseo de mascotas',
    description: 'Paseos seguros para perros, con duración coordinada según la necesidad.',
    price: 35,
    category: 'Mascotas',
    status: 'APPROVED',
    ownerId: HOST_ID,
  },
  {
    title: 'Baño básico para mascotas',
    description: 'Baño, cepillado y limpieza básica para perros pequeños y medianos.',
    price: 60,
    category: 'Mascotas',
    status: 'APPROVED',
    ownerId: HOST_ID,
  },
  {
    title: 'Organización de espacios del hogar',
    description: 'Orden y optimización de roperos, escritorios, cocinas y espacios pequeños.',
    price: 90,
    category: 'Hogar',
    status: 'APPROVED',
    ownerId: HOST_ID,
  },
  {
    title: 'Decoración básica de interiores',
    description: 'Asesoría para mejorar distribución, colores y estilo de ambientes del hogar.',
    price: 130,
    category: 'Hogar',
    status: 'APPROVED',
    ownerId: HOST_ID,
  },
  {
    title: 'Traslado de objetos pequeños',
    description: 'Ayuda con transporte de paquetes, cajas o artículos personales dentro de la ciudad.',
    price: 70,
    category: 'Transporte',
    status: 'APPROVED',
    ownerId: HOST_ID,
  },
  {
    title: 'Apoyo para mudanzas pequeñas',
    description: 'Ayuda para cargar, organizar y trasladar pertenencias en mudanzas ligeras.',
    price: 180,
    category: 'Transporte',
    status: 'APPROVED',
    ownerId: HOST_ID,
  },
  {
    title: 'Acompañamiento para adultos mayores',
    description: 'Apoyo, compañía y asistencia básica para actividades cotidianas.',
    price: 100,
    category: 'Salud',
    status: 'APPROVED',
    ownerId: HOST_ID,
  },
  {
    title: 'Orientación de hábitos saludables',
    description: 'Asesoría básica para mejorar rutinas de alimentación, sueño y actividad diaria.',
    price: 75,
    category: 'Salud',
    status: 'APPROVED',
    ownerId: HOST_ID,
  },
  {
    title: 'Asesoría para emprendimientos locales',
    description: 'Apoyo para organizar ideas, precios, presentación y difusión de pequeños negocios.',
    price: 120,
    category: 'Negocios',
    status: 'APPROVED',
    ownerId: HOST_ID,
  },
  {
    title: 'Redacción de CV y perfil profesional',
    description: 'Mejora de currículum, descripción profesional y presentación para oportunidades laborales.',
    price: 80,
    category: 'Profesional',
    status: 'APPROVED',
    ownerId: HOST_ID,
  },
];

async function main() {
  const host = await prisma.user.findUnique({
    where: { id: HOST_ID },
  });

  if (!host) {
    throw new Error(`No existe un usuario con id ${HOST_ID}`);
  }

  if (host.rol !== 'HOST') {
    throw new Error(`El usuario existe, pero su rol es ${host.rol}, no HOST`);
  }

  const result = await prisma.service.createMany({
    data: services,
  });

  console.log(`Servicios insertados: ${result.count}`);
}

main()
  .catch((error) => {
    console.error('Error insertando servicios:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });