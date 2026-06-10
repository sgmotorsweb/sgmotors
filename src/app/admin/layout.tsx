"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { LayoutDashboard, Car, Inbox, Settings, LogOut, ChevronRight, Trash2, Key } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { Sun, Moon } from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [authed, setAuthed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const auth = localStorage.getItem("sgmotors_admin_auth");
    if (auth === "true") {
      setAuthed(true);
    } else if (pathname !== "/admin/login") {
      router.push("/admin/login");
    }
    setLoading(false);
  }, [pathname, router]);

  useEffect(() => {
    const updateUnread = () => {
      try {
        const stored = localStorage.getItem("sgmotors_messages");
        if (stored) {
          const msgs = JSON.parse(stored);
          const unread = msgs.filter((m: { status: string }) => m.status === "non lu").length;
          setUnreadCount(unread);
        }
      } catch {}
    };
    updateUnread();
    window.addEventListener("storage", updateUnread);
    const interval = setInterval(updateUnread, 3000);
    return () => {
      window.removeEventListener("storage", updateUnread);
      clearInterval(interval);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("sgmotors_admin_auth");
    router.push("/admin/login");
  };

  const handleClearDemo = () => {
    localStorage.removeItem("sgmotors_vehicles");
    window.location.reload();
  };

  if (pathname === "/admin/login") return <>{children}</>;
  if (loading) return null;
  if (!authed) return null;

  const navItems = [
    { href: "/admin", label: "Tableau de bord", icon: LayoutDashboard },
    { href: "/admin/inventory", label: "Inventaire", icon: Car },
    { href: "/admin/messages", label: "Messagerie", icon: Inbox, badge: unreadCount > 0 ? String(unreadCount) : undefined },
    { href: "/admin/settings", label: "Paramètres", icon: Settings },
    { href: "/admin/api-settings", label: "API", icon: Key },
  ];

  return (
    <div className="flex flex-col md:flex-row min-h-screen w-full" style={{ backgroundColor: "var(--bg-primary)" }}>
      <aside className="w-full md:w-64 flex-shrink-0 flex flex-col hidden md:flex border-r" style={{ backgroundColor: "var(--bg-secondary)", borderColor: "var(--border-primary)" }}>
        <div className="p-6 border-b" style={{ borderColor: "var(--border-primary)" }}>
          <h2 className="text-xl font-bold flex items-center gap-2" style={{ color: "var(--text-primary)" }}>
            <Settings style={{ color: "var(--color-sg-accent-blue)" }} className="h-5 w-5" /> Back-Office
          </h2>
          <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>SG MOTORS Admin</p>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link key={item.href} href={item.href}
                className="flex items-center justify-between px-4 py-3 rounded-lg font-medium transition-colors"
                style={isActive ? { backgroundColor: "var(--badge-bg)", color: "var(--color-sg-accent-blue)", border: "1px solid var(--border-primary)" } : { color: "var(--text-muted)" }}>
                <div className="flex items-center gap-3">
                  <item.icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </div>
                {item.badge ? <span className="text-white text-xs font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: "var(--color-sg-accent-blue)" }}>{item.badge}</span> : isActive ? <ChevronRight className="h-4 w-4" /> : null}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t space-y-2" style={{ borderColor: "var(--border-primary)" }}>
          <button onClick={handleClearDemo}
            className="flex items-center gap-3 w-full px-4 py-3 rounded-lg transition-colors"
            style={{ color: "var(--text-muted)" }}>
            <Trash2 className="h-5 w-5 text-red-400" />
            <span className="text-red-400">Supprimer données démo</span>
          </button>
          <button onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3 rounded-lg transition-colors"
            style={{ color: "var(--text-muted)" }}>
            <LogOut className="h-5 w-5" />
            <span>Déconnexion</span>
          </button>
        </div>
      </aside>
      <main className="flex-1 flex flex-col min-w-0 bg-primary">
        <div className="flex items-center justify-between px-6 py-3 border-b md:hidden" style={{ borderColor: "var(--border-primary)", backgroundColor: "var(--bg-secondary)" }}>
          <h2 className="font-bold" style={{ color: "var(--text-primary)" }}>Admin SG MOTORS</h2>
          <div className="flex gap-2">
            <button onClick={toggleTheme} className="p-2 rounded-lg" style={{ color: "var(--text-muted)" }}>
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
            <button onClick={handleLogout} className="p-2 rounded-lg" style={{ color: "var(--text-muted)" }}>
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
        <div className="p-6 md:p-8 flex-1">{children}</div>
      </main>
    </div>
  );
}
