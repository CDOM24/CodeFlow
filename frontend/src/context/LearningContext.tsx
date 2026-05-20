import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { api } from "@/lib/api";
import type { Curso, Leccion, RetoDiario } from "@/types/learning";

interface LearningContextType {
  cursos: Curso[];
  retosDiarios: RetoDiario[];
  loading: boolean;
  refresh: () => Promise<void>;
  getLeccion: (id: string) => { curso: Curso; leccion: Leccion } | null;
}

const LearningContext = createContext<LearningContextType | null>(null);

export function LearningProvider({ children }: { children: ReactNode }) {
  const [cursos, setCursos] = useState<Curso[]>([]);
  const [retosDiarios, setRetosDiarios] = useState<RetoDiario[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const learning = await api.learning();
      setCursos(learning.levels);
      setRetosDiarios(learning.challenges);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh().catch(() => setLoading(false));
  }, []);

  const value = useMemo<LearningContextType>(() => ({
    cursos,
    retosDiarios,
    loading,
    refresh,
    getLeccion: (id: string) => {
      for (const curso of cursos) {
        const leccion = curso.lecciones.find((item) => item.id === id);
        if (leccion) return { curso, leccion };
      }

      return null;
    },
  }), [cursos, retosDiarios, loading, refresh]);

  return <LearningContext.Provider value={value}>{children}</LearningContext.Provider>;
}

export function useLearning() {
  const ctx = useContext(LearningContext);
  if (!ctx) throw new Error("useLearning must be used within LearningProvider");
  return ctx;
}
