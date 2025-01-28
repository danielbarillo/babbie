import { Routes as RouterRoutes, Route, Navigate } from "react-router-dom";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { Chat } from "./pages/Chat";
import { Profile } from "./pages/Profile";
import { Settings } from "./pages/Settings";
import { NotFound } from "./pages/NotFound";
import { MainLayout } from "./components/MainLayout";
import { PublicRoute } from "./components/PublicRoute";

export default function Routes() {
  return (
    <RouterRoutes>
      {/* Public Routes */}
      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />
      <Route
        path="/register"
        element={
          <PublicRoute>
            <Register />
          </PublicRoute>
        }
      />

      {/* Protected Routes */}
      <Route element={<MainLayout />}>
        <Route path="/chat" element={<Chat />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/settings" element={<Settings />} />
      </Route>

      {/* Redirect root to chat */}
      <Route
        path="/"
        element={<Navigate to="/chat" replace />}
      />

      {/* 404 Page */}
      <Route path="*" element={<NotFound />} />
    </RouterRoutes>
  );
}
