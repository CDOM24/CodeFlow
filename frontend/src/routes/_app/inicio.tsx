import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Bell, ChevronRight, Lock, Check, Flame, Trophy, Star } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { cursos, retosDiarios } from "@/data/cursos";

export const Route = createFileRoute("/_app/inicio")({
  component: InicioPage,
});

function InicioPage() {
  const { user } = useAuth();
  if (!user) return null;

  const nivelActual = cursos.find((c) => c.nivel === user.nivel) ?? cursos[0];
  const proximaLeccion = nivelActual.lecciones.find((l) => !user.progresoLecciones[l.id]);
  const xpHaciaSiguiente = 1000;
  const progresoNivel = Math.min(100, Math.round((user.xp % xpHaciaSiguiente) / 10));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold lg:text-3xl">¡Hola, {user.nombre.split(" ")[0]}! 👋</h1>
          <p className="text-sm text-muted-foreground">Continúa tu camino hacia ser desarrollador.</p>
        </div>
        <button className="relative rounded-xl border bg-card p-2.5 hover:bg-secondary">
          <Bell className="h-5 w-5" />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-destructive" />
        </button>
      </div>

      {/* XP Card */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-primary p-6 text-primary-foreground shadow-glow">
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <div className="text-xs font-medium uppercase tracking-wider opacity-80">Tu progreso</div>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-semibold backdrop-blur">{user.nivel}</span>
              <span className="text-4xl font-bold">{user.xp}</span>
              <span className="text-sm opacity-80">XP ⚡</span>
            </div>
            <div className="mt-4 flex items-center gap-4 text-sm">
              <span className="flex items-center gap-1.5"><Flame className="h-4 w-4" /> {user.racha} días</span>
              <span className="flex items-center gap-1.5"><Trophy className="h-4 w-4" /> {user.logros.length} logros</span>
            </div>
          </div>
          <div className="text-6xl">🤖</div>
        </div>
        <div className="relative z-10 mt-5">
          <div className="mb-1.5 flex justify-between text-xs opacity-80">
            <span>Progreso del nivel</span><span>{progresoNivel}%</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-white/25">
            <motion.div initial={{ width: 0 }} animate={{ width: `${progresoNivel}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="h-full rounded-full bg-white" />
          </div>
        </div>
      </motion.div>

      {/* Continuar aprendiendo */}
      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-bold">Continúa aprendiendo</h2>
          <Link to="/cursos" className="text-sm font-semibold text-primary hover:underline">Ver todo</Link>
        </div>
        <div className="space-y-2.5">
          {nivelActual.lecciones.slice(0, 4).map((l, i) => {
            const done = !!user.progresoLecciones[l.id];
            const locked = i > 0 && !user.progresoLecciones[nivelActual.lecciones[i - 1].id];
            const isProximo = !done && !locked;
            const inner = (
              <>
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                  done ? "bg-success text-success-foreground" :
                  isProximo ? "bg-warning text-warning-foreground" : "bg-muted text-muted-foreground"
                }`}>
                  {done ? <Check className="h-5 w-5" /> : locked ? <Lock className="h-4 w-4" /> : i + 1}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <div className="truncate font-semibold">{i + 1}. {l.titulo}</div>
                    {done && <span className="shrink-0 text-xs font-semibold text-success">+{l.xp} XP</span>}
                  </div>
                  <div className="text-xs text-muted-foreground">{done ? "Completada" : isProximo ? "En progreso" : "Bloqueada"}</div>
                </div>
                {!locked && <ChevronRight className="h-5 w-5 text-muted-foreground transition group-hover:translate-x-1 group-hover:text-primary" />}
              </>
            );
            const cls = `group flex items-center gap-4 rounded-2xl border bg-card p-4 transition ${
              locked ? "pointer-events-none opacity-60" : "hover:border-primary/40 hover:shadow-soft"
            }`;
            return locked ? (
              <div key={l.id} className={cls}>{inner}</div>
            ) : (
              <Link key={l.id} to="/leccion/$id" params={{ id: l.id }} className={cls}>{inner}</Link>
            );
          })}
        </div>
        {proximaLeccion && (
          <Link to="/leccion/$id" params={{ id: proximaLeccion.id }}
            className="mt-3 block w-full rounded-2xl bg-gradient-primary py-3.5 text-center text-sm font-semibold text-primary-foreground shadow-glow transition hover:opacity-95">
            Continuar lección
          </Link>
        )}
      </section>

      {/* Reto del día */}
      <section className="grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border bg-card p-5">
          <div className="mb-2 flex items-center justify-between">
            <h3 className="font-bold">Reto de hoy</h3>
            <span className="rounded-full bg-success/15 px-2.5 py-1 text-xs font-semibold text-success">Fácil</span>
          </div>
          <p className="text-sm font-medium">{retosDiarios[0].titulo}</p>
          <p className="mt-1 text-xs text-muted-foreground">{retosDiarios[0].descripcion}</p>
          <div className="mt-4 flex items-center justify-between">
            <span className="flex items-center gap-1 text-sm font-semibold text-warning"><Star className="h-4 w-4 fill-warning" /> +{retosDiarios[0].xp} XP</span>
            <Link to="/retos" className="rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:opacity-90">Resolver reto</Link>
          </div>
        </div>
        <div className="rounded-2xl border bg-gradient-soft p-5">
          <div className="mb-2 flex items-center gap-2">
            <span className="text-2xl">💡</span>
            <h3 className="font-bold">Recomendación para ti</h3>
          </div>
          <p className="text-sm text-muted-foreground">Practica condicionales para mejorar tu lógica de programación.</p>
          <Link to="/cursos" className="mt-4 inline-flex rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:opacity-90">
            Ir a la lección
          </Link>
        </div>
      </section>
    </div>
  );
}
