import { useState, useEffect, useCallback } from "react";
import { useConvex } from "convex/react";
import { api } from "../../../../convex/_generated/api";

interface AdminSession {
  token: string;
  name: string;
  email: string;
}

const SESSION_KEY = "admin_session";

export function useAdminAuth() {
  const convex = useConvex();
  const [session, setSession] = useState<AdminSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Restore session from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(SESSION_KEY);
    if (stored) {
      try {
        const parsed: AdminSession = JSON.parse(stored);
        // Quick verify token still valid
        convex
          .action(api.adminAuth.verifyToken, { token: parsed.token })
          .then((res) => {
            if (res.valid) {
              setSession(parsed);
            } else {
              localStorage.removeItem(SESSION_KEY);
            }
            setLoading(false);
          })
          .catch(() => {
            localStorage.removeItem(SESSION_KEY);
            setLoading(false);
          });
      } catch {
        localStorage.removeItem(SESSION_KEY);
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, [convex]);

  const login = useCallback(
    async (email: string, password: string) => {
      setError(null);
      try {
        const result = await convex.action(api.adminAuth.login, { email, password });
        const newSession: AdminSession = {
          token: result.token,
          name: result.name,
          email: result.email,
        };
        localStorage.setItem(SESSION_KEY, JSON.stringify(newSession));
        setSession(newSession);
        return true;
      } catch (err: any) {
        setError(err.message ?? "Đăng nhập thất bại");
        return false;
      }
    },
    [convex],
  );

  const logout = useCallback(() => {
    localStorage.removeItem(SESSION_KEY);
    setSession(null);
  }, []);

  return {
    session,
    isAuthenticated: !!session,
    loading,
    error,
    login,
    logout,
  };
}
