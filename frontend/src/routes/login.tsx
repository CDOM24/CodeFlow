import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import { Code2, Mail, Lock, Sparkles } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

export const Route = createFileRoute("/login")({
  component: LoginPage,
});

function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErr("");
    if (!correo.includes("@")) return setErr("Ingresa un correo válido");
    if (password.length < 4) return setErr("La contraseña debe tener al menos 4 caracteres");
    setLoading(true);
    try {
      await login(correo, password);
      toast.success("¡Bienvenido de vuelta!");
      navigate({ to: "/inicio" });
    } catch {
      setErr("Error al iniciar sesión");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="relative hidden bg-gradient-primary p-12 lg:flex lg:flex-col lg:justify-between">
        <div className="flex items-center gap-3 text-primary-foreground">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/15 backdrop-blur">
            <Code2 className="h-6 w-6" />
          </div>
          <div>
            <div className="text-xl font-bold">CodeFlow</div>
            <div className="-mt-1 text-sm opacity-80">Start</div>
          </div>
        </div>
        <div className="text-primary-foreground">
          <Sparkles className="mb-4 h-10 w-10 opacity-80" />
          <h1 className="text-4xl font-bold leading-tight">La puerta de entrada al mundo de la programación.</h1>
          <p className="mt-4 max-w-md text-base opacity-90">Rutas guiadas, ejercicios interactivos, tutor IA y gamificación XP para aprender a tu ritmo.</p>
          <div className="mt-8 grid grid-cols-3 gap-3 max-w-md">
            {["Rutas guiadas", "Tutor IA", "Gamificación"].map((t) => (
              <div key={t} className="rounded-xl bg-white/10 px-3 py-3 text-sm font-medium backdrop-blur">{t}</div>
            ))}
          </div>
        </div>
        <div className="text-xs text-primary-foreground opacity-70">© CodeFlow Start</div>
      </div>

      <div className="flex items-center justify-center p-6 lg:p-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
          <div className="mb-8 flex items-center gap-2 lg:hidden">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-primary">
              <Code2 className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-bold">CodeFlow Start</span>
          </div>
          <h2 className="text-3xl font-bold">Inicia sesión</h2>
          <p className="mt-2 text-sm text-muted-foreground">Continúa donde lo dejaste y suma XP hoy.</p>

          <form onSubmit={onSubmit} className="mt-8 space-y-4">
            <Field icon={<Mail className="h-4 w-4" />} label="Correo electrónico">
              <input type="email" value={correo} onChange={(e) => setCorreo(e.target.value)}
                placeholder="tu@correo.com" className="w-full bg-transparent outline-none" />
            </Field>
            <Field icon={<Lock className="h-4 w-4" />} label="Contraseña">
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••" className="w-full bg-transparent outline-none" />
            </Field>
            {err && <div className="rounded-xl bg-destructive/10 px-3 py-2 text-sm text-destructive">{err}</div>}
            <button disabled={loading} type="submit"
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-primary py-3 text-sm font-semibold text-primary-foreground shadow-glow transition hover:opacity-95 disabled:opacity-60">
              {loading ? "Entrando..." : "Entrar"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            ¿No tienes cuenta?{" "}
            <Link to="/register" className="font-semibold text-primary hover:underline">Crear cuenta</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}

export function Field({ icon, label, children }: { icon: React.ReactNode; label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold text-muted-foreground">{label}</span>
      <div className="flex items-center gap-2 rounded-xl border bg-card px-3.5 py-3 transition focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20">
        <span className="text-muted-foreground">{icon}</span>
        {children}
      </div>
    </label>
  );
}
