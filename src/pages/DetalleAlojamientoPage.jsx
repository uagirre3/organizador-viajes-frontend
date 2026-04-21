import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../services/api";

export default function DetalleAlojamientoPage() {
  const { alojamientoId } = useParams();

  const [alojamiento, setAlojamiento] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!alojamientoId) {
      setError("Identificador de alojamiento no válido.");
      setLoading(false);
      return;
    }

    const cargarAlojamiento = async () => {
      try {
        const response = await api.get(`/alojamientos/${alojamientoId}`);
        setAlojamiento(response.data);
      } catch (err) {
        console.error(err);
        setError("No se ha podido cargar el alojamiento.");
      } finally {
        setLoading(false);
      }
    };

    cargarAlojamiento();
  }, [alojamientoId]);

  if (loading) {
    return <p className="text-sm text-slate-500">Cargando alojamiento...</p>;
  }

  if (error) {
    return <p className="text-sm text-red-600">{error}</p>;
  }

  if (!alojamiento) {
    return <p className="text-sm text-slate-500">No existe el alojamiento.</p>;
  }

  return (
    <div className="space-y-5">
      <header className="space-y-2">
        <h1 className="text-2xl font-bold text-slate-900">
          {alojamiento.nombre}
        </h1>
        {alojamiento.direccion && (
          <p className="text-sm text-slate-500">{alojamiento.direccion}</p>
        )}
      </header>

      <section className="rounded-2xl border border-slate-200 p-4 shadow-sm">
        <div className="space-y-2 text-sm text-slate-600">
          {alojamiento.ciudad?.nombre && (
            <p>
              <span className="font-medium">Ciudad:</span>{" "}
              {alojamiento.ciudad.nombre}
            </p>
          )}
          {alojamiento.fechaEntrada && (
            <p>
              <span className="font-medium">Entrada:</span>{" "}
              {alojamiento.fechaEntrada}
            </p>
          )}
          {alojamiento.fechaSalida && (
            <p>
              <span className="font-medium">Salida:</span>{" "}
              {alojamiento.fechaSalida}
            </p>
          )}
          {alojamiento.notas && (
            <p>
              <span className="font-medium">Notas:</span> {alojamiento.notas}
            </p>
          )}
        </div>
      </section>

      <Link
        to="/alojamientos"
        className="text-sm font-medium text-slate-700 underline"
      >
        Volver a alojamientos
      </Link>
    </div>
  );
}