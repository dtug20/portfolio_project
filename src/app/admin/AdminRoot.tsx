import { useEffect, useState } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router";
import { useAdminAuth } from "./hooks/useAdminAuth";
import { AdminLogin } from "./AdminLogin";
import { AdminDashboard } from "./pages/AdminDashboard";
import { AdminShows } from "./pages/AdminShows";
import { AdminGallery } from "./pages/AdminGallery";
import { AdminMedia } from "./pages/AdminMedia";
import { AdminBlog } from "./pages/AdminBlog";
import { AdminArtist } from "./pages/AdminArtist";
import { AdminSettings } from "./pages/AdminSettings";

function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading } = useAdminAuth();

  if (loading) {
    return (
      <div style={{
        minHeight: "100vh",
        backgroundColor: "#0A0A0A",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}>
        <div style={{
          width: 4,
          height: 4,
          borderRadius: "50%",
          backgroundColor: "#333",
        }} />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  return <>{children}</>;
}

function LoginPage() {
  const { isAuthenticated } = useAdminAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) navigate("/admin", { replace: true });
  }, [isAuthenticated, navigate]);

  return <AdminLogin onSuccess={() => navigate("/admin", { replace: true })} />;
}

export function AdminRoot() {
  return (
    <Routes>
      <Route path="login" element={<LoginPage />} />
      <Route
        path="*"
        element={
          <AuthGuard>
            <Routes>
              <Route index element={<AdminDashboard />} />
              <Route path="shows" element={<AdminShows />} />
              <Route path="gallery" element={<AdminGallery />} />
              <Route path="media" element={<AdminMedia />} />
              <Route path="blog" element={<AdminBlog />} />
              <Route path="artist" element={<AdminArtist />} />
              <Route path="settings" element={<AdminSettings />} />
              <Route path="*" element={<Navigate to="/admin" replace />} />
            </Routes>
          </AuthGuard>
        }
      />
    </Routes>
  );
}
