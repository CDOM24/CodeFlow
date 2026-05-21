import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { AlertCircle, Bot, Send, Sparkles } from "lucide-react";
import { api, type TutorMessage } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

export const Route = createFileRoute("/_app/tutor")({
    component: TutorPage,
});

interface Msg {
    id: string;
    rol: "user" | "ia";
    texto: string;
    codigo?: string;
    error?: boolean;
}

const SUGERENCIAS = [
    "Que es una variable?",
    "Explicame los loops",
    "Como funciona una funcion?",
    "Tengo un error en mi codigo",
];

function crearId() {
    return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function parsearRespuesta(texto: string): { texto: string; codigo?: string } {
    const match = texto.match(/```[\w]*\n?([\s\S]*?)```/);

    if (!match) return { texto };

    return {
        texto: texto.replace(/```[\w]*\n?[\s\S]*?```/, "").trim(),
        codigo: match[1].trim(),
    };
}

function TutorPage() {
    const { user } = useAuth();
    const [mensajes, setMensajes] = useState<Msg[]>([
        {
            id: "1",
            rol: "ia",
            texto: "Hola. Soy tu Tutor IA de CodeFlow.\n\nPuedo ayudarte a entender conceptos de programacion y darte pistas cuando estes atascado. No te dare la respuesta directa, pero si te guiare paso a paso.\n\nQue duda tienes?",
        },
    ]);
    const [historialApi, setHistorialApi] = useState<TutorMessage[]>([]);
    const [input, setInput] = useState("");
    const [cargando, setCargando] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
    }, [mensajes, cargando]);

    const enviar = async (texto: string) => {
        const clean = texto.trim();
        if (!clean) return;

        const userMsg: Msg = { id: crearId(), rol: "user", texto: clean };
        const nuevoHistorial: TutorMessage[] = [
            ...historialApi,
            { role: "user" as const, content: clean },
        ].slice(-12);

        setMensajes((current) => [...current, userMsg]);
        setHistorialApi(nuevoHistorial);
        setInput("");
        setCargando(true);

        try {
            const response = await api.tutor(nuevoHistorial);
            const parsed = parsearRespuesta(response.message);
            const iaMsg: Msg = {
                id: crearId(),
                rol: "ia",
                texto: parsed.texto,
                codigo: parsed.codigo,
            };

            setMensajes((current) => [...current, iaMsg]);
            setHistorialApi((current) =>
                [...current, { role: "assistant" as const, content: response.message }].slice(-12),
            );
        } catch (error) {
            const message =
                error instanceof Error ? error.message : "No se pudo conectar con el tutor.";
            setMensajes((current) => [
                ...current,
                {
                    id: crearId(),
                    rol: "ia",
                    texto: message,
                    error: true,
                },
            ]);
            setHistorialApi(historialApi);
        } finally {
            setCargando(false);
        }
    };

    return (
        <div className="relative mx-auto flex h-[calc(100vh-8rem)] max-w-3xl flex-col">
            <div className="mb-4 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-primary shadow-glow">
                    <Bot className="h-6 w-6 text-primary-foreground" />
                </div>
                <div>
                    <h1 className="text-xl font-bold">Tutor IA</h1>
                    <p className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Sparkles className="h-3 w-3 text-yellow-400" />
                        Guiado por Claude - Solo programacion
                    </p>
                </div>
            </div>

            <div
                ref={scrollRef}
                className="min-h-0 flex-1 space-y-3 overflow-y-auto rounded-2xl border bg-card p-4"
            >
                {mensajes.map((m) => (
                    <div
                        key={m.id}
                        className={`flex gap-2 ${m.rol === "user" ? "justify-end" : ""}`}
                    >
                        {m.rol === "ia" && (
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-soft text-base">
                                <Bot className="h-4 w-4 text-primary" />
                            </div>
                        )}
                        <div
                            className={`max-w-[78%] space-y-2 rounded-2xl px-4 py-2.5 text-sm ${
                                m.rol === "user"
                                    ? "bg-gradient-primary text-primary-foreground"
                                    : m.error
                                      ? "border border-destructive/30 bg-destructive/10 text-destructive"
                                      : "bg-secondary"
                            }`}
                        >
                            {m.error && <AlertCircle className="mb-1 h-4 w-4" />}
                            <p className="whitespace-pre-wrap leading-relaxed">{m.texto}</p>
                            {m.codigo && (
                                <pre className="overflow-x-auto rounded-lg bg-background px-3 py-2 font-mono text-xs text-foreground">
                                    {m.codigo}
                                </pre>
                            )}
                        </div>
                        {m.rol === "user" && (
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm text-primary-foreground">
                                {user?.avatar ?? "U"}
                            </div>
                        )}
                    </div>
                ))}

                {cargando && (
                    <motion.div
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-2"
                    >
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-soft">
                            <Bot className="h-4 w-4 text-primary" />
                        </div>
                        <div className="flex gap-1 rounded-2xl bg-secondary px-4 py-3">
                            {[0, 1, 2].map((i) => (
                                <motion.span
                                    key={i}
                                    animate={{ y: [0, -4, 0] }}
                                    transition={{
                                        duration: 0.8,
                                        repeat: Infinity,
                                        delay: i * 0.15,
                                    }}
                                    className="h-1.5 w-1.5 rounded-full bg-muted-foreground"
                                />
                            ))}
                        </div>
                    </motion.div>
                )}
            </div>

            <div className="pointer-events-auto relative z-50 mt-3 flex gap-2 overflow-x-auto pb-2">
                {SUGERENCIAS.map((s) => (
                    <button
                        key={s}
                        onClick={() => enviar(s)}
                        type="button"
                        className="pointer-events-auto shrink-0 cursor-pointer rounded-full border bg-card px-3 py-1.5 text-xs font-medium hover:bg-primary-soft hover:text-primary"
                    >
                        {s}
                    </button>
                ))}
            </div>

            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    enviar(input);
                }}
                className="pointer-events-auto relative z-50 flex items-center gap-2 rounded-2xl border bg-card p-2"
            >
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={
                        cargando ? "Esperando respuesta..." : "Escribe tu duda de programacion..."
                    }
                    autoComplete="off"
                    className="pointer-events-auto min-w-0 flex-1 bg-transparent px-3 py-2 text-sm outline-none"
                />
                <button
                    type="submit"
                    disabled={!input.trim()}
                    className="pointer-events-auto flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl bg-gradient-primary text-primary-foreground shadow-soft hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
                >
                    <Send className="h-4 w-4" />
                </button>
            </form>
        </div>
    );
}
