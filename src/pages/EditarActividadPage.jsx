import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../services/api";

export default function DetalleViajePage() {
  const { id } = useParams();

  const [viaje, setViaje] = useState(null);
  const [estancias, setEstancias] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const [viajeResponse, estanciasResponse] = await Promise.all([
          api.get(`/viajes/${id}`),
          api.get(`/estancias/viaje/${id}`),
        ]);

        setViaje(viajeResponse.data);
        setEstancias(estanciasResponse.data);
      } catch (err) {
        console.error(err);
        setError("No se ha podido cargar el viaje.");
      } finally {
        setLoading(false);
      }
    };

    cargarDatos();
  }, [id]);

  if (loading) {
    return <p className="text-sm text-slate-500">Cargando viaje...</p>;
  }

  if (error) {
    return <p className="text-sm text-red-600">{error}</p>;
  }

  if (!viaje) {
    return <p className="text-sm text-slate-500">No existe el viaje.</p>;
  }

  return (
    <div className="space-y-5">
      <header className="space-y-2">
        <h1 className="text-2xl font-bold text-slate-900">{viaje.nombre}</h1>
        {viaje.descripcion && (
          <p className="text-sm text-slate-500">{viaje.descripcion}</p>
        )}
        <p className="text-sm text-slate-600">
          {viaje.fechaInicio} - {viaje.fechaFin}
        </p>
        <span className="inline-block rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
          {viaje.estado}
        </span>
      </header>

      <section className="grid grid-cols-2 gap-3">
        <Link
          to={`/viajes/${id}/actividades`}
          className="rounded-2xl border border-slate-200 p-4 text-center text-sm font-medium text-slate-800 shadow-sm"
        >
          Actividades
        </Link>

        <Link
          to={`/viajes/${id}/lugares`}
          className="rounded-2xl border border-slate-200 p-4 text-center text-sm font-medium text-slate-800 shadow-sm"
        >
          Lugares
        </Link>

        <Link
          to={`/viajes/${id}/trayectos`}
          className="rounded-2xl border border-slate-200 p-4 text-center text-sm font-medium text-slate-800 shadow-sm"
        >
          Trayectos
        </Link>

        <Link
          to={`/viajes/${id}/estancias/nueva`}
          className="rounded-2xl border border-slate-200 p-4 text-center text-sm font-medium text-slate-800 shadow-sm"
        >
          Añadir estancia
        </Link>
      </section>

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-800">Estancias</h2>
          <Link
            to={`/viajes/${id}/estancias/nueva`}
            className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white"
          >
            Añadir
          </Link>
        </div>

        {estancias.length === 0 ? (
          <p className="text-sm text-slate-500">
            Todavía no hay estancias para este viaje.
          </p>
        ) : (
          <div className="space-y-3">
            {estancias.map((estancia) => (
              <article
                key={estancia.id}
                className="rounded-2xl border border-slate-200 p-4 shadow-sm"
              >
                <h3 className="text-base font-semibold text-slate-800">
                  {estancia.ciudad?.nombre ?? "Ciudad"}
                </h3>
                <p className="mt-1 text-sm text-slate-600">
                  {estancia.fechaLlegada} - {estancia.fechaSalida}
                </p>
                {estancia.notas && (
                  <p className="mt-2 text-sm text-slate-500">{estancia.notas}</p>
                )}
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}