import React from 'react';

const NotificationPanel = ({ role, stats, loading = false }) => {
  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-slate-100 shadow-premium p-5 space-y-3">
        <div className="h-4 w-32 bg-slate-200 rounded animate-pulse" />
        <div className="space-y-2 pt-2">
          <div className="h-10 bg-slate-100 rounded-xl animate-pulse" />
          <div className="h-10 bg-slate-100 rounded-xl animate-pulse" />
        </div>
      </div>
    );
  }

  const notifications = [];

  if (stats) {
    if (role === 'ADMIN') {
      if (stats.pendingServices > 0) {
        notifications.push({
          id: 'admin-pending-services',
          type: 'warning',
          message: `Tienes ${stats.pendingServices} ${stats.pendingServices === 1 ? 'servicio pendiente' : 'servicios pendientes'} de aprobación.`,
          actionLink: '/services/pending',
        });
      }
      if (stats.pendingRequests > 0) {
        notifications.push({
          id: 'admin-pending-requests',
          type: 'info',
          message: `Hay ${stats.pendingRequests} ${stats.pendingRequests === 1 ? 'solicitud de servicio registrada' : 'solicitudes de servicios registradas'} en espera de respuesta por hosts.`,
        });
      }
    } else if (role === 'HOST') {
      if (stats.pendingRequestsReceived > 0) {
        notifications.push({
          id: 'host-pending-requests',
          type: 'warning',
          message: `Tienes ${stats.pendingRequestsReceived} ${stats.pendingRequestsReceived === 1 ? 'solicitud pendiente' : 'solicitudes pendientes'} por responder.`,
          actionLink: '/service-requests',
        });
      }
      if (stats.pendingServices > 0) {
        notifications.push({
          id: 'host-pending-services',
          type: 'info',
          message: `${stats.pendingServices} ${stats.pendingServices === 1 ? 'de tus servicios sigue' : 'de tus servicios siguen'} pendiente de aprobación por el administrador.`,
          actionLink: '/services',
        });
      }
    } else if (role === 'USER') {
      if (stats.acceptedRequests > 0) {
        notifications.push({
          id: 'user-accepted-requests',
          type: 'success',
          message: `Tienes ${stats.acceptedRequests} ${stats.acceptedRequests === 1 ? 'solicitud aceptada' : 'solicitudes aceptadas'} por los proveedores.`,
          actionLink: '/my-requests',
        });
      }
      if (stats.pendingRequests > 0) {
        notifications.push({
          id: 'user-pending-requests',
          type: 'info',
          message: `Tienes ${stats.pendingRequests} ${stats.pendingRequests === 1 ? 'solicitud pendiente' : 'solicitudes pendientes'} de respuesta.`,
          actionLink: '/my-requests',
        });
      }
    }
  }

  // Define colors for each type
  const types = {
    success: {
      bg: 'bg-emerald-50 border-emerald-100 text-emerald-800',
      icon: (
        <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    warning: {
      bg: 'bg-amber-50 border-amber-100 text-amber-800',
      icon: (
        <svg className="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      ),
    },
    info: {
      bg: 'bg-indigo-50 border-indigo-100 text-indigo-800',
      icon: (
        <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-premium p-5 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-slate-800 tracking-tight">Notificaciones Internas</h3>
        {notifications.length > 0 && (
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-600"></span>
          </span>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="py-6 flex flex-col items-center justify-center text-center">
          <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center mb-2">
            <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.02 6.02 0 00-4.902-5.903m-2.127-.002A6.002 6.002 0 006 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
          </div>
          <p className="text-xs font-semibold text-slate-700">¡Todo al día!</p>
          <p className="text-2xs text-slate-400 mt-0.5">No tienes alertas ni acciones pendientes.</p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {notifications.map((notif) => {
            const style = types[notif.type] || types.info;
            const content = (
              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex-shrink-0">{style.icon}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium leading-relaxed">{notif.message}</p>
                </div>
                {notif.actionLink && (
                  <span className="text-3xs font-bold uppercase tracking-wider text-indigo-600 hover:text-indigo-800 transition-colors flex-shrink-0 flex items-center gap-0.5">
                    Revisar
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                    </svg>
                  </span>
                )}
              </div>
            );

            return notif.actionLink ? (
              <a
                key={notif.id}
                href={notif.actionLink}
                className={`block p-3 rounded-xl border ${style.bg} hover:-translate-y-0.5 transition-all duration-150 shadow-sm`}
              >
                {content}
              </a>
            ) : (
              <div
                key={notif.id}
                className={`p-3 rounded-xl border ${style.bg} shadow-sm`}
              >
                {content}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default NotificationPanel;
