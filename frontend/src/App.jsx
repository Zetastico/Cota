import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import useAuth from "./hooks/useAuth.js"

import ProtectedRoute from "./components/ProtectedRoute"

import DashboardLayout from "./layouts/DashboardLayout"
import UserTopbarLayout from "./layouts/UserTopbarLayout"

import LandingPage from "./pages/LandingPage"
import LoginPage from "./pages/LoginPage"
import RegisterPage from "./pages/RegisterPage"
import DashboardPage from "./pages/DashboardPage"
import UserOverviewPage from "./pages/UserOverviewPage"
import UsersPage from "./pages/UsersPage"
import CreateUserPage from "./pages/CreateUserPage"
import EditUserPage from "./pages/EditUserPage"
import ServicesPage from "./pages/ServicesPage"
import CreateServicePage from "./pages/CreateServicePage"
import EditServicePage from "./pages/EditServicePage"
import PendingServicesPage from "./pages/PendingServicesPage"
import PublicServicesPage from "./pages/PublicServicesPage"
import MyServiceRequestsPage from "./pages/MyServiceRequestsPage"
import MyRequestsPage from "./pages/MyRequestsPage"
import MessagesPage from "./pages/MessagesPage"
import NotFoundPage from "./pages/NotFoundPage"

/**
 * PublicOrHomeRoute
 * - While auth is loading → show a minimal full-screen loader.
 * - If NOT authenticated → show the Landing Page.
 * - If authenticated as USER → redirect to /services/explore.
 * - If authenticated as HOST or ADMIN → redirect to /dashboard.
 */
const PublicOrHomeRoute = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center shadow-xl animate-pulse">
            <span className="text-white font-black text-lg">C</span>
          </div>
          <p className="text-slate-400 text-sm">Cargando…</p>
        </div>
      </div>
    );
  }

  if (!user) return <LandingPage />;
  if (user.rol === "USER") return <Navigate to="/services/explore" replace />;
  return <Navigate to="/dashboard" replace />;
};

const DynamicLayout = () => {
  const { user } = useAuth();
  if (user?.rol === "USER") {
    return <UserTopbarLayout />;
  }
  return <DashboardLayout />;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Root — smart redirect / landing page */}
        <Route path="/" element={<PublicOrHomeRoute />} />

        {/* Public routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Protected layout routes */}
        <Route
          path="/app"
          element={
            <ProtectedRoute>
              <DynamicLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/dashboard" replace />} />

          <Route path="dashboard" element={<DashboardPage />} />

          <Route
            path="my-overview"
            element={
              <ProtectedRoute allowedRoles={["USER"]}>
                <UserOverviewPage />
              </ProtectedRoute>
            }
          />

          {/* User management (Admin only) */}
          <Route path="users">
            <Route
              index
              element={
                <ProtectedRoute allowedRoles={["ADMIN"]}>
                  <UsersPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="create"
              element={
                <ProtectedRoute allowedRoles={["ADMIN"]}>
                  <CreateUserPage />
                </ProtectedRoute>
              }
            />
            <Route
              path=":id/edit"
              element={
                <ProtectedRoute allowedRoles={["ADMIN"]}>
                  <EditUserPage />
                </ProtectedRoute>
              }
            />
          </Route>

          {/* Service requests (Host only) */}
          <Route
            path="service-requests"
            element={
              <ProtectedRoute allowedRoles={["HOST"]}>
                <MyServiceRequestsPage />
              </ProtectedRoute>
            }
          />

          {/* My requests history (User only) */}
          <Route
            path="my-requests"
            element={
              <ProtectedRoute allowedRoles={["USER"]}>
                <MyRequestsPage />
              </ProtectedRoute>
            }
          />

          {/* Service management */}
          <Route path="services">
            <Route
              index
              element={
                <ProtectedRoute allowedRoles={["HOST", "ADMIN"]}>
                  <ServicesPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="create"
              element={
                <ProtectedRoute allowedRoles={["HOST"]}>
                  <CreateServicePage />
                </ProtectedRoute>
              }
            />
            <Route
              path=":id/edit"
              element={
                <ProtectedRoute allowedRoles={["HOST", "ADMIN"]}>
                  <EditServicePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="pending"
              element={
                <ProtectedRoute allowedRoles={["ADMIN"]}>
                  <PendingServicesPage />
                </ProtectedRoute>
              }
            />
          </Route>
        </Route>

        {/* Top-level protected routes (USER role — uses UserTopbarLayout) */}
        <Route
          element={
            <ProtectedRoute allowedRoles={["USER"]}>
              <UserTopbarLayout />
            </ProtectedRoute>
          }
        >
          <Route path="my-overview" element={<UserOverviewPage />} />
          <Route path="my-requests" element={<MyRequestsPage />} />
          <Route path="services/explore" element={<PublicServicesPage />} />
        </Route>

        {/* Top-level protected routes (ADMIN / HOST — uses DashboardLayout) */}
        <Route
          element={
            <ProtectedRoute allowedRoles={["ADMIN", "HOST"]}>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="users" element={<UsersPage />} />
          <Route path="users/create" element={<CreateUserPage />} />
          <Route path="users/:id/edit" element={<EditUserPage />} />
          <Route path="services" element={<ServicesPage />} />
          <Route path="services/create" element={<CreateServicePage />} />
          <Route path="services/:id/edit" element={<EditServicePage />} />
          <Route path="services/pending" element={<PendingServicesPage />} />
          <Route path="service-requests" element={<MyServiceRequestsPage />} />
        </Route>


        {/* Shared messages route for USER and HOST */}
        <Route
          element={
            <ProtectedRoute allowedRoles={["USER", "HOST"]}>
              <DynamicLayout />
            </ProtectedRoute>
          }
        >
          <Route path="messages" element={<MessagesPage />} />
        </Route>

        {/* 404 */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App