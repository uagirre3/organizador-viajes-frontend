import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../services/api";

function parseDate(value) {
  if (!value) return null;
  const text = String(value).split("T")[0];
  const [year, month, day] = text.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function formatDateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function addDays(date, amount) {
  const next = new Date(date);
  next.setDate(next.getDate() + amount);
  return next;
}

function getDaysBetween(start, end) {
  const startDate = parseDate(start);
  const endDate = parseDate(end);

  if (!startDate || !endDate || startDate > endDate) return [];

  const days = [];
  let current = new Date(startDate);

  while (current <= endDate) {
    days.push(formatDateKey(current));
    current = addDays(current, 1);
  }

  return days;
}

function formatDayTitle(dateString) {
  const date = parseDate(dateString);
  if (!date) return dateString;

  const formatted = new Intl.DateTimeFormat("es-ES", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);

  return formatted.replace(/\b\p{L}/u, (char) => char.toUpperCase());
}

function formatShortDateES(value) {
  const date = parseDate(value);
  if (!date) return value || "";

  return new Intl.DateTimeFormat("es-ES", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

function formatDateRangeES(start, end) {
  if (!start && !end) return "";

  const inicio = formatShortDateES(start);
  const fin = formatShortDateES(end);

  if (inicio && fin) return `${inicio} - ${fin}`;
  return inicio || fin;
}

function getOnlyDate(value) {
  if (!value) return "";
  return String(value).split("T")[0];
}

function extractHour(value) {
  if (!value) return "";

  const text = String(value);

  if (text.includes("T")) {
    return text.split("T")[1]?.slice(0, 5) ?? "";
  }

  return text.length >= 5 ? text.slice(0, 5) : text;
}

function getHour(item) {
  return (
    extractHour(item.hora) ||
    extractHour(item.horaInicio) ||
    extractHour(item.horaSalida) ||
    extractHour(item.horaLlegada) ||
    extractHour(item.fecha) ||
    extractHour(item.fechaInicio) ||
    extractHour(item.fechaFin) ||
    extractHour(item.fechaSalida) ||
    extractHour(item.fechaLlegada) ||
    extractHour(item.fechaHoraInicio) ||
    extractHour(item.fechaHoraFin) ||
    ""
  );
}

function getSortHour(item) {
  return getHour(item) || "99:99";
}

function compareByHour(a, b) {
  return getSortHour(a).localeCompare(getSortHour(b));
}

function buildDayData(day, estancias, trayectos, actividades, reservas) {
  const estanciasDia = [];

  estancias.forEach((item) => {
    const ciudad = item.ciudad?.nombre ?? "Ciudad";
    const alojamiento =
      item.alojamiento?.nombre ?? item.nombreAlojamiento ?? "";

    if (getOnlyDate(item.fechaLlegada) === day) {
      estanciasDia.push({
        id: `entrada-${item.id}`,
        hora:
          extractHour(item.horaLlegada) ||
          extractHour(item.horaEntrada) ||
          extractHour(item.fechaLlegada) ||
          "",
        titulo: `Llegada a ${ciudad}`,
        detalle: alojamiento
          ? `Entrada en ${alojamiento}`
          : `Inicio de estancia hasta ${formatShortDateES(item.fechaSalida)}`,
      });
    }

    if (getOnlyDate(item.fechaSalida) === day) {
      estanciasDia.push({
        id: `salida-${item.id}`,
        hora:
          extractHour(item.horaSalida) || extractHour(item.fechaSalida) || "",
        titulo: `Salida de ${ciudad}`,
        detalle: alojamiento ? `Salida de ${alojamiento}` : "Fin de estancia",
      });
    }
  });

  const trayectosDia = trayectos
    .filter(
      (item) =>
        getOnlyDate(item.fecha) === day ||
        getOnlyDate(item.fechaSalida) === day ||
        getOnlyDate(item.fechaLlegada) === day ||
        getOnlyDate(item.fechaHoraSalida) === day ||
        getOnlyDate(item.fechaHoraLlegada) === day,
    )
    .map((item) => ({
      id: item.id,
      hora:
        extractHour(item.fechaHoraSalida) ||
        extractHour(item.fechaSalida) ||
        getHour(item),
      titulo: `${item.origen ?? "Origen"} → ${item.destino ?? "Destino"}`,
      detalle:
        [
          item.medioTransporte || item.tipoTransporte || "",
          item.fechaHoraSalida && item.fechaHoraLlegada
            ? `${extractHour(item.fechaHoraSalida)} - ${extractHour(item.fechaHoraLlegada)}`
            : "",
        ]
          .filter(Boolean)
          .join(" · ") || "",
      raw: item,
    }))
    .sort(compareByHour);

  const actividadesDia = actividades
    .filter(
      (item) =>
        getOnlyDate(item.fecha) === day ||
        getOnlyDate(item.fechaInicio) === day ||
        getOnlyDate(item.fechaFin) === day ||
        getOnlyDate(item.fechaHoraInicio) === day ||
        getOnlyDate(item.fechaHoraFin) === day,
    )
    .map((item) => ({
      id: item.id,
      hora:
        extractHour(item.fechaHoraInicio) ||
        extractHour(item.fechaInicio) ||
        getHour(item),
      titulo: item.nombre || "Actividad",
      detalle: [
        item.fechaHoraInicio && item.fechaHoraFin
          ? `${extractHour(item.fechaHoraInicio)} - ${extractHour(item.fechaHoraFin)}`
          : "",
        item.descripcion || "",
      ]
        .filter(Boolean)
        .join(" · "),
      raw: item,
    }))
    .sort(compareByHour);

  const reservasDia = reservas
    .filter(
      (item) =>
        getOnlyDate(item.fecha) === day ||
        getOnlyDate(item.fechaReserva) === day ||
        getOnlyDate(item.fechaInicio) === day ||
        getOnlyDate(item.fechaFin) === day ||
        getOnlyDate(item.fechaHoraInicio) === day ||
        getOnlyDate(item.fechaHoraFin) === day,
    )
    .map((item) => ({
      id: item.id,
      hora:
        extractHour(item.fechaHoraInicio) ||
        extractHour(item.fechaInicio) ||
        getHour(item),
      titulo: item.nombre || item.tipoReserva || "Reserva",
      detalle: [
        item.fechaHoraInicio && item.fechaHoraFin
          ? `${extractHour(item.fechaHoraInicio)} - ${extractHour(item.fechaHoraFin)}`
          : "",
        item.localizador ? `Localizador: ${item.localizador}` : "",
      ]
        .filter(Boolean)
        .join(" · "),
      raw: item,
    }))
    .sort(compareByHour);

  estanciasDia.sort(compareByHour);

  return {
    fecha: day,
    estancias: estanciasDia,
    trayectos: trayectosDia,
    actividades: actividadesDia,
    reservas: reservasDia,
  };
}

function ItemLinea({ hora, titulo, detalle, colorClass = "bg-slate-100" }) {
  return (
    <div className="flex gap-3 rounded-2xl border border-slate-100 bg-white p-3 shadow-sm">
      <div className="w-16 shrink-0 text-sm font-semibold text-slate-500">
        {hora || "—"}
      </div>

      <div className="flex min-w-0 items-start gap-3">
        <div className={`mt-1 h-3 w-3 rounded-full ${colorClass}`} />
        <div className="min-w-0">
          <p className="text-sm font-semibold text-slate-800">{titulo}</p>
          {detalle && <p className="mt-1 text-sm text-slate-500">{detalle}</p>}
        </div>
      </div>
    </div>
  );
}

function BloqueDia({ titulo, icono, items, colorClass }) {
  if (!items.length) return null;

  return (
    <section className="space-y-3">
      <div className="flex items-center gap-2">
        <span className="text-base">{icono}</span>
        <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
          {titulo}
        </h3>
      </div>

      <div className="space-y-2">
        {items.map((item) => (
          <ItemLinea
            key={item.id}
            hora={item.hora}
            titulo={item.titulo}
            detalle={item.detalle}
            colorClass={colorClass}
          />
        ))}
      </div>
    </section>
  );
}

export default function ResumenViajePage() {
  const { id } = useParams();

  const [viaje, setViaje] = useState(null);
  const [estancias, setEstancias] = useState([]);
  const [actividades, setActividades] = useState([]);
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
          estanciasResponse,
          actividadesResponse,
          trayectosResponse,
          reservasResponse,
        ] = await Promise.all([
          api.get(`/viajes/${id}`),
          api.get(`/estancias/viaje/${id}`).catch(() => ({ data: [] })),
          api.get(`/actividades/viaje/${id}`).catch(() => ({ data: [] })),
          api.get(`/trayectos/viaje/${id}`).catch(() => ({ data: [] })),
          api.get(`/reservas/viaje/${id}`).catch(() => ({ data: [] })),
        ]);

        setViaje(viajeResponse.data);
        setEstancias(estanciasResponse.data ?? []);
        setActividades(actividadesResponse.data ?? []);
        setTrayectos(trayectosResponse.data ?? []);
        setReservas(reservasResponse.data ?? []);
      } catch (err) {
        console.error(err);
        setError("No se ha podido cargar el resumen del viaje.");
      } finally {
        setLoading(false);
      }
    };

    cargarDatos();
  }, [id]);

  const dias = useMemo(() => {
    if (!viaje?.fechaInicio || !viaje?.fechaFin) return [];
    return getDaysBetween(viaje.fechaInicio, viaje.fechaFin);
  }, [viaje]);

  const resumenDias = useMemo(() => {
    return dias.map((day) =>
      buildDayData(day, estancias, trayectos, actividades, reservas),
    );
  }, [dias, estancias, trayectos, actividades, reservas]);

  if (loading) {
    return <p className="text-sm text-slate-500">Cargando resumen...</p>;
  }

  if (error) {
    return <p className="text-sm text-red-600">{error}</p>;
  }

  if (!viaje) {
    return <p className="text-sm text-slate-500">No existe el viaje.</p>;
  }

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-bold text-slate-900">
          Itinerario del viaje
        </h1>
        <p className="text-sm text-slate-500">
          {viaje.nombre} ·{" "}
          {formatDateRangeES(viaje.fechaInicio, viaje.fechaFin)}
        </p>
      </header>

      <div className="space-y-5">
        {resumenDias.map((dia, index) => {
          const tieneContenido =
            dia.estancias.length > 0 ||
            dia.trayectos.length > 0 ||
            dia.actividades.length > 0 ||
            dia.reservas.length > 0;

          return (
            <article
              key={dia.fecha}
              className="rounded-3xl border border-slate-200 bg-slate-50 p-5 shadow-sm"
            >
              <div className="mb-5">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                  Día {index + 1}
                </p>
                <p className="mt-1 text-sm text-slate-500">
                  {formatDayTitle(dia.fecha)}
                </p>
              </div>

              {tieneContenido ? (
                <div className="space-y-5">
                  <BloqueDia
                    titulo="Estancia"
                    icono="🏨"
                    items={dia.estancias}
                    colorClass="bg-purple-400"
                  />

                  <BloqueDia
                    titulo="Trayectos"
                    icono="🚆"
                    items={dia.trayectos}
                    colorClass="bg-emerald-400"
                  />

                  <BloqueDia
                    titulo="Actividades"
                    icono="🎯"
                    items={dia.actividades}
                    colorClass="bg-blue-400"
                  />

                  <BloqueDia
                    titulo="Reservas"
                    icono="🎟️"
                    items={dia.reservas}
                    colorClass="bg-amber-400"
                  />
                </div>
              ) : (
                <div className="rounded-2xl border border-dashed border-slate-200 bg-white px-4 py-5">
                  <p className="text-sm text-slate-500">
                    Día libre o sin planificación añadida.
                  </p>
                </div>
              )}
            </article>
          );
        })}
      </div>

      <Link
        to={`/viajes/${id}`}
        className="inline-block text-sm font-medium text-slate-700 underline"
      >
        Volver al viaje
      </Link>
    </div>
  );
}
