import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../services/api";

export default function DetalleReservaPage() {
  const { reservaId } = useParams();

  const [reserva, setReserva] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!reservaId) {
      setError("Identificador de reserva no válido.");
      setLoading(false);
      return;
    }

    const cargarReserva = async () => {
      try {
        const response = await api.get(`/reservas/${reservaId}`);
        setReserva(response.data);
      } catch (err) {
        console.error(err);
        setError("No se ha podido cargar la reserva.");
      } finally {
        setLoading(false);
      }
    };

    cargarReserva();
  }, [reservaId]);

  if (loading) {
    return <p className="text-sm text-slate-500">Cargando reserva...</p>;
  }

  if (error) {
    return <p className="text-sm text-red-600">{error}</p>;
  }

  if (!reserva) {
    return <p className="text-sm text-slate-500">No existe la reserva.</p>;
  }

  return (
    <div className="space-y-5">
      <header className="space-y-2">
        <h1 className="text-2xl font-bold text-slate-900">
          {reserva.nombre ?? "Detalle de reserva"}
        </h1>
        {reserva.tipoReserva && (
          <p className="text-sm text-slate-500">{reserva.tipoReserva}</p>
        )}
      </header>

      <section className="rounded-2xl border border-slate-200 p-4 shadow-sm">
        <div className="space-y-2 text-sm text-slate-600">
          {reserva.localizador && (
            <p>
              <span className="font-medium">Localizador:</span>{" "}
              {reserva.localizador}
            </p>
          )}
          {reserva.fecha && (
            <p>
              <span className="font-medium">Fecha:</span> {reserva.fecha}
            </p>
          )}
          {reserva.proveedor && (
            <p>
              <span className="font-medium">Proveedor:</span>{" "}
              {reserva.proveedor}
            </p>
          )}
          {reserva.importe && (
            <p>
              <span className="font-medium">Importe:</span> {reserva.importe}
            </p>
          )}
          {reserva.notas && (
            <p>
              <span className="font-medium">Notas:</span> {reserva.notas}
            </p>
          )}
        </div>
      </section>

      <Link
        to="/reservas"
        className="text-sm font-medium text-slate-700 underline"
      >
        Volver a reservas
      </Link>
    </div>
  );
}