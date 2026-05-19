import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import { Code2, Mail, Lock, User as UserIcon, Sparkles } from "lucide-react";
import { useAuth, type User } from "@/context/AuthContext";
import { Field } from "./login";
import { toast } from "sonner";

export const Route = createFileRoute("/register")({
  component: RegisterPage,
});

const niveles: User["nivel"][] = ["Nivel 0", "Nivel Básico", "JavaScript", "Proyectos"];

function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ nombre: "", correo: "", password: "", confirmar: "", nivel: "Nivel 0" as User["nivel"] });
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const set = (k: keyof typeof form, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErr("");
    if (form.nombre.trim().length < 2) return setErr("Ingresa tu nombre");
    if (!form.correo.includes("@")) return setErr("Correo inválido");
    if (form.password.length < 4) return setErr("La contraseña debe tener al menos 4 caracteres");
    if (form.password !== form.confirmar) return setErr("Las contraseñas no coinciden");
    setLoading(true);
    try {
      await register({ nombre: form.nombre, correo: form.correo, password: form.password, nivel: form.nivel });
      toast.success("¡Cuenta creada! Empieza tu aventura.");
      navigate({ to: "/inicio" });
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
          <h1 className="text-4xl font-bold leading-tight">"Para todos los que alguna vez pensaron que programar no es para ellos. ¡Sí lo es!"</h1>
          <p className="mt-4 max-w-md text-base opacity-90">Crea tu cuenta y desbloquea tu primer nivel hoy mismo.</p>
        </div>
        <div className="text-xs text-primary-foreground opacity-70">© CodeFlow Start</div>
      </div>

      <div className="flex items-center justify-center p-6 lg:p-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
          <h2 className="text-3xl font-bold">Crea tu cuenta</h2>
          <p className="mt-2 text-sm text-muted-foreground">Configura tu nivel y empieza a sumar XP.</p>

          <form onSubmit={onSubmit} className="mt-8 space-y-4">
            <Field icon={<UserIcon className="h-4 w-4" />} label="Nombre">
              <input value={form.nombre} onChange={(e) => set("nombre", e.target.value)} placeholder="Juan Pérez" className="w-full bg-transparent outline-none" />
            </Field>
            <Field icon={<Mail className="h-4 w-4" />} label="Correo electrónico">
              <input type="email" value={form.correo} onChange={(e) => set("correo", e.target.value)} placeholder="tu@correo.com" className="w-full bg-transparent outline-none" />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field icon={<Lock className="h-4 w-4" />} label="Contraseña">
                <input type="password" value={form.password} onChange={(e) => set("password", e.target.value)} placeholder="••••••" className="w-full bg-transparent outline-none" />
              </Field>
              <Field icon={<Lock className="h-4 w-4" />} label="Confirmar">
                <input type="password" value={form.confirmar} onChange={(e) => set("confirmar", e.target.value)} placeholder="••••••" className="w-full bg-transparent outline-none" />
              </Field>
            </div>
            <div>
              <span className="mb-1.5 block text-xs font-semibold text-muted-foreground">Nivel inicial</span>
              <div className="grid grid-cols-2 gap-2">
                {niveles.map((n) => (
                  <button type="button" key={n} onClick={() => set("nivel", n)}
                    className={`rounded-xl border px-3 py-2.5 text-sm font-medium transition ${
                      form.nivel === n ? "border-primary bg-primary-soft text-primary" : "hover:bg-secondary"
                    }`}>{n}</button>
                ))}
              </div>
            </div>
            {err && <div className="rounded-xl bg-destructive/10 px-3 py-2 text-sm text-destructive">{err}</div>}
            <button disabled={loading} type="submit"
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-primary py-3 text-sm font-semibold text-primary-foreground shadow-glow transition hover:opacity-95 disabled:opacity-60">
              {loading ? "Creando cuenta..." : "Crear cuenta"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            ¿Ya tienes cuenta?{" "}
            <Link to="/login" className="font-semibold text-primary hover:underline">Inicia sesión</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
