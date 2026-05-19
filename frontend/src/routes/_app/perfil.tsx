import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Pencil, X } from "lucide-react";
import { useAuth, type User } from "@/context/AuthContext";
import { logrosCatalogo } from "@/data/cursos";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/perfil")({
  component: PerfilPage,
});

const niveles: User["nivel"][] = ["Nivel 0", "Nivel Básico", "JavaScript", "Proyectos"];
const avatares = ["🤖", "👩‍💻", "👨‍💻", "🧑‍🎓", "🦊", "🐱", "🐼", "🦉"];

function PerfilPage() {
  const { user, updateUser } = useAuth();
  const [open, setOpen] = useState(false);
  if (!user) return null;

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border bg-card p-6">
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start">
          <div className="flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-soft text-5xl shadow-soft">
            {user.avatar}
          </div>
          <div className="flex-1 text-center sm:text-left">
            <h1 className="text-2xl font-bold">{user.nombre}</h1>
            <p className="text-sm text-muted-foreground">{user.correo}</p>
            <p className="mt-1 text-xs font-semibold text-primary">{user.nivel}</p>
            <button onClick={() => setOpen(true)} className="mt-3 inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:opacity-90">
              <Pencil className="h-3.5 w-3.5" /> Editar perfil
            </button>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-3 gap-3 text-center">
          <Stat label="Nivel" value={user.nivel.replace("Nivel ", "")} />
          <Stat label="XP total" value={String(user.xp)} />
          <Stat label="Racha" value={`${user.racha} días 🔥`} />
        </div>
      </div>

      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-bold">Logros desbloqueados</h2>
          <Link to="/logros" className="text-sm font-semibold text-primary hover:underline">Ver todos</Link>
        </div>
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
          {logrosCatalogo.map((l) => {
            const unlocked = user.logros.includes(l.id);
            return (
              <motion.div key={l.id} whileHover={{ y: -2 }}
                className={`rounded-2xl border bg-card p-4 text-center transition ${unlocked ? "" : "opacity-40"}`}>
                <div className={`mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-2xl bg-${l.color}/15 text-2xl`}>
                  {l.icono}
                </div>
                <div className="text-xs font-semibold">{l.titulo}</div>
                <div className="mt-0.5 text-[10px] text-muted-foreground">{l.descripcion}</div>
              </motion.div>
            );
          })}
        </div>
      </section>

      <AnimatePresence>
        {open && <EditModal user={user} onClose={() => setOpen(false)} onSave={async (patch) => {
          try {
            await updateUser(patch);
            toast.success("Perfil actualizado");
            setOpen(false);
          } catch {
            toast.error("No se pudo actualizar el perfil");
          }
        }} />}
      </AnimatePresence>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-secondary p-3">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="mt-1 text-lg font-bold">{value}</div>
    </div>
  );
}

function EditModal({ user, onClose, onSave }: { user: User; onClose: () => void; onSave: (p: Partial<User>) => void | Promise<void> }) {
  const [form, setForm] = useState({ nombre: user.nombre, correo: user.correo, avatar: user.avatar, nivel: user.nivel });

  return (
    <>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose} className="fixed inset-0 z-40 bg-black/50" />
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
        className="fixed left-1/2 top-1/2 z-50 w-[92%] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-3xl border bg-card p-6 shadow-glow">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold">Editar perfil</h2>
          <button onClick={onClose} className="rounded-lg p-1.5 hover:bg-secondary"><X className="h-4 w-4" /></button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-muted-foreground">Avatar</label>
            <div className="flex flex-wrap gap-2">
              {avatares.map((a) => (
                <button key={a} onClick={() => setForm((f) => ({ ...f, avatar: a }))}
                  className={`flex h-12 w-12 items-center justify-center rounded-xl border text-2xl transition ${form.avatar === a ? "border-primary bg-primary-soft" : "hover:bg-secondary"}`}>
                  {a}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-muted-foreground">Nombre</label>
            <input value={form.nombre} onChange={(e) => setForm((f) => ({ ...f, nombre: e.target.value }))}
              className="w-full rounded-xl border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary" />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-muted-foreground">Correo</label>
            <input type="email" value={form.correo} onChange={(e) => setForm((f) => ({ ...f, correo: e.target.value }))}
              className="w-full rounded-xl border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary" />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-muted-foreground">Nivel de aprendizaje</label>
            <div className="grid grid-cols-2 gap-2">
              {niveles.map((n) => (
                <button key={n} onClick={() => setForm((f) => ({ ...f, nivel: n }))}
                  className={`rounded-xl border px-3 py-2 text-xs font-medium transition ${form.nivel === n ? "border-primary bg-primary-soft text-primary" : "hover:bg-secondary"}`}>
                  {n}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-6 flex gap-2">
          <button onClick={onClose} className="flex-1 rounded-xl border bg-card py-2.5 text-sm font-semibold hover:bg-secondary">Cancelar</button>
          <button onClick={() => onSave(form)} className="flex-1 rounded-xl bg-gradient-primary py-2.5 text-sm font-semibold text-primary-foreground shadow-soft hover:opacity-95">Guardar</button>
        </div>
      </motion.div>
    </>
  );
}
