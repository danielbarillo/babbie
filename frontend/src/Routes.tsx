import { Routes as RouterRoutes, Route, Navigate } from "react-router-dom";
import { Login } from "./pages/Login";
import Register from "./components/Register";
import { Chat } from "./pages/Chat";
import { Profile } from "./pages/Profile";
import { Settings } from "./pages/Settings";
import { NotFound } from "./pages/NotFound";
import { MainLayout } from "./components/MainLayout";
import { PublicRoute } from "./components/PublicRoute";
import DirectMessages from "./pages/DirectMessages";

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
        <Route path="/messages" element={<DirectMessages />} />
        <Route path="/messages/:userId" element={<DirectMessages />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/settings" element={<Settings />} />
      </Route>

      {/* Redirect root to chat */}
      <Route path="/" element={<Navigate to="/chat" replace />} />

      {/* 404 Page */}
      <Route path="*" element={<NotFound />} />
    </RouterRoutes>
  );
}
