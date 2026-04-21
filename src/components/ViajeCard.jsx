import { Link } from "react-router-dom";

export default function ViajeCard({ viaje }) {
  return (
    <Link
      to={`/viajes/${viaje.id}`}
      className="block rounded-2xl border border-slate-200 p-4 shadow-sm transition hover:bg-slate-50"
    >
      <h2 className="text-lg font-semibold text-slate-800">{viaje.nombre}</h2>

      {viaje.descripcion && (
        <p className="mt-1 text-sm text-slate-500">{viaje.descripcion}</p>
      )}

      <p className="mt-2 text-sm text-slate-600">
        {viaje.fechaInicio} - {viaje.fechaFin}
      </p>

      <span className="mt-3 inline-block rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
        {viaje.estado}
      </span>
    </Link>
  );
}