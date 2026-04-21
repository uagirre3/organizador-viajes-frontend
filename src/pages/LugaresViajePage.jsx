import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../services/api";

export default function LugaresViajePage() {
  const { id } = useParams();

  const [lugares, setLugares] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargarLugares = async () => {
      try {
        const response = await api.get(`/lugares-interes/viaje/${id}`);
        setLugares(response.data);
      } catch (err) {
        console.error(err);
        setError("No se han podido cargar los lugares.");
      } finally {
        setLoading(false);
      }
    };

    cargarLugares();
  }, [id]);

  return (
    <div className="space-y-4">
      <header className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Lugares</h1>
          <p className="text-sm text-slate-500">Lugares del viaje.</p>
        </div>

        <Link
          to={`/viajes/${id}/lugares/nuevo`}
          className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white"
        >
          Nuevo
        </Link>
      </header>

      {loading && <p className="text-sm text-slate-500">Cargando lugares...</p>}
      {error && <p className="text-sm text-red-600">{error}</p>}

      {!loading && !error && (
        <div className="space-y-3">
          {lugares.length === 0 ? (
            <p className="text-sm text-slate-500">Todavía no hay lugares.</p>
          ) : (
            lugares.map((lugar) => (
              <article
                key={lugar.id}
                className="rounded-2xl border border-slate-200 p-4 shadow-sm"
              >
                <h2 className="text-lg font-semibold text-slate-800">{lugar.nombre}</h2>

                {lugar.descripcion && (
                  <p className="mt-1 text-sm text-slate-500">{lugar.descripcion}</p>
                )}

                <p className="mt-2 text-sm text-slate-600">
                  {lugar.fechaPrevista ? `Previsto: ${lugar.fechaPrevista}` : "Sin fecha prevista"}
                </p>

                <div className="mt-3 flex gap-2">
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                    {lugar.estado}
                  </span>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                    {lugar.prioridad}
                  </span>
                </div>
              </article>
            ))
          )}
        </div>
      )}
    </div>
  );
}