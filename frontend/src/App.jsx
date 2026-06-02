import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"

import ProtectedRoute from "./components/ProtectedRoute"

import DashboardLayout from "./layouts/DashboardLayout"

import LoginPage from "./pages/LoginPage"
import RegisterPage from "./pages/RegisterPage"
import DashboardPage from "./pages/DashboardPage"
import UsersPage from "./pages/UsersPage"
import CreateUserPage from "./pages/CreateUserPage"
import EditUserPage from "./pages/EditUserPage"
import ServicesPage from "./pages/ServicesPage"
import CreateServicePage from "./pages/CreateServicePage"
import EditServicePage from "./pages/EditServicePage"
import PendingServicesPage from "./pages/PendingServicesPage"
import NotFoundPage from "./pages/NotFoundPage"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Protected routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/dashboard" replace />} />

          <Route path="dashboard" element={<DashboardPage />} />

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

        {/* 404 */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App