import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";

/* ─────────────────────────────────────────────────────────────────────────── */
/*  DATA                                                                        */
/* ─────────────────────────────────────────────────────────────────────────── */

const CATEGORIES = [
  { label: "🎵 Música",        color: "#4F46E5" },
  { label: "💻 Tecnología",    color: "#0EA5E9" },
  { label: "📚 Educación",     color: "#10B981" },
  { label: "🧹 Limpieza",      color: "#F59E0B" },
  { label: "❤️ Salud",         color: "#EF4444" },
  { label: "🏠 Hogar",         color: "#8B5CF6" },
  { label: "🚗 Transporte",    color: "#F97316" },
  { label: "🍽️ Gastronomía",   color: "#14B8A6" },
  { label: "🐾 Mascotas",      color: "#EC4899" },
  { label: "🧘 Bienestar",     color: "#6366F1" },
  { label: "🎨 Arte & Diseño", color: "#A855F7" },
  { label: "🏋️ Fitness",       color: "#22D3EE" },
];

const STEPS = [
  {
    icon: "🔍",
    title: "Explorá servicios",
    desc: "Buscá entre cientos de servicios verificados cerca tuyo o en línea.",
  },
  {
    icon: "📩",
    title: "Enviá tu solicitud",
    desc: "Completá el formulario con tu fecha ideal y un mensaje al prestador.",
  },
  {
    icon: "✅",
    title: "Confirmá y listo",
    desc: "El HOST acepta tu solicitud y te contacta para coordinar los detalles.",
  },
];

const FEATURES = [
  {
    icon: "🛡️",
    title: "Perfiles verificados",
    desc: "Todos los prestadores pasan por un proceso de verificación antes de publicar.",
  },
  {
    icon: "⚡",
    title: "Respuesta rápida",
    desc: "Los HOSTs reciben notificaciones instantáneas y responden en menos de 24 hs.",
  },
  {
    icon: "🌍",
    title: "Cualquier categoría",
    desc: "Desde clases de música hasta reparaciones del hogar — todo en un lugar.",
  },
  {
    icon: "📊",
    title: "Panel de control",
    desc: "HOSTs y Admins tienen dashboards con estadísticas, gráficos y gestión completa.",
  },
  {
    icon: "💬",
    title: "Comunicación directa",
    desc: "Enviá mensajes personalizados cuando hacés una solicitud.",
  },
  {
    icon: "📱",
    title: "Diseño responsive",
    desc: "Funciona perfecto en celular, tablet y escritorio sin instalar nada.",
  },
];

const TESTIMONIALS = [
  {
    name: "Laura M.",
    role: "Usuaria",
    text: "Encontré profesora de inglés en 10 minutos. El proceso es súper sencillo y los precios son claros.",
    avatar: "L",
    color: "#4F46E5",
  },
  {
    name: "Carlos R.",
    role: "HOST — Plomero",
    text: "Desde que me uní a COTAL mis clientes aumentaron un 40%. El panel de gestión es excelente.",
    avatar: "C",
    color: "#10B981",
  },
  {
    name: "Valentina G.",
    role: "Usuaria",
    text: "Me encanta que puedo ver el historial de mis solicitudes y saber si fueron aceptadas o no.",
    avatar: "V",
    color: "#F59E0B",
  },
];

const FAQS = [
  {
    q: "¿COTAL es gratuito?",
    a: "Para los usuarios que buscan servicios, sí, completamente gratuito. Los HOSTs (prestadores) se registran también sin costo inicial.",
  },
  {
    q: "¿Cómo me registro como HOST?",
    a: 'Al crear tu cuenta en COTAL, elegís el rol "HOST". Desde tu panel podés crear y gestionar tus servicios y recibir solicitudes.',
  },
  {
    q: "¿Cómo sé si mi solicitud fue aceptada?",
    a: 'En tu sección "Mis solicitudes" podés ver el estado de cada una: PENDIENTE, ACEPTADA o RECHAZADA en tiempo real.',
  },
  {
    q: "¿Puedo cancelar una solicitud enviada?",
    a: "Por ahora las solicitudes quedan registradas para transparencia. En futuras versiones incorporaremos cancelaciones.",
  },
  {
    q: "¿Qué categorías de servicios están disponibles?",
    a: "Hay más de 12 categorías: Música, Tecnología, Educación, Limpieza, Salud, Hogar, Transporte, Gastronomía, Mascotas, Bienestar, Arte & Diseño y Fitness.",
  },
];

