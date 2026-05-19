import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { api } from "@/lib/api";

export interface User {
  id: string;
  nombre: string;
  correo: string;
  avatar: string;
  nivel: string;
  xp: number;
  racha: number;
  leccionesCompletadas: number;
  logros: string[];
  retosCompletados: string[];
  progresoLecciones: Record<string, boolean>;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (correo: string, password: string) => Promise<User>;
  register: (data: { nombre: string; correo: string; password: string; nivel: User["nivel"] }) => Promise<User>;
  logout: () => Promise<void>;
  updateUser: (patch: Partial<User>) => Promise<void>;
  addXP: (amount: number) => void;
  completarLeccion: (id: string, xp: number) => Promise<void>;
  completarReto: (id: string, xp: number) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);
const STORAGE_KEY = "codeflow_user";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const persist = (u: User | null) => {
    setUser(u);
    if (u) localStorage.setItem(STORAGE_KEY, JSON.stringify(u));
    else localStorage.removeItem(STORAGE_KEY);
  };

  useEffect(() => {
    let alive = true;

    async function loadUser() {
      try {
        if (!api.getToken()) {
          persist(null);
          return;
        }

        const currentUser = await api.me();
        if (alive) persist(currentUser);
      } catch {
        api.setToken(null);
        if (alive) persist(null);
      } finally {
        if (alive) setLoading(false);
      }
    }

    loadUser();

    return () => {
      alive = false;
    };
  }, []);

  const login: AuthContextType["login"] = async (correo, password) => {
    const u = await api.login(correo, password);
    persist(u);
    return u;
  };

  const register: AuthContextType["register"] = async (data) => {
    const u = await api.register(data);
    persist(u);
    return u;
  };

  const logout = async () => {
    await api.logout();
    persist(null);
  };

  const updateUser: AuthContextType["updateUser"] = async (patch) => {
    if (!user) return;
    const updated = await api.updateMe(patch);
    persist(updated);
  };

  const addXP = (amount: number) => {
    if (!user) return;
    persist({ ...user, xp: user.xp + amount });
  };

  const completarLeccion: AuthContextType["completarLeccion"] = async (id, xp) => {
    if (!user || user.progresoLecciones[id]) return;
    const updated = await api.completeLesson(id, xp);
    persist(updated);
  };

  const completarReto: AuthContextType["completarReto"] = async (id, xp) => {
    if (!user || user.retosCompletados.includes(id)) return;
    const updated = await api.completeChallenge(id, xp);
    persist(updated);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateUser, addXP, completarLeccion, completarReto }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
