import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../services/api";

export default function TrayectosViajePage() {
  const { id } = useParams();

  const [trayectos, setTrayectos] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargarTrayectos = async () => {
      try {
        const response = await api.get(`/trayectos/viaje/${id}`);
        setTrayectos(response.data);
      } catch (err) {
        console.error(err);
        setError("No se han podido cargar los trayectos.");
      } finally {
        setLoading(false);
      }
    };

    cargarTrayectos();
  }, [id]);

  return (
    <div className="space-y-4">
      <header className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Trayectos</h1>
          <p className="text-sm text-slate-500">Trayectos del viaje.</p>
        </div>

        <Link
          to={`/viajes/${id}/trayectos/nuevo`}
          className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white"
        >
          Nuevo
        </Link>
      </header>

      {loading && <p className="text-sm text-slate-500">Cargando trayectos...</p>}
      {error && <p className="text-sm text-red-600">{error}</p>}

      {!loading && !error && (
        <div className="space-y-3">
          {trayectos.length === 0 ? (
            <p className="text-sm text-slate-500">Todavía no hay trayectos.</p>
          ) : (
            trayectos.map((trayecto) => (
              <article
                key={trayecto.id}
                className="rounded-2xl border border-slate-200 p-4 shadow-sm"
              >
                <h2 className="text-lg font-semibold text-slate-800">
                  {trayecto.tipoTransporte}
                </h2>

                <p className="mt-1 text-sm text-slate-600">
                  {trayecto.ciudadOrigen?.nombre ?? "Origen"} →{" "}
                  {trayecto.ciudadDestino?.nombre ?? "Destino"}
                </p>

                <p className="mt-2 text-sm text-slate-500">
                  {trayecto.fechaHoraSalida}
                  {trayecto.fechaHoraLlegada ? ` - ${trayecto.fechaHoraLlegada}` : ""}
                </p>

                <span className="mt-3 inline-block rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                  {trayecto.estado}
                </span>
              </article>
            ))
          )}
        </div>
      )}
    </div>
  );
}