const STATS = [
  { value: "500+", label: "Servicios publicados" },
  { value: "1.200+", label: "Solicitudes enviadas" },
  { value: "98%", label: "Tasa de satisfacción" },
  { value: "12", label: "Categorías disponibles" },
];

/* ─────────────────────────────────────────────────────────────────────────── */
/*  MARQUEE ROW                                                                 */
/* ─────────────────────────────────────────────────────────────────────────── */
function MarqueeRow({ items, direction = "left", speed = "40s" }) {
  // Duplicate items so the loop looks seamless
  const doubled = [...items, ...items];
  return (
    <div
      className="overflow-hidden marquee-wrap"
      aria-hidden="true"
    >
      <div
        className={`marquee-track marquee-track--${direction} gap-4 py-2`}
        style={{ animationDuration: speed }}
      >
        {doubled.map((cat, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold whitespace-nowrap border border-white/20 backdrop-blur-sm select-none"
            style={{
              background: `${cat.color}22`,
              color: cat.color,
              borderColor: `${cat.color}44`,
            }}
          >
            {cat.label}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────── */
/*  FAQ ITEM                                                                    */
/* ─────────────────────────────────────────────────────────────────────────── */
function FaqItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-slate-200 rounded-2xl overflow-hidden">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex justify-between items-center px-6 py-5 text-left hover:bg-indigo-50 transition-colors"
        aria-expanded={open}
      >
        <span className="font-semibold text-slate-800">{q}</span>
        <span
          className="ml-4 flex-shrink-0 text-indigo-600 text-xl transition-transform duration-300"
          style={{ transform: open ? "rotate(45deg)" : "rotate(0deg)" }}
        >
          +
        </span>
      </button>
      <div
        className={`faq-answer ${open ? "open" : ""}`}
        style={open ? { maxHeight: "300px" } : {}}
      >
        <p className="px-6 pb-5 text-slate-600 leading-relaxed">{a}</p>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────── */
/*  NAVBAR                                                                      */
/* ─────────────────────────────────────────────────────────────────────────── */
function LandingNavbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/90 backdrop-blur-md shadow-md py-3"
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center shadow-lg">
            <span className="text-white font-black text-sm">C</span>
          </div>
          <span
            className={`font-black text-xl tracking-tight transition-colors ${
              scrolled ? "text-slate-900" : "text-white"
            }`}
          >
            COTAL
          </span>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <Link
            to="/login"
            className={`text-sm font-semibold px-4 py-2 rounded-xl transition-colors ${
              scrolled
                ? "text-slate-700 hover:text-indigo-600"
                : "text-white/90 hover:text-white"
            }`}
          >
            Iniciar sesión
          </Link>
          <Link
            to="/register"
            className="text-sm font-bold px-5 py-2.5 rounded-xl bg-white text-indigo-700 hover:bg-indigo-50 shadow transition-all hover:shadow-md"
          >
            Crear cuenta
          </Link>
        </div>
      </div>
    </nav>
  );
}

/* ─────────────────────────────────────────────────────────────────────────── */
/*  LANDING PAGE                                                                */
/* ─────────────────────────────────────────────────────────────────────────── */
export default function LandingPage() {
  // Intersection Observer for scroll-triggered animations
  const sectionRefs = useRef([]);
  const [visible, setVisible] = useState({});

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible((prev) => ({ ...prev, [entry.target.dataset.section]: true }));
          }
        });
      },
      { threshold: 0.12 }
    );
    sectionRefs.current.forEach((el) => el && obs.observe(el));
    return () => obs.disconnect();
  }, []);

  const sectionRef = (name) => (el) => {
    if (el) {
      el.dataset.section = name;
      sectionRefs.current.push(el);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans antialiased">
      <LandingNavbar />

      {/* ── HERO ──────────────────────────────────────────────────────────── */}
      <section
        id="hero"
        className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, #4338ca 0%, #4F46E5 40%, #6d28d9 100%)",
        }}
      >
        {/* Background blobs */}
        <div
          className="absolute top-[-120px] left-[-100px] w-[500px] h-[500px] rounded-full opacity-20"
          style={{
            background: "radial-gradient(circle, #818cf8, transparent 70%)",
          }}
        />
        <div
          className="absolute bottom-[-80px] right-[-80px] w-[400px] h-[400px] rounded-full opacity-15"
          style={{
            background: "radial-gradient(circle, #34d399, transparent 70%)",
          }}
        />

        {/* Content */}
        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-white/90 text-sm font-medium mb-8 backdrop-blur-sm animate-fade-in-up">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Plataforma de servicios en línea
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-white leading-tight mb-6 animate-fade-in-up-delay-1">
            Conectá con los{" "}
            <span className="relative inline-block">
              <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-yellow-200">
                mejores servicios
              </span>
            </span>{" "}
            de tu zona
          </h1>

          <p className="text-lg sm:text-xl text-white/75 max-w-2xl mx-auto mb-10 animate-fade-in-up-delay-2">
            COTAL es la plataforma donde encontrás prestadores verificados, hacés
            solicitudes en segundos y seguís el estado de tus pedidos en tiempo
            real.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up-delay-3">
            <Link
              to="/register"
              id="hero-cta-register"
              className="px-8 py-4 rounded-2xl bg-white text-indigo-700 font-bold text-base shadow-xl hover:shadow-2xl hover:-translate-y-0.5 transition-all duration-200"
            >
              Crear cuenta gratis →
            </Link>
            <a
              href="#como-funciona"
              id="hero-cta-how"
              className="px-8 py-4 rounded-2xl bg-white/10 border border-white/20 text-white font-semibold text-base backdrop-blur-sm hover:bg-white/20 transition-all duration-200"
            >
              Conoce COTAL
            </a>
          </div>
        </div>

        {/* Marquee rows — inside hero, at the bottom */}
        <div className="absolute bottom-0 left-0 right-0 pb-10 space-y-3">
          <MarqueeRow items={CATEGORIES} direction="left" speed="38s" />
          <MarqueeRow items={[...CATEGORIES].reverse()} direction="right" speed="44s" />
        </div>

        {/* Scroll hint */}
        <div className="absolute bottom-32 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-white/50 text-xs">
          <span>↓</span>
        </div>
      </section>

      {/* ── STATS BAND ────────────────────────────────────────────────────── */}
      <section className="bg-white border-b border-slate-100 py-12 px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {STATS.map((s) => (
            <div key={s.label}>
              <p className="text-4xl font-black text-indigo-600 mb-1">{s.value}</p>
              <p className="text-sm text-slate-500 font-medium">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ──────────────────────────────────────────────────── */}
      <section
        id="como-funciona"
        className="landing-section bg-[#F8FAFC]"
        ref={sectionRef("how")}
      >
        <div className="landing-container">
          <div
            className={`text-center mb-16 transition-all duration-700 ${
              visible.how ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            <span className="text-indigo-600 font-bold text-sm uppercase tracking-widest">
              Cómo funciona
            </span>
            <h2 className="text-4xl font-black text-slate-900 mt-2">
              Tres pasos, sin complicaciones
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {STEPS.map((step, i) => (
              <div
                key={step.title}
                className={`relative bg-white rounded-3xl p-8 shadow-sm border border-slate-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-500 ${
                  visible.how ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                }`}
                style={{ transitionDelay: `${i * 0.12}s` }}
              >
                <div className="absolute -top-5 left-8 w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center font-black text-sm shadow-lg">
                  {i + 1}
                </div>
                <div className="text-5xl mb-4 mt-2">{step.icon}</div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">{step.title}</h3>
                <p className="text-slate-500 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CATEGORIES MARQUEE (standalone section) ───────────────────────── */}
      <section className="py-16 bg-gradient-to-r from-indigo-50 via-white to-indigo-50 overflow-hidden">
        <div className="text-center mb-10">
          <span className="text-indigo-600 font-bold text-sm uppercase tracking-widest">
            Categorías
          </span>
          <h2 className="text-3xl font-black text-slate-900 mt-2">
            Servicios para cada necesidad
          </h2>
        </div>
        <div className="space-y-4">
          <MarqueeRow items={CATEGORIES} direction="left" speed="32s" />
          <MarqueeRow items={[...CATEGORIES].reverse()} direction="right" speed="36s" />
        </div>
      </section>

      {/* ── FEATURES ──────────────────────────────────────────────────────── */}
      <section
        id="features"
        className="landing-section bg-white"
        ref={sectionRef("features")}
      >
        <div className="landing-container">
          <div
            className={`text-center mb-16 transition-all duration-700 ${
              visible.features ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            <span className="text-emerald-600 font-bold text-sm uppercase tracking-widest">
              ¿Por qué COTAL?
            </span>
            <h2 className="text-4xl font-black text-slate-900 mt-2">
              Todo lo que necesitás, en un solo lugar
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((feat, i) => (
              <div
                key={feat.title}
                className={`group p-7 rounded-3xl border border-slate-100 bg-[#F8FAFC] hover:bg-white hover:shadow-xl hover:-translate-y-1 transition-all duration-400 ${
                  visible.features
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-8"
                }`}
                style={{ transitionDelay: `${i * 0.08}s` }}
              >
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  {feat.icon}
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-1">{feat.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ──────────────────────────────────────────────────── */}
      <section
        id="testimonios"
        className="landing-section"
        style={{ background: "linear-gradient(135deg, #4F46E5 0%, #4338ca 100%)" }}
        ref={sectionRef("testimonials")}
      >
        <div className="landing-container">
          <div
            className={`text-center mb-14 transition-all duration-700 ${
              visible.testimonials
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-8"
            }`}
          >
            <span className="text-indigo-200 font-bold text-sm uppercase tracking-widest">
              Testimonios
            </span>
            <h2 className="text-4xl font-black text-white mt-2">
              Lo que dicen nuestros usuarios
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, i) => (
              <div
                key={t.name}
                className={`bg-white/10 backdrop-blur-sm border border-white/20 rounded-3xl p-8 hover:bg-white/15 transition-all duration-400 ${
                  visible.testimonials
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-8"
                }`}
                style={{ transitionDelay: `${i * 0.12}s` }}
              >
                <p className="text-white/85 leading-relaxed mb-6 text-sm">
                  "{t.text}"
                </p>
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
                    style={{ background: t.color }}
                  >
                    {t.avatar}
                  </div>
                  <div>
                    <p className="text-white font-semibold text-sm">{t.name}</p>
                    <p className="text-white/50 text-xs">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ───────────────────────────────────────────────────────────── */}
      <section
        id="faq"
        className="landing-section bg-[#F8FAFC]"
        ref={sectionRef("faq")}
      >
        <div className="max-w-3xl mx-auto">
          <div
            className={`text-center mb-12 transition-all duration-700 ${
              visible.faq ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            <span className="text-amber-600 font-bold text-sm uppercase tracking-widest">
              FAQ
            </span>
            <h2 className="text-4xl font-black text-slate-900 mt-2">
              Preguntas frecuentes
            </h2>
          </div>

          <div
            className={`space-y-3 transition-all duration-700 ${
              visible.faq ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
            style={{ transitionDelay: "0.1s" }}
          >
            {FAQS.map((faq) => (
              <FaqItem key={faq.q} {...faq} />
            ))}
          </div>
        </div>
      </section>

      {/* ── CALL TO ACTION ────────────────────────────────────────────────── */}
      <section className="landing-section bg-white border-t border-slate-100">
        <div className="landing-container text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-4xl font-black text-slate-900 mb-4">
              ¿Listo para empezar?
            </h2>
            <p className="text-slate-500 text-lg mb-10">
              Uníte a COTAL y encontrá el servicio que necesitás — o empezá a
              ofrecer el tuyo.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/register"
                id="footer-cta-register"
                className="px-10 py-4 rounded-2xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200"
              >
                Crear cuenta gratis →
              </Link>
              <Link
                to="/login"
                id="footer-cta-login"
                className="px-10 py-4 rounded-2xl border-2 border-slate-200 text-slate-700 font-bold hover:border-indigo-300 hover:text-indigo-600 transition-all duration-200"
              >
                Ya tengo cuenta
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ────────────────────────────────────────────────────────── */}
      <footer className="bg-slate-900 text-slate-400 py-10 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-400 to-indigo-600 flex items-center justify-center">
              <span className="text-white font-black text-xs">C</span>
            </div>
            <span className="text-white font-bold">COTAL</span>
          </div>
          <p className="text-sm text-center">
            © {new Date().getFullYear()} COTAL — Plataforma de servicios locales.
            Todos los derechos reservados.
          </p>
          <div className="flex gap-5 text-sm">
            <Link to="/login" className="hover:text-white transition-colors">
              Iniciar sesión
            </Link>
            <Link to="/register" className="hover:text-white transition-colors">
              Registrarse
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
