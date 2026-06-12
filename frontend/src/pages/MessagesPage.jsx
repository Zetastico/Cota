import { useEffect, useRef, useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import conversationService from '../services/conversationService.js';
import useAuth from '../hooks/useAuth.js';

/* ─── Íconos SVG ─────────────────────────────────────────────────── */
const Icon = ({ d, size = 'w-5 h-5', strokeWidth = 2 }) => (
  <svg className={size} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={strokeWidth} d={d} />
  </svg>
);

const ICONS = {
  chat:    'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z',
  send:    'M12 19l9 2-9-18-9 18 9-2zm0 0v-8',
  user:    'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z',
  back:    'M15 19l-7-7 7-7',
  inbox:   'M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4',
  empty:   'M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z',
  check:   'M5 13l4 4L19 7',
};

/* ─── Helpers ────────────────────────────────────────────────────── */
const formatTime = (dateStr) => {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  const now = new Date();
  const isToday = d.toDateString() === now.toDateString();
  if (isToday) return d.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
  return d.toLocaleDateString('es-ES', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
};

const getInitials = (nombre, apellido) =>
  `${(nombre || '?')[0]}${(apellido || '')[0] || ''}`.toUpperCase();

/* ─── Componente: Item de conversación en la sidebar ─────────────── */
const ConversationItem = ({ conv, isActive, currentUserId, currentRole, onClick }) => {
  const lastMsg = conv.messages?.[0];

  // Nombre del otro participante
  const otherPerson = currentRole === 'USER'
    ? conv.request?.service?.owner
    : conv.request?.user;

  const serviceName = conv.request?.service?.title || 'Servicio';
  const unread = lastMsg && lastMsg.senderId !== currentUserId && !lastMsg.readAt;

  return (
    <button
      onClick={onClick}
      className={`w-full text-left px-4 py-3.5 flex gap-3 items-start transition-all duration-150 border-b border-slate-100 hover:bg-indigo-50/60 ${
        isActive ? 'bg-indigo-50 border-l-2 border-l-indigo-500' : ''
      }`}
    >
      {/* Avatar */}
      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-400 to-indigo-600 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
        {getInitials(otherPerson?.nombre, otherPerson?.apellido)}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <span className={`text-sm font-semibold truncate ${isActive ? 'text-indigo-700' : 'text-slate-800'}`}>
            {otherPerson?.nombre} {otherPerson?.apellido}
          </span>
          {lastMsg && (
            <span className="text-xs text-slate-400 flex-shrink-0">{formatTime(lastMsg.createdAt)}</span>
          )}
        </div>
        <p className="text-xs text-slate-500 truncate mt-0.5">{serviceName}</p>
        {lastMsg && (
          <p className={`text-xs mt-1 truncate ${unread ? 'font-semibold text-slate-700' : 'text-slate-400'}`}>
            {lastMsg.senderRole === currentRole ? 'Tú: ' : ''}{lastMsg.body}
          </p>
        )}
      </div>

      {unread && (
        <span className="w-2 h-2 rounded-full bg-indigo-500 flex-shrink-0 mt-1.5" />
      )}
    </button>
  );
};

/* ─── Componente: Burbuja de mensaje ─────────────────────────────── */
const MessageBubble = ({ msg, isOwn }) => (
  <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-2`}>
    <div
      className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm shadow-sm leading-relaxed ${
        isOwn
          ? 'bg-indigo-600 text-white rounded-br-sm'
          : 'bg-white text-slate-800 border border-slate-100 rounded-bl-sm'
      }`}
    >
      <p className="whitespace-pre-wrap break-words">{msg.body}</p>
      <div className={`flex items-center gap-1 mt-1 justify-end ${isOwn ? 'opacity-70' : 'opacity-50'}`}>
        <span className="text-[10px]">{formatTime(msg.createdAt)}</span>
        {isOwn && msg.readAt && (
          <span className="text-[10px]">
            <Icon d={ICONS.check} size="w-3 h-3" />
          </span>
        )}
      </div>
    </div>
  </div>
);

/* ─── Página principal ───────────────────────────────────────────── */
export default function MessagesPage() {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const preselectedConvId = searchParams.get('conversationId');

  const [conversations, setConversations] = useState([]);
  const [activeConvId, setActiveConvId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [draft, setDraft] = useState('');
  const [loadingConvs, setLoadingConvs] = useState(true);
  const [loadingMsgs, setLoadingMsgs] = useState(false);
  const [sending, setSending] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(true);

  const messagesEndRef = useRef(null);
  const pollingRef = useRef(null);
  const inputRef = useRef(null);

  const activeConv = conversations.find((c) => c.id === activeConvId);

  /* ── Scroll al fondo ─── */
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  /* ── Cargar conversaciones ─── */
  const fetchConversations = useCallback(async () => {
    try {
      const data = await conversationService.getMyConversations();
      setConversations(data);
      return data;
    } catch (_) {
      // silencioso
    } finally {
      setLoadingConvs(false);
    }
  }, []);

  /* ── Cargar mensajes ─── */
  const fetchMessages = useCallback(async (convId, silent = false) => {
    if (!convId) return;
    if (!silent) setLoadingMsgs(true);
    try {
      const data = await conversationService.getMessages(convId);
      setMessages(data);
    } catch (_) {
      // silencioso
    } finally {
      if (!silent) setLoadingMsgs(false);
    }
  }, []);

  /* ── Seleccionar conversación ─── */
  const selectConversation = useCallback(async (convId) => {
    setActiveConvId(convId);
    setMobileSidebarOpen(false);
    setMessages([]);
    await fetchMessages(convId);
    setTimeout(scrollToBottom, 100);
    inputRef.current?.focus();
  }, [fetchMessages, scrollToBottom]);

  /* ── Polling: refrescar mensajes cada 4s ─── */
  useEffect(() => {
    if (!activeConvId) return;

    pollingRef.current = setInterval(async () => {
      await fetchMessages(activeConvId, true);
      // También refrescar lista de convs para actualizar último mensaje
      fetchConversations();
      scrollToBottom();
    }, 4000);

    return () => clearInterval(pollingRef.current);
  }, [activeConvId, fetchMessages, fetchConversations, scrollToBottom]);

  /* ── Carga inicial ─── */
  useEffect(() => {
    fetchConversations().then((data) => {
      if (preselectedConvId) {
        selectConversation(preselectedConvId);
      } else if (data?.length > 0) {
        selectConversation(data[0].id);
      }
    });
  }, []); // eslint-disable-line

  /* ── Scroll al recibir nuevos mensajes ─── */
  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  /* ── Enviar mensaje ─── */
  const handleSend = async () => {
    if (!draft.trim() || !activeConvId || sending) return;
    const body = draft.trim();
    setDraft('');
    setSending(true);

    // Optimistic UI
    const tempMsg = {
      id: `temp-${Date.now()}`,
      conversationId: activeConvId,
      senderId: user.id,
      senderRole: user.rol,
      body,
      readAt: null,
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, tempMsg]);
    setTimeout(scrollToBottom, 50);

    try {
      await conversationService.sendMessage(activeConvId, body);
      // Refrescar desde servidor para obtener ID real
      await fetchMessages(activeConvId, true);
      await fetchConversations();
    } catch (_) {
      // Revertir mensaje temporal en caso de error
      setMessages((prev) => prev.filter((m) => m.id !== tempMsg.id));
      setDraft(body);
    } finally {
      setSending(false);
      scrollToBottom();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  /* ── Nombre del otro participante en el chat activo ─── */
  const otherPerson = activeConv
    ? user?.rol === 'USER'
      ? activeConv.request?.service?.owner
      : activeConv.request?.user
    : null;

  /* ─── RENDER ──────────────────────────────────────────────────── */
  return (
    <div className="flex overflow-hidden bg-slate-50" style={{ height: 'calc(100vh - 4rem)' }}>
      {/* ── Sidebar: lista de conversaciones ── */}
      <aside
        className={`w-full md:w-80 lg:w-96 bg-white border-r border-slate-200 flex flex-col flex-shrink-0
          ${!mobileSidebarOpen && activeConvId ? 'hidden md:flex' : 'flex'}`}
      >
        {/* Header sidebar */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
            <Icon d={ICONS.inbox} size="w-4 h-4" strokeWidth={2} />
          </div>
          <div>
            <h1 className="text-base font-bold text-slate-900">Mensajes</h1>
            <p className="text-xs text-slate-500">{conversations.length} conversación{conversations.length !== 1 ? 'es' : ''}</p>
          </div>
        </div>

        {/* Lista */}
        <div className="flex-1 overflow-y-auto">
          {loadingConvs ? (
            <div className="space-y-0">
              {[1, 2, 3].map((i) => (
                <div key={i} className="px-4 py-3.5 flex gap-3 border-b border-slate-100 animate-pulse">
                  <div className="w-10 h-10 rounded-full bg-slate-200 flex-shrink-0" />
                  <div className="flex-1 space-y-2 pt-1">
                    <div className="h-3 bg-slate-200 rounded w-3/4" />
                    <div className="h-2.5 bg-slate-100 rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : conversations.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full py-16 text-center px-6">
              <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
                <Icon d={ICONS.empty} size="w-7 h-7" />
              </div>
              <p className="text-sm font-semibold text-slate-600 mb-1">Sin conversaciones</p>
              <p className="text-xs text-slate-400">
                {user?.rol === 'USER'
                  ? 'Cuando una solicitud sea aceptada, podrás chatear con el ofertante.'
                  : 'Cuando aceptes una solicitud, aparecerá aquí el chat con el usuario.'}
              </p>
            </div>
          ) : (
            conversations.map((conv) => (
              <ConversationItem
                key={conv.id}
                conv={conv}
                isActive={conv.id === activeConvId}
                currentUserId={user?.id}
                currentRole={user?.rol}
                onClick={() => selectConversation(conv.id)}
              />
            ))
          )}
        </div>
      </aside>

      {/* ── Panel principal: chat ── */}
      <main
        className={`flex-1 flex flex-col overflow-hidden
          ${mobileSidebarOpen && !activeConvId ? 'hidden md:flex' : 'flex'}`}
      >
        {!activeConvId ? (
          /* Estado vacío */
          <div className="flex-1 flex flex-col items-center justify-center text-center px-8 bg-slate-50">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center shadow-xl mb-5">
              <Icon d={ICONS.chat} size="w-9 h-9" />
            </div>
            <h2 className="text-lg font-bold text-slate-700 mb-2">Selecciona una conversación</h2>
            <p className="text-sm text-slate-400">Elige una conversación de la lista para ver los mensajes.</p>
          </div>
        ) : (
          <>
            {/* Header del chat */}
            <div className="px-5 py-3.5 bg-white border-b border-slate-200 flex items-center gap-3 shadow-sm">
              {/* Botón volver en móvil */}
              <button
                onClick={() => setMobileSidebarOpen(true)}
                className="md:hidden p-1.5 rounded-lg hover:bg-slate-100 text-slate-600 transition"
              >
                <Icon d={ICONS.back} size="w-5 h-5" />
              </button>

              {/* Avatar */}
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-400 to-indigo-600 flex items-center justify-center text-white text-sm font-bold">
                {getInitials(otherPerson?.nombre, otherPerson?.apellido)}
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-slate-900 truncate">
                  {otherPerson?.nombre} {otherPerson?.apellido}
                </p>
                <p className="text-xs text-slate-400 truncate">
                  {activeConv?.request?.service?.title} · {activeConv?.request?.service?.category}
                </p>
              </div>

              <span className="flex items-center gap-1.5 text-xs text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                En vivo
              </span>
            </div>

            {/* Área de mensajes */}
            <div className="flex-1 overflow-y-auto px-5 py-4 bg-slate-50">
              {loadingMsgs ? (
                <div className="flex flex-col gap-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className={`flex ${i % 2 === 0 ? 'justify-end' : 'justify-start'}`}>
                      <div className="h-10 bg-slate-200 rounded-2xl animate-pulse" style={{ width: `${40 + i * 15}%` }} />
                    </div>
                  ))}
                </div>
              ) : messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center mb-3">
                    <Icon d={ICONS.chat} size="w-6 h-6" />
                  </div>
                  <p className="text-sm text-slate-500 font-medium">¡Inicia la conversación!</p>
                  <p className="text-xs text-slate-400 mt-1">Escribe tu primer mensaje.</p>
                </div>
              ) : (
                messages.map((msg) => (
                  <MessageBubble
                    key={msg.id}
                    msg={msg}
                    isOwn={msg.senderId === user?.id}
                  />
                ))
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input de mensaje */}
            <div className="px-4 py-3 bg-white border-t border-slate-200">
              <div className="flex gap-2 items-end">
                <textarea
                  ref={inputRef}
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Escribe un mensaje… (Enter para enviar)"
                  rows={1}
                  className="flex-1 resize-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400
                    focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-400
                    transition-all max-h-32 overflow-y-auto leading-relaxed"
                  style={{ height: 'auto' }}
                  onInput={(e) => {
                    e.target.style.height = 'auto';
                    e.target.style.height = Math.min(e.target.scrollHeight, 128) + 'px';
                  }}
                />
                <button
                  onClick={handleSend}
                  disabled={!draft.trim() || sending}
                  className="w-10 h-10 rounded-2xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed
                    flex items-center justify-center text-white transition-all shadow-sm hover:shadow-md flex-shrink-0"
                >
                  <Icon d={ICONS.send} size="w-4 h-4" />
                </button>
              </div>
              <p className="text-[10px] text-slate-400 mt-1.5 text-center">
                Los mensajes se actualizan automáticamente cada 4 segundos
              </p>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
