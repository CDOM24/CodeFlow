import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Lightbulb, Play, RotateCcw, Check, Star } from "lucide-react";
import { getLeccion } from "@/data/cursos";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/leccion/$id")({
  component: LeccionPage,
});

function LeccionPage() {
  const { id } = Route.useParams();
  const found = getLeccion(id);
  const { user, completarLeccion } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState<"instruccion" | "codigo" | "ayuda">("instruccion");
  const [codigo, setCodigo] = useState("");
  const [salida, setSalida] = useState<{ ok: boolean; msg: string } | null>(null);

  if (!found) {
    return (
      <div className="rounded-2xl border bg-card p-10 text-center">
        <p>Lección no encontrada.</p>
        <Link to="/cursos" className="mt-4 inline-flex text-primary hover:underline">Volver a cursos</Link>
      </div>
    );
  }
  const { curso, leccion } = found;
  const yaCompletada = !!user?.progresoLecciones[leccion.id];

  const ejecutar = () => {
    const limpio = codigo.replace(/\s+/g, " ").trim().toLowerCase();
    const esperado = (leccion.codigoEsperado ?? "").replace(/\s+/g, " ").trim().toLowerCase();
    if (esperado && limpio === esperado) {
      setSalida({ ok: true, msg: leccion.mensajeExito ?? "Correcto. Puedes completar la leccion." });
    } else if (!esperado && codigo.trim().length > 0) {
      setSalida({ ok: true, msg: leccion.mensajeExito ?? "Codigo ejecutado sin errores." });
    } else {
      setSalida({ ok: false, msg: "Aun no es correcto. Revisa la instruccion o abre la pestana Ayuda." });
    }
  };

  const completar = async () => {
    try {
      await completarLeccion(leccion.id, leccion.xp);
      toast.success(`¡+${leccion.xp} XP!`);
      setTimeout(() => navigate({ to: "/cursos" }), 500);
    } catch {
      toast.error("No se pudo guardar la leccion");
    }
  };

  return (
    <div className="mx-auto max-w-3xl space-y-5">
      <div className="flex items-center justify-between">
        <Link to="/cursos" className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> {curso.titulo} <span className="text-muted-foreground/60">›</span> {leccion.titulo}
        </Link>
        <span className="flex items-center gap-1 rounded-full bg-warning/15 px-3 py-1 text-xs font-semibold text-warning-foreground">
          <Star className="h-3.5 w-3.5 fill-warning text-warning" /> XP: {leccion.xp}
        </span>
      </div>

      <div className="rounded-2xl border bg-card">
        <div className="flex border-b">
          {(["instruccion", "codigo", "ayuda"] as const).map((t) => (
            <button key={t} onClick={() => setTab(t)}
              className={`relative flex-1 py-3 text-sm font-semibold capitalize transition ${tab === t ? "text-primary" : "text-muted-foreground hover:text-foreground"}`}>
              {t === "instruccion" ? "Instrucción" : t === "codigo" ? "Código" : "Ayuda"}
              {tab === t && <motion.div layoutId="tab-underline" className="absolute inset-x-4 -bottom-px h-0.5 bg-primary" />}
            </button>
          ))}
        </div>

        <div className="p-6">
          {tab === "instruccion" && (
            <div className="space-y-4">
              <div className="rounded-2xl bg-gradient-soft p-5">
                {leccion.objetivo && (
                  <div className="mb-3">
                    <div className="text-xs font-bold uppercase text-primary">Objetivo</div>
                    <p className="mt-1 text-sm font-semibold">{leccion.objetivo}</p>
                  </div>
                )}
                <p className="text-sm leading-relaxed text-muted-foreground">{leccion.contenido}</p>
              </div>
              {leccion.codigoEsperado && (
                <div className="rounded-xl border bg-background p-4 font-mono text-sm">
                  <div className="mb-2 text-xs font-sans font-semibold text-muted-foreground">
                    {leccion.instruccion ?? "Escribe este codigo:"}
                  </div>
                  <code>{leccion.codigoEsperado}</code>
                </div>
              )}
              <button onClick={() => setTab("codigo")}
                className="w-full rounded-xl bg-gradient-primary py-3 text-sm font-semibold text-primary-foreground shadow-glow hover:opacity-95">
                Empezar ejercicio
              </button>
            </div>
          )}

          {tab === "codigo" && (
            <div className="space-y-3">
              <div className="rounded-2xl bg-gradient-soft p-4 text-sm">
                <div className="font-semibold">{leccion.instruccion ?? "Resuelve el ejercicio en el editor."}</div>
                {leccion.codigoEsperado && (
                  <div className="mt-2 rounded-lg border bg-background px-3 py-2 font-mono text-xs">
                    {leccion.codigoEsperado}
                  </div>
                )}
              </div>
              <div className="overflow-hidden rounded-xl border bg-[oklch(0.18_0.03_280)] font-mono text-sm text-emerald-300">
                <div className="flex items-center justify-between border-b border-white/10 px-4 py-2 text-xs text-white/60">
                  <span>editor.js</span>
                  <span className="flex gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
                    <span className="h-2.5 w-2.5 rounded-full bg-yellow-400" />
                    <span className="h-2.5 w-2.5 rounded-full bg-green-400" />
                  </span>
                </div>
                <textarea value={codigo} onChange={(e) => setCodigo(e.target.value)}
                  placeholder={leccion.codigoEsperado ?? "// Escribe tu codigo aqui"}
                  rows={8} spellCheck={false}
                  className="w-full resize-none bg-transparent p-4 outline-none placeholder:text-white/30" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button onClick={ejecutar} className="flex items-center justify-center gap-2 rounded-xl bg-success py-3 text-sm font-semibold text-success-foreground hover:opacity-90">
                  <Play className="h-4 w-4 fill-current" /> Ejecutar
                </button>
                <button onClick={() => { setCodigo(""); setSalida(null); }}
                  className="flex items-center justify-center gap-2 rounded-xl border bg-card py-3 text-sm font-semibold hover:bg-secondary">
                  <RotateCcw className="h-4 w-4" /> Reiniciar
                </button>
              </div>
              {salida && (
                <div className={`rounded-xl border p-4 ${salida.ok ? "border-success/30 bg-success/10" : "border-destructive/30 bg-destructive/10"}`}>
                  <div className="mb-1 text-xs font-semibold text-muted-foreground">Salida</div>
                  <p className={`text-sm font-medium ${salida.ok ? "text-success" : "text-destructive"}`}>{salida.msg}</p>
                </div>
              )}
              {salida?.ok && !yaCompletada && (
                <button onClick={completar} className="w-full rounded-xl bg-gradient-primary py-3 text-sm font-semibold text-primary-foreground shadow-glow hover:opacity-95">
                  <Check className="mr-1 inline h-4 w-4" /> Completar lección (+{leccion.xp} XP)
                </button>
              )}
              {yaCompletada && (
                <div className="rounded-xl bg-success/10 px-4 py-3 text-center text-sm font-semibold text-success">
                  ¡Ya completaste esta lección! ✨
                </div>
              )}
            </div>
          )}

          {tab === "ayuda" && (
            <div className="space-y-4">
              <div className="flex gap-3 rounded-2xl bg-gradient-soft p-5">
                <Lightbulb className="h-6 w-6 shrink-0 text-warning" />
                <div className="text-sm">
                  <div className="mb-1 font-semibold">Pista</div>
                  <p className="text-muted-foreground">{leccion.pista ?? "Lee atentamente la instrucción y prueba paso a paso."}</p>
                </div>
              </div>
              <Link to="/tutor" className="block w-full rounded-xl border bg-card py-3 text-center text-sm font-semibold hover:bg-secondary">
                Preguntar al Tutor IA 🤖
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
