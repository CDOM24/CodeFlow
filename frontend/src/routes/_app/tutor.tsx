import { createFileRoute } from "@tanstack/react-router";
import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Send, Bot } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export const Route = createFileRoute("/_app/tutor")({
  component: TutorPage,
});

interface Msg { id: string; rol: "user" | "ia"; texto: string; codigo?: string }

const respuestas = [
  "Una variable es un espacio en la memoria de la computadora que almacena un dato que puede cambiar.\n\nPor ejemplo:",
  "Las condicionales (if/else) permiten que tu programa tome decisiones según se cumplan ciertas condiciones.",
  "Sirve para guardar información que puedes usar y modificar durante la ejecución de un programa.",
  "Una función es un bloque de código reutilizable. La defines una vez y la llamas cuantas veces necesites.",
  "Los loops (bucles) te permiten repetir instrucciones varias veces sin escribirlas de nuevo. Por ejemplo: for, while.",
];

const sugerencias = ["¿Qué es una variable?", "¿Y para qué sirve?", "Explícame los loops", "¿Qué es una función?"];

function TutorPage() {
  const { user } = useAuth();
  const [mensajes, setMensajes] = useState<Msg[]>([
    { id: "1", rol: "ia", texto: "¡Hola! Soy tu Tutor IA. Pregúntame lo que quieras sobre programación. 🤖" },
  ]);
  const [input, setInput] = useState("");
  const [escribiendo, setEscribiendo] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [mensajes, escribiendo]);

  const enviar = (texto: string) => {
    if (!texto.trim()) return;
    const userMsg: Msg = { id: crypto.randomUUID(), rol: "user", texto };
    setMensajes((m) => [...m, userMsg]);
    setInput("");
    setEscribiendo(true);
    setTimeout(() => {
      const r = respuestas[Math.floor(Math.random() * respuestas.length)];
      const incluyeCodigo = r.includes("Por ejemplo");
      setMensajes((m) => [...m, {
        id: crypto.randomUUID(), rol: "ia", texto: r,
        codigo: incluyeCodigo ? 'let nombre = "Juan";' : undefined,
      }]);
      setEscribiendo(false);
    }, 900);
  };

  return (
    <div className="mx-auto flex h-[calc(100vh-8rem)] max-w-3xl flex-col">
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-primary shadow-glow">
          <Bot className="h-6 w-6 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-xl font-bold">Tutor de practica</h1>
          <p className="text-xs text-muted-foreground">Respuestas guiadas mientras conectamos la IA real</p>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto rounded-2xl border bg-card p-4">
        {mensajes.map((m) => (
          <motion.div key={m.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            className={`flex gap-2 ${m.rol === "user" ? "justify-end" : ""}`}>
            {m.rol === "ia" && (
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-soft text-base">🤖</div>
            )}
            <div className={`max-w-[78%] space-y-2 rounded-2xl px-4 py-2.5 text-sm ${
              m.rol === "user" ? "bg-gradient-primary text-primary-foreground" : "bg-secondary"
            }`}>
              <p className="whitespace-pre-wrap leading-relaxed">{m.texto}</p>
              {m.codigo && (
                <pre className="overflow-x-auto rounded-lg bg-background px-3 py-2 font-mono text-xs text-foreground">{m.codigo}</pre>
              )}
            </div>
            {m.rol === "user" && (
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm text-primary-foreground">
                {user?.avatar ?? "👤"}
              </div>
            )}
          </motion.div>
        ))}
        {escribiendo && (
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-soft">🤖</div>
            <div className="flex gap-1 rounded-2xl bg-secondary px-4 py-3">
              {[0, 1, 2].map((i) => (
                <motion.span key={i} animate={{ y: [0, -4, 0] }} transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.15 }}
                  className="h-1.5 w-1.5 rounded-full bg-muted-foreground" />
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="mt-3 flex gap-2 overflow-x-auto pb-2">
        {sugerencias.map((s) => (
          <button key={s} onClick={() => enviar(s)} className="shrink-0 rounded-full border bg-card px-3 py-1.5 text-xs font-medium hover:bg-primary-soft hover:text-primary">
            {s}
          </button>
        ))}
      </div>

      <form onSubmit={(e) => { e.preventDefault(); enviar(input); }}
        className="flex items-center gap-2 rounded-2xl border bg-card p-2">
        <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Escribe tu duda..."
          className="flex-1 bg-transparent px-3 py-2 text-sm outline-none" />
        <button type="submit" className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-primary text-primary-foreground shadow-soft hover:opacity-90">
          <Send className="h-4 w-4" />
        </button>
      </form>
    </div>
  );
}
