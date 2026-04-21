import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../services/api";

export default function DiaViajePage() {
  const { id, fecha } = useParams();

  const [viaje, setViaje] = useState(null);
  const [actividades, setActividades] = useState([]);
  const [estancias, setEstancias] = useState([]);
  const [trayectos, setTrayectos] = useState([]);
  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id || !fecha) {
      setError("Parámetros no válidos.");
      setLoading(false);
      return;
    }

    const cargarDatos = async () => {
      try {
        const [
          viajeResponse,
          actividadesResponse,
          estanciasResponse,
          trayectosResponse,
          reservasResponse,
        ] = await Promise.all([
          api.get(`/viajes/${id}`),
          api.get(`/actividades/viaje/${id}`).catch(() => ({ data: [] })),
          api.get(`/estancias/viaje/${id}`).catch(() => ({ data: [] })),
          api.get(`/trayectos/viaje/${id}`).catch(() => ({ data: [] })),
          api.get(`/reservas/viaje/${id}`).catch(() => ({ data: [] })),
        ]);

        setViaje(viajeResponse.data);
        setActividades(actividadesResponse.data ?? []);
        setEstancias(estanciasResponse.data ?? []);
        setTrayectos(trayectosResponse.data ?? []);
        setReservas(reservasResponse.data ?? []);
      } catch (err) {
        console.error(err);
        setError("No se ha podido cargar el día del viaje.");
      } finally {
        setLoading(false);
      }
    };

    cargarDatos();
  }, [id, fecha]);

  const actividadesDia = useMemo(
    () => actividades.filter((item) => item.fecha === fecha),
    [actividades, fecha]
  );

  const estanciasDia = useMemo(
    () =>
      estancias.filter(
        (item) => item.fechaLlegada === fecha || item.fechaSalida === fecha
      ),
    [estancias, fecha]
  );

  const trayectosDia = useMemo(
    () =>
      trayectos.filter(
        (item) =>
          item.fecha === fecha ||
          item.fechaSalida === fecha ||
          item.fechaLlegada === fecha
      ),
    [trayectos, fecha]
  );

  const reservasDia = useMemo(
    () =>
      reservas.filter(
        (item) =>
          item.fecha === fecha ||
          item.fechaReserva === fecha ||
          item.fechaInicio === fecha
      ),
    [reservas, fecha]
  );

  if (loading) {
    return <p className="text-sm text-slate-500">Cargando día...</p>;
  }

  if (error) {
    return <p className="text-sm text-red-600">{error}</p>;
  }

  return (
    <div className="space-y-5">
      <header className="space-y-2">
        <h1 className="text-2xl font-bold text-slate-900">Día del viaje</h1>
        <p className="text-sm text-slate-500">
          {viaje?.nombre} · {fecha}
        </p>
      </header>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-slate-800">Actividades</h2>
        {actividadesDia.length === 0 ? (
          <p className="text-sm text-slate-500">No hay actividades.</p>
        ) : (
          actividadesDia.map((item) => (
            <article
              key={item.id}
              className="rounded-2xl border border-slate-200 p-4 shadow-sm"
            >
              <h3 className="font-semibold text-slate-800">{item.nombre}</h3>
              {item.descripcion && (
                <p className="mt-2 text-sm text-slate-500">{item.descripcion}</p>
              )}
            </article>
          ))
        )}
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-slate-800">Estancias</h2>
        {estanciasDia.length === 0 ? (
          <p className="text-sm text-slate-500">No hay estancias.</p>
        ) : (
          estanciasDia.map((item) => (
            <article
              key={item.id}
              className="rounded-2xl border border-slate-200 p-4 shadow-sm"
            >
              <h3 className="font-semibold text-slate-800">
                {item.ciudad?.nombre ?? "Estancia"}
              </h3>
              <p className="mt-1 text-sm text-slate-600">
                {item.fechaLlegada} - {item.fechaSalida}
              </p>
            </article>
          ))
        )}
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-slate-800">Trayectos</h2>
        {trayectosDia.length === 0 ? (
          <p className="text-sm text-slate-500">No hay trayectos.</p>
        ) : (
          trayectosDia.map((item) => (
            <article
              key={item.id}
              className="rounded-2xl border border-slate-200 p-4 shadow-sm"
            >
              <h3 className="font-semibold text-slate-800">
                {item.origen ?? "Origen"} → {item.destino ?? "Destino"}
              </h3>
              {item.medioTransporte && (
                <p className="mt-1 text-sm text-slate-600">
                  {item.medioTransporte}
                </p>
              )}
            </article>
          ))
        )}
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-slate-800">Reservas</h2>
        {reservasDia.length === 0 ? (
          <p className="text-sm text-slate-500">No hay reservas.</p>
        ) : (
          reservasDia.map((item) => (
            <article
              key={item.id}
              className="rounded-2xl border border-slate-200 p-4 shadow-sm"
            >
              <h3 className="font-semibold text-slate-800">
                {item.nombre ?? item.tipoReserva ?? "Reserva"}
              </h3>
              {item.localizador && (
                <p className="mt-1 text-sm text-slate-600">
                  Localizador: {item.localizador}
                </p>
              )}
            </article>
          ))
        )}
      </section>

      <Link
        to={`/viajes/${id}/agenda`}
        className="text-sm font-medium text-slate-700 underline"
      >
        Volver a la agenda
      </Link>
    </div>
  );
}