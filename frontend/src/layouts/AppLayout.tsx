import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home, BookOpen, Star, Bot, LayoutDashboard, User, Settings, LogOut, Code2, Menu, X, Trophy,
} from "lucide-react";
import { useState, type ReactNode } from "react";
import { useAuth } from "@/context/AuthContext";

const navItems = [
  { to: "/inicio", label: "Inicio", icon: Home },
  { to: "/cursos", label: "Cursos", icon: BookOpen },
  { to: "/retos", label: "Retos diarios", icon: Star },
  { to: "/tutor", label: "Tutor practica", icon: Bot },
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/perfil", label: "Perfil", icon: User },
  { to: "/logros", label: "Logros", icon: Trophy },
];

function SidebarContent({ onNav }: { onNav?: () => void }) {
  const { pathname } = useLocation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="flex h-full flex-col bg-sidebar text-sidebar-foreground">
      <div className="flex items-center gap-2 px-6 py-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-primary shadow-glow">
          <Code2 className="h-5 w-5 text-primary-foreground" />
        </div>
        <div>
          <div className="text-base font-bold leading-tight">CodeFlow</div>
          <div className="text-xs text-muted-foreground -mt-0.5">Start</div>
        </div>
      </div>

      <nav className="flex-1 space-y-1 px-3">
        {navItems.map((item) => {
          const active = pathname === item.to || pathname.startsWith(item.to + "/");
          const Icon = item.icon;
          return (
            <Link
              key={item.to}
              to={item.to}
              onClick={onNav}
              className={`relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                active ? "bg-primary-soft text-primary" : "text-sidebar-foreground hover:bg-secondary"
              }`}
            >
              {active && (
                <motion.div
                  layoutId="active-pill"
                  className="absolute inset-0 rounded-xl bg-primary-soft -z-10"
                  transition={{ type: "spring", duration: 0.5 }}
                />
              )}
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="m-3 rounded-2xl bg-gradient-primary p-4 text-primary-foreground shadow-soft">
        <div className="text-xs opacity-90">Plan Gratuito</div>
        <div className="mt-1 text-sm font-semibold">Tutor practica: 3 / 5</div>
        <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-white/25">
          <div className="h-full w-3/5 rounded-full bg-white" />
        </div>
      </div>

      <div className="border-t p-3">
        <button
          onClick={() => { logout(); navigate({ to: "/login" }); }}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
        >
          <LogOut className="h-4 w-4" /> Cerrar sesión
        </button>
        {user && (
          <div className="mt-2 flex items-center gap-3 rounded-xl px-3 py-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-soft text-lg">{user.avatar}</div>
            <div className="min-w-0">
              <div className="truncate text-sm font-semibold">{user.nombre}</div>
              <div className="truncate text-xs text-muted-foreground">{user.correo}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export function AppLayout({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 hidden w-64 border-r lg:block">
        <SidebarContent />
      </aside>

      {/* Mobile header */}
      <header className="sticky top-0 z-30 flex items-center justify-between border-b bg-background/90 px-4 py-3 backdrop-blur lg:hidden">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-primary">
            <Code2 className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="font-bold">CodeFlow Start</span>
        </div>
        <button onClick={() => setOpen(true)} className="rounded-lg p-2 hover:bg-secondary">
          <Menu className="h-5 w-5" />
        </button>
      </header>

      {/* Mobile drawer */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-40 bg-black/40 lg:hidden"
            />
            <motion.aside
              initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25 }}
              className="fixed inset-y-0 left-0 z-50 w-72 lg:hidden"
            >
              <div className="relative h-full">
                <button onClick={() => setOpen(false)} className="absolute right-3 top-3 z-10 rounded-lg p-2 hover:bg-secondary">
                  <X className="h-5 w-5" />
                </button>
                <SidebarContent onNav={() => setOpen(false)} />
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <main className="lg:pl-64">
        <div className="mx-auto max-w-6xl px-4 py-6 lg:px-8 lg:py-10">{children}</div>
      </main>
    </div>
  );
}
