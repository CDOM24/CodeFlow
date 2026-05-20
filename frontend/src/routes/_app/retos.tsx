import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Check, Star, Code2 } from "lucide-react";
import { useLearning } from "@/context/LearningContext";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/retos")({
  component: RetosPage,
});

const dificultadColor: Record<string, string> = {
  Facil: "success",
  Medio: "warning",
  Dificil: "destructive",
};

function RetosPage() {
  const { user, completarReto } = useAuth();
  const { retosDiarios, loading } = useLearning();
  if (!user) return null;

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  const resolver = async (id: string, xp: number) => {
    try {
      await completarReto(id);
      toast.success(`Reto completado. +${xp} XP`);
    } catch {
      toast.error("No se pudo guardar el reto");
    }
  };

  const reto = retosDiarios[0];
  const hecho0 = reto ? user.retosCompletados.includes(reto.id) : false;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold lg:text-3xl">Retos diarios</h1>
        <p className="text-sm text-muted-foreground">Suma XP resolviendo desafios rapidos.</p>
      </div>

      {reto && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          className="overflow-hidden rounded-3xl border bg-card shadow-soft">
          <div className="bg-gradient-soft p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold">Reto de hoy</h2>
              <span className="rounded-full bg-success/15 px-3 py-1 text-xs font-semibold text-success">{reto.dificultad}</span>
            </div>
            <p className="mt-3 text-base font-semibold">{reto.titulo}</p>
            <p className="mt-1 text-sm text-muted-foreground">{reto.descripcion}</p>
            <div className="mt-4 flex items-center justify-between">
              <span className="flex items-center gap-1 font-semibold text-warning">
                <Star className="h-4 w-4 fill-warning" /> +{reto.xp} XP
              </span>
              <button onClick={() => resolver(reto.id, reto.xp)} disabled={hecho0}
                className="rounded-xl bg-gradient-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-soft transition hover:opacity-95 disabled:opacity-50">
                {hecho0 ? "Completado" : "Resolver reto"}
              </button>
            </div>
          </div>
        </motion.div>
      )}

      <section>
        <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-muted-foreground">Otros retos</h3>
        <div className="space-y-2.5">
          {retosDiarios.slice(1).map((r, i) => {
            const done = user.retosCompletados.includes(r.id);
            const color = dificultadColor[r.dificultad] ?? "primary";
            return (
              <motion.div key={r.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                className="flex items-center gap-3 rounded-2xl border bg-card p-4 transition hover:border-primary/40 hover:shadow-soft">
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-${color}/15 text-${color}`}>
                  <Code2 className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate font-semibold">{r.titulo}</div>
                  <div className="text-xs text-muted-foreground">{r.dificultad}</div>
                </div>
                <span className="hidden text-sm font-semibold text-warning sm:inline">+{r.xp} XP</span>
                <button onClick={() => resolver(r.id, r.xp)} disabled={done}
                  className="rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground transition hover:opacity-90 disabled:opacity-50">
                  {done ? <Check className="h-4 w-4" /> : "Resolver"}
                </button>
              </motion.div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
