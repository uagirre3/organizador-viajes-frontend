import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../services/api";

function getFechaElemento(item) {
  return (
    item.fecha ||
    item.fechaInicio ||
    item.fechaLlegada ||
    item.fechaSalida ||
    item.fechaHora ||
    ""
  );
}

function mapearEventos(tipo, items) {
  return items.map((item) => ({
    ...item,
    tipo,
    fechaOrdenacion: getFechaElemento(item),
  }));
}

export default function AgendaViajePage() {
  const { id } = useParams();

  const [viaje, setViaje] = useState(null);
  const [actividades, setActividades] = useState([]);
  const [estancias, setEstancias] = useState([]);
  const [trayectos, setTrayectos] = useState([]);
  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) {
      setError("Identificador de viaje no válido.");
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
        setError("No se ha podido cargar la agenda del viaje.");
      } finally {
        setLoading(false);
      }
    };

    cargarDatos();
  }, [id]);

  const eventos = useMemo(() => {
    const combinados = [
      ...mapearEventos("actividad", actividades),
      ...mapearEventos("estancia", estancias),
      ...mapearEventos("trayecto", trayectos),
      ...mapearEventos("reserva", reservas),
    ];

    return combinados.sort((a, b) =>
      (a.fechaOrdenacion || "").localeCompare(b.fechaOrdenacion || "")
    );
  }, [actividades, estancias, trayectos, reservas]);

  if (loading) {
    return <p className="text-sm text-slate-500">Cargando agenda...</p>;
  }

  if (error) {
    return <p className="text-sm text-red-600">{error}</p>;
  }

  return (
    <div className="space-y-5">
      <header className="space-y-2">
        <h1 className="text-2xl font-bold text-slate-900">Agenda del viaje</h1>
        {viaje && (
          <p className="text-sm text-slate-500">
            {viaje.nombre} · {viaje.fechaInicio} - {viaje.fechaFin}
          </p>
        )}
      </header>

      {eventos.length === 0 ? (
        <p className="text-sm text-slate-500">
          No hay elementos en la agenda de este viaje.
        </p>
      ) : (
        <div className="space-y-3">
          {eventos.map((evento) => (
            <article
              key={`${evento.tipo}-${evento.id}`}
              className="rounded-2xl border border-slate-200 p-4 shadow-sm"
            >
              <div className="mb-2 flex items-center justify-between gap-3">
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700 capitalize">
                  {evento.tipo}
                </span>
                <span className="text-sm text-slate-500">
                  {evento.fechaOrdenacion || "Sin fecha"}
                </span>
              </div>

              {evento.tipo === "actividad" && (
                <>
                  <h2 className="text-base font-semibold text-slate-800">
                    {evento.nombre}
                  </h2>
                  {evento.descripcion && (
                    <p className="mt-2 text-sm text-slate-500">
                      {evento.descripcion}
                    </p>
                  )}
                </>
              )}

              {evento.tipo === "estancia" && (
                <>
                  <h2 className="text-base font-semibold text-slate-800">
                    {evento.ciudad?.nombre ?? "Estancia"}
                  </h2>
                  <p className="mt-1 text-sm text-slate-600">
                    {evento.fechaLlegada} - {evento.fechaSalida}
                  </p>
                  {evento.notas && (
                    <p className="mt-2 text-sm text-slate-500">
                      {evento.notas}
                    </p>
                  )}
                </>
              )}

              {evento.tipo === "trayecto" && (
                <>
                  <h2 className="text-base font-semibold text-slate-800">
                    {evento.origen ?? "Origen"} → {evento.destino ?? "Destino"}
                  </h2>
                  {evento.medioTransporte && (
                    <p className="mt-1 text-sm text-slate-600">
                      {evento.medioTransporte}
                    </p>
                  )}
                </>
              )}

              {evento.tipo === "reserva" && (
                <>
                  <h2 className="text-base font-semibold text-slate-800">
                    {evento.nombre ?? evento.tipoReserva ?? "Reserva"}
                  </h2>
                  {evento.localizador && (
                    <p className="mt-1 text-sm text-slate-600">
                      Localizador: {evento.localizador}
                    </p>
                  )}
                </>
              )}
            </article>
          ))}
        </div>
      )}

      <div className="pt-2">
        <Link
          to={`/viajes/${id}`}
          className="text-sm font-medium text-slate-700 underline"
        >
          Volver al viaje
        </Link>
      </div>
    </div>
  );
}