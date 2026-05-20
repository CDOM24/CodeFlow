import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Check, Lock, ChevronRight } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useLearning } from "@/context/LearningContext";

export const Route = createFileRoute("/_app/cursos")({
  component: CursosPage,
});

function CursosPage() {
  const { user } = useAuth();
  const { cursos, loading } = useLearning();
  if (!user) return null;

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold lg:text-3xl">Mis rutas de aprendizaje</h1>
        <p className="text-sm text-muted-foreground">Elige una ruta para continuar.</p>
      </div>

      <div className="space-y-3">
        {cursos.map((c, idx) => {
          const total = c.lecciones.length;
          const hechas = c.lecciones.filter((l) => user.progresoLecciones[l.id]).length;
          const pct = Math.round((hechas / total) * 100);
          const completo = pct === 100;
          const locked = !c.desbloqueado;

          return (
            <motion.div key={c.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }}>
              <div className={`group rounded-2xl border bg-card p-5 transition ${locked ? "opacity-70" : "hover:border-primary/40 hover:shadow-soft"}`}>
                <div className="flex items-start gap-4">
                  <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-xl ${
                    completo ? "bg-success text-success-foreground" :
                    locked ? "bg-muted text-muted-foreground" : `bg-${c.color}/15 text-${c.color}`
                  }`}>
                    {completo ? <Check className="h-6 w-6" /> : locked ? <Lock className="h-5 w-5" /> : iconFor(c.icono)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-bold">{c.titulo}</h3>
                        <p className="text-xs text-muted-foreground">{c.descripcion}</p>
                      </div>
                      <span className="shrink-0 text-sm font-semibold text-muted-foreground">{pct}%</span>
                    </div>
                    <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-secondary">
                      <div className="h-full rounded-full bg-gradient-primary" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                </div>

                {!locked && (
                  <div className="mt-4 grid gap-2 sm:grid-cols-2">
                    {c.lecciones.map((l) => {
                      const done = !!user.progresoLecciones[l.id];
                      return (
                        <Link key={l.id} to="/leccion/$id" params={{ id: l.id }}
                          className="flex items-center justify-between rounded-xl border bg-background px-3 py-2.5 text-sm transition hover:border-primary/40 hover:bg-primary-soft">
                          <span className="flex items-center gap-2 min-w-0">
                            <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs ${done ? "bg-success text-success-foreground" : "bg-muted"}`}>
                              {done ? <Check className="h-3 w-3" /> : "•"}
                            </span>
                            <span className="truncate">{l.titulo}</span>
                          </span>
                          <ChevronRight className="h-4 w-4 text-muted-foreground" />
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

function iconFor(icon: string) {
  const icons: Record<string, string> = {
    blocks: "▦",
    terminal: ">_",
    zap: "⚡",
    code: "</>",
  };

  return icons[icon] ?? icon;
}
