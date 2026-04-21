import { NavLink, useLocation, useParams } from "react-router-dom";
import { Home, PlusSquare, FileText, CalendarDays } from "lucide-react";

const baseClass =
  "flex flex-col items-center justify-center rounded-2xl px-3 py-2 text-[11px] font-medium transition-all";
const activeClass = "bg-slate-900 text-white shadow-sm";
const inactiveClass = "text-slate-500";

export default function BottomNav() {
  const { id } = useParams();
  const location = useLocation();

  const dentroDeViaje = Boolean(
    id && location.pathname.startsWith(`/viajes/${id}`)
  );

  const navItems = dentroDeViaje
    ? [
        { to: `/viajes/${id}`, label: "Viaje", icon: Home },
        { to: `/viajes/${id}/resumen`, label: "Resumen", icon: FileText },
        { to: `/viajes/${id}/agenda`, label: "Agenda", icon: CalendarDays },
        { to: `/viajes/${id}/actividades/nueva`, label: "Nuevo", icon: PlusSquare },
      ]
    : [
        { to: "/viajes", label: "Viajes", icon: Home },
        { to: "/viajes/nuevo", label: "Nuevo", icon: PlusSquare },
        { to: "/reservas", label: "Reservas", icon: FileText },
        { to: "/alojamientos", label: "Sitios", icon: CalendarDays },
      ];

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 mx-auto max-w-md border-t border-slate-200 bg-white/95 px-3 pt-2 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] backdrop-blur"
      style={{ paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 12px)" }}
    >
      <div className="grid grid-cols-4 gap-2">
        {navItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/viajes" || item.to === `/viajes/${id}`}
              className={({ isActive }) =>
                `${baseClass} ${isActive ? activeClass : inactiveClass}`
              }
            >
              <Icon size={18} />
              <span className="mt-1">{item.label}</span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}