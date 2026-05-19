import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { logrosCatalogo } from "@/data/cursos";

export const Route = createFileRoute("/_app/logros")({
  component: LogrosPage,
});

function LogrosPage() {
  const { user } = useAuth();
  if (!user) return null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold lg:text-3xl">Tus logros</h1>
        <p className="text-sm text-muted-foreground">{user.logros.length} de {logrosCatalogo.length} desbloqueados</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {logrosCatalogo.map((l, i) => {
          const unlocked = user.logros.includes(l.id);
          return (
            <motion.div key={l.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className={`flex items-center gap-4 rounded-2xl border bg-card p-5 transition ${unlocked ? "shadow-soft" : "opacity-50"}`}>
              <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-${l.color}/15 text-3xl`}>{l.icono}</div>
              <div>
                <div className="font-bold">{l.titulo}</div>
                <div className="text-xs text-muted-foreground">{l.descripcion}</div>
                {unlocked && <div className="mt-1 text-xs font-semibold text-success">Desbloqueado ✓</div>}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
