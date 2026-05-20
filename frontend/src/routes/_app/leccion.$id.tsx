import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState, type Dispatch, type DragEvent, type SetStateAction } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Lightbulb, Play, RotateCcw, Check, Star, Plus, X } from "lucide-react";
import { useLearning } from "@/context/LearningContext";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import type { Bloque, CompleteLessonPayload, Leccion } from "@/types/learning";

export const Route = createFileRoute("/_app/leccion/$id")({
  component: LeccionPage,
});

function LeccionPage() {
  const { id } = Route.useParams();
  const { getLeccion, loading } = useLearning();
  const found = getLeccion(id);
  const { user, completarLeccion } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState<"instruccion" | "ejercicio" | "ayuda">("instruccion");
  const [codigo, setCodigo] = useState("");
  const [bloques, setBloques] = useState<string[]>([]);
  const [selectedOption, setSelectedOption] = useState("");
  const [salida, setSalida] = useState<{ ok: boolean; msg: string } | null>(null);

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!found) {
    return (
      <div className="rounded-2xl border bg-card p-10 text-center">
        <p>Leccion no encontrada.</p>
        <Link to="/cursos" className="mt-4 inline-flex text-primary hover:underline">Volver a cursos</Link>
      </div>
    );
  }

  const { curso, leccion } = found;
  const yaCompletada = !!user?.progresoLecciones[leccion.id];

  const payload = buildPayload(leccion, codigo, bloques, selectedOption);

  const ejecutar = async () => {
    try {
      await completarLeccion(leccion.id, payload);
      setSalida({ ok: true, msg: leccion.mensajeExito ?? "Correcto. Progreso guardado." });
      toast.success(leccion.xp > 0 ? `+${leccion.xp} XP` : "Lectura completada");
      setTimeout(() => navigate({ to: "/cursos" }), 650);
    } catch {
      setSalida({ ok: false, msg: "Aun no es correcto. Revisa la instruccion o abre la pestana Ayuda." });
    }
  };

  return (
    <div className="mx-auto max-w-3xl space-y-5">
      <div className="flex items-center justify-between">
        <Link to="/cursos" className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> {curso.titulo} <span className="text-muted-foreground/60">/</span> {leccion.titulo}
        </Link>
        <span className="flex items-center gap-1 rounded-full bg-warning/15 px-3 py-1 text-xs font-semibold text-warning-foreground">
          <Star className="h-3.5 w-3.5 fill-warning text-warning" /> {leccion.xp > 0 ? `XP: ${leccion.xp}` : "Lectura"}
        </span>
      </div>

      <div className="rounded-2xl border bg-card">
        <div className="flex border-b">
          {(["instruccion", "ejercicio", "ayuda"] as const).map((t) => (
            <button key={t} onClick={() => setTab(t)}
              className={`relative flex-1 py-3 text-sm font-semibold capitalize transition ${tab === t ? "text-primary" : "text-muted-foreground hover:text-foreground"}`}>
              {t === "instruccion" ? "Instruccion" : t === "ejercicio" ? "Ejercicio" : "Ayuda"}
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
              <div className="rounded-xl border bg-background p-4 text-sm">
                <div className="mb-2 text-xs font-semibold text-muted-foreground">Tu tarea</div>
                <p>{leccion.instruccion ?? "Completa el ejercicio para continuar."}</p>
              </div>
              <button onClick={() => setTab("ejercicio")}
                className="w-full rounded-xl bg-gradient-primary py-3 text-sm font-semibold text-primary-foreground shadow-glow hover:opacity-95">
                Empezar ejercicio
              </button>
            </div>
          )}

          {tab === "ejercicio" && (
            <div className="space-y-4">
              {leccion.tipo === "blocks" && (
                <BlocksExercise leccion={leccion} bloques={bloques} setBloques={setBloques} />
              )}

              {leccion.tipo === "quiz" && (
                <QuizExercise leccion={leccion} selectedOption={selectedOption} setSelectedOption={setSelectedOption} />
              )}

              {leccion.tipo === "reading" && (
                <ReadingLesson leccion={leccion} />
              )}

              {leccion.tipo === "console" && (
                <ConsoleExercise leccion={leccion} codigo={codigo} setCodigo={setCodigo} />
              )}

              <div className="grid grid-cols-2 gap-2">
                <button onClick={ejecutar} disabled={yaCompletada}
                  className="flex items-center justify-center gap-2 rounded-xl bg-success py-3 text-sm font-semibold text-success-foreground hover:opacity-90 disabled:opacity-50">
                  {leccion.tipo === "reading" ? <Check className="h-4 w-4" /> : <Play className="h-4 w-4 fill-current" />}
                  {yaCompletada ? "Completada" : leccion.tipo === "reading" ? "Marcar como leida" : "Validar"}
                </button>
                <button onClick={() => { setCodigo(""); setBloques([]); setSelectedOption(""); setSalida(null); }}
                  className="flex items-center justify-center gap-2 rounded-xl border bg-card py-3 text-sm font-semibold hover:bg-secondary">
                  <RotateCcw className="h-4 w-4" /> Reiniciar
                </button>
              </div>

              {salida && (
                <div className={`rounded-xl border p-4 ${salida.ok ? "border-success/30 bg-success/10" : "border-destructive/30 bg-destructive/10"}`}>
                  <div className="mb-1 text-xs font-semibold text-muted-foreground">Resultado</div>
                  <p className={`text-sm font-medium ${salida.ok ? "text-success" : "text-destructive"}`}>{salida.msg}</p>
                </div>
              )}

              {yaCompletada && (
                <div className="rounded-xl bg-success/10 px-4 py-3 text-center text-sm font-semibold text-success">
                  Ya completaste esta leccion.
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
                  <p className="text-muted-foreground">{leccion.pista ?? "Lee atentamente la instruccion y prueba paso a paso."}</p>
                </div>
              </div>
              <div className="rounded-xl border bg-card px-4 py-3 text-sm text-muted-foreground">
                El tutor queda disponible como practica, pero no lo cambiamos en esta etapa.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function buildPayload(leccion: Leccion, codigo: string, bloques: string[], selectedOption: string): CompleteLessonPayload {
  if (leccion.tipo === "blocks") return { blocks: bloques };
  if (leccion.tipo === "quiz") return { selectedOption };
  if (leccion.tipo === "reading") return {};
  return { answer: codigo };
}

function ReadingLesson({ leccion }: { leccion: Leccion }) {
  return (
    <div className="space-y-4">
      <div className="rounded-2xl border bg-card p-5">
        <div className="mb-2 text-xs font-bold uppercase text-primary">Leccion</div>
        <p className="text-sm leading-7 text-muted-foreground">{leccion.contenido}</p>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        {[
          ["1", "Una instruccion es una orden pequena."],
          ["2", "Un programa es una secuencia ordenada."],
          ["3", "Los bloques ayudan a pensar antes de escribir codigo."],
        ].map(([step, text]) => (
          <div key={step} className="rounded-xl border bg-background p-4">
            <div className="mb-2 flex h-7 w-7 items-center justify-center rounded-lg bg-primary-soft text-xs font-bold text-primary">
              {step}
            </div>
            <p className="text-sm font-medium leading-relaxed">{text}</p>
          </div>
        ))}
      </div>

      <div className="rounded-xl bg-success/10 px-4 py-3 text-sm font-medium text-success">
        {leccion.instruccion ?? "Lee con calma y continua cuando estes listo."}
      </div>
    </div>
  );
}

function BlocksExercise({ leccion, bloques, setBloques }: {
  leccion: Leccion;
  bloques: string[];
  setBloques: Dispatch<SetStateAction<string[]>>;
}) {
  const [dragOver, setDragOver] = useState(false);
  const selected = bloques
    .map((id) => leccion.bloques.find((block) => block.id === id))
    .filter((block): block is Bloque => Boolean(block));

  const addBlock = (id: string) => setBloques((current) => [...current, id]);
  const removeBlock = (index: number) => setBloques((current) => current.filter((_, i) => i !== index));
  const clearBlocks = () => setBloques([]);
  const handleDragStart = (event: DragEvent<HTMLButtonElement>, id: string) => {
    event.dataTransfer.setData("text/plain", id);
    event.dataTransfer.effectAllowed = "copy";
  };
  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const id = event.dataTransfer.getData("text/plain");
    if (id) addBlock(id);
    setDragOver(false);
  };

  return (
    <div className="space-y-4">
      <div className="rounded-2xl bg-gradient-soft p-4 text-sm">
        <div className="font-semibold">{leccion.instruccion}</div>
        <p className="mt-1 text-muted-foreground">Arrastra los bloques al programa o tocalos para agregarlos en orden.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border bg-card p-4">
          <div className="mb-2 text-xs font-bold uppercase text-muted-foreground">Bloques disponibles</div>
          <div className="space-y-3">
            {leccion.bloques.map((block) => (
              <VisualBlock
                key={block.id}
                block={block}
                onClick={() => addBlock(block.id)}
                onDragStart={(event) => handleDragStart(event, block.id)}
              />
            ))}
          </div>
        </div>

        <div className="rounded-2xl border bg-card p-4">
          <div className="mb-2 flex items-center justify-between">
            <div className="text-xs font-bold uppercase text-muted-foreground">Tu programa</div>
            {selected.length > 0 && (
              <button onClick={clearBlocks} className="text-xs font-semibold text-muted-foreground hover:text-destructive">
                Limpiar
              </button>
            )}
          </div>
          <div
            onDragOver={(event) => {
              event.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            className={`min-h-60 rounded-2xl border-2 border-dashed bg-background p-3 transition ${
              dragOver ? "border-primary bg-primary-soft/40" : "border-border"
            }`}
          >
            <div className="mb-3 rounded-xl border bg-card px-3 py-2 text-xs font-semibold text-muted-foreground">
              Cuando se ejecute
            </div>
            {selected.length === 0 && (
              <div className="flex min-h-32 items-center justify-center rounded-xl bg-secondary/50 px-4 text-center text-sm text-muted-foreground">
                Suelta aqui el primer bloque
              </div>
            )}
            {selected.map((block, index) => block && (
              <div key={`${block.id}-${index}`} className="mb-2 flex items-center gap-2">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-secondary text-xs font-bold text-muted-foreground">
                  {index + 1}
                </div>
                <VisualBlock block={block} compact onRemove={() => removeBlock(index)} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function VisualBlock({ block, compact = false, onClick, onDragStart, onRemove }: {
  block: Bloque;
  compact?: boolean;
  onClick?: () => void;
  onDragStart?: (event: DragEvent<HTMLButtonElement>) => void;
  onRemove?: () => void;
}) {
  const colors = blockColors(block.kind);
  const content = (
    <>
      <span className={`absolute -left-2 top-1/2 h-4 w-4 -translate-y-1/2 rounded-full ${colors.tab}`} />
      <span className={`absolute -right-2 top-1/2 h-5 w-5 -translate-y-1/2 rounded-full border-4 border-card ${colors.notch}`} />
      <span className="min-w-0 flex-1 truncate">{block.label}</span>
      {onRemove ? (
        <button onClick={onRemove} className="rounded-md p-1 hover:bg-white/30" aria-label="Quitar bloque">
          <X className="h-3.5 w-3.5" />
        </button>
      ) : (
        <Plus className="h-4 w-4 shrink-0" />
      )}
    </>
  );

  const className = `relative flex w-full items-center gap-2 rounded-xl border px-4 py-3 text-left text-sm font-semibold shadow-sm transition ${colors.block} ${
    compact ? "py-2.5" : "cursor-grab active:cursor-grabbing hover:-translate-y-0.5 hover:shadow-md"
  }`;

  if (onClick) {
    return (
      <button draggable onClick={onClick} onDragStart={onDragStart} className={className}>
        {content}
      </button>
    );
  }

  return <div className={className}>{content}</div>;
}

function blockColors(kind: string) {
  if (kind === "event") {
    return {
      block: "border-emerald-300 bg-emerald-100 text-emerald-900",
      tab: "bg-emerald-400",
      notch: "bg-emerald-100",
    };
  }

  if (kind === "logic") {
    return {
      block: "border-amber-300 bg-amber-100 text-amber-950",
      tab: "bg-amber-400",
      notch: "bg-amber-100",
    };
  }

  if (kind === "data") {
    return {
      block: "border-sky-300 bg-sky-100 text-sky-950",
      tab: "bg-sky-400",
      notch: "bg-sky-100",
    };
  }

  return {
    block: "border-violet-300 bg-violet-100 text-violet-950",
    tab: "bg-violet-400",
    notch: "bg-violet-100",
  };
}

function QuizExercise({ leccion, selectedOption, setSelectedOption }: {
  leccion: Leccion;
  selectedOption: string;
  setSelectedOption: (value: string) => void;
}) {
  return (
    <div className="space-y-3">
      <div className="rounded-2xl bg-gradient-soft p-4 text-sm font-semibold">{leccion.instruccion}</div>
      {leccion.opciones.map((option) => (
        <button key={option.id} onClick={() => setSelectedOption(option.id)}
          className={`w-full rounded-xl border px-4 py-3 text-left text-sm transition ${
            selectedOption === option.id ? "border-primary bg-primary-soft text-primary" : "bg-card hover:bg-secondary"
          }`}>
          {option.label}
        </button>
      ))}
    </div>
  );
}

function ConsoleExercise({ leccion, codigo, setCodigo }: {
  leccion: Leccion;
  codigo: string;
  setCodigo: (value: string) => void;
}) {
  return (
    <div className="space-y-3">
      <div className="rounded-2xl bg-gradient-soft p-4 text-sm">
        <div className="font-semibold">{leccion.instruccion}</div>
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
    </div>
  );
}
