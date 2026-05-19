import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { BookCheck, Zap, Flame, TrendingUp } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { progresoSemanal } from "@/data/cursos";

export const Route = createFileRoute("/_app/dashboard")({
  component: DashboardPage,
});

function DashboardPage() {
  const { user } = useAuth();
  if (!user) return null;

  const stats = [
    { label: "Lecciones completadas", value: user.leccionesCompletadas, icon: BookCheck, color: "primary" },
    { label: "XP totales", value: user.xp, icon: Zap, color: "warning" },
    { label: "Racha actual", value: `${user.racha} días`, icon: Flame, color: "destructive" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold lg:text-3xl">Tu progreso</h1>
        <p className="text-sm text-muted-foreground">Estadísticas y análisis de tu aprendizaje.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {stats.map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            className="rounded-2xl border bg-card p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{s.label}</span>
              <s.icon className={`h-4 w-4 text-${s.color}`} />
            </div>
            <div className="mt-2 text-3xl font-bold">{s.value}</div>
          </motion.div>
        ))}
      </div>

      <div className="rounded-2xl border bg-card p-5">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="font-bold">Progreso semanal</h2>
            <p className="text-xs text-muted-foreground">XP ganados esta semana</p>
          </div>
          <span className="flex items-center gap-1 rounded-full bg-success/15 px-2.5 py-1 text-xs font-semibold text-success">
            <TrendingUp className="h-3 w-3" /> +18%
          </span>
        </div>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={progresoSemanal}>
              <defs>
                <linearGradient id="lg" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="oklch(0.58 0.22 285)" />
                  <stop offset="100%" stopColor="oklch(0.65 0.22 305)" />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.92 0.01 280)" />
              <XAxis dataKey="dia" stroke="oklch(0.5 0.03 280)" fontSize={12} />
              <YAxis stroke="oklch(0.5 0.03 280)" fontSize={12} />
              <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid oklch(0.92 0.01 280)" }} />
              <Line type="monotone" dataKey="xp" stroke="url(#lg)" strokeWidth={3} dot={{ fill: "oklch(0.58 0.22 285)", r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="rounded-2xl border bg-gradient-soft p-5">
        <div className="flex items-center gap-3">
          <span className="text-3xl">💡</span>
          <div>
            <h3 className="font-bold">Recomendación para ti</h3>
            <p className="text-sm text-muted-foreground">Practica condicionales para mejorar tu lógica de programación.</p>
          </div>
        </div>
        <Link to="/cursos" className="mt-4 inline-flex rounded-xl bg-gradient-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-soft hover:opacity-95">
          Ir a la lección
        </Link>
      </div>
    </div>
  );
}
