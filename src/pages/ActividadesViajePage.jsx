import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../services/api";

export default function ActividadesViajePage() {
  const { id } = useParams();

  const [actividades, setActividades] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargarActividades = async () => {
      try {
        const response = await api.get(`/actividades/viaje/${id}`);
        setActividades(response.data);
      } catch (err) {
        console.error(err);
        setError("No se han podido cargar las actividades.");
      } finally {
        setLoading(false);
      }
    };

    cargarActividades();
  }, [id]);

  return (
    <div className="space-y-4">
      <header className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Actividades</h1>
          <p className="text-sm text-slate-500">Actividades del viaje.</p>
        </div>

        <Link
          to={`/viajes/${id}/actividades/nueva`}
          className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white"
        >
          Nueva
        </Link>
      </header>

      {loading && <p className="text-sm text-slate-500">Cargando actividades...</p>}
      {error && <p className="text-sm text-red-600">{error}</p>}

      {!loading && !error && (
        <div className="space-y-3">
          {actividades.length === 0 ? (
            <p className="text-sm text-slate-500">Todavía no hay actividades.</p>
          ) : (
            actividades.map((actividad) => (
              <article
                key={actividad.id}
                className="rounded-2xl border border-slate-200 p-4 shadow-sm"
              >
                <h2 className="text-lg font-semibold text-slate-800">
                  {actividad.nombre}
                </h2>

                {actividad.descripcion && (
                  <p className="mt-1 text-sm text-slate-500">
                    {actividad.descripcion}
                  </p>
                )}

                <p className="mt-2 text-sm text-slate-600">
                  {actividad.fechaHoraInicio
                    ? `${actividad.fechaHoraInicio} ${
                        actividad.fechaHoraFin ? `- ${actividad.fechaHoraFin}` : ""
                      }`
                    : "Sin fecha y hora"}
                </p>

                <span className="mt-3 inline-block rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                  {actividad.estado}
                </span>
              </article>
            ))
          )}
        </div>
      )}
    </div>
  );
}