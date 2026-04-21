import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";

const actividadInicial = {
  nombre: "",
  descripcion: "",
  fechaHoraInicio: "",
  fechaHoraFin: "",
  localizador: "",
  enlaceReserva: "",
  precioPagado: "",
  estado: "PLANIFICADA",
  notas: "",
  estanciaId: "",
  lugarInteresId: "",
};

export default function NuevaActividadPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState(actividadInicial);
  const [estancias, setEstancias] = useState([]);
  const [lugares, setLugares] = useState([]);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const [estanciasResponse, lugaresResponse] = await Promise.all([
          api.get(`/estancias/viaje/${id}`),
          api.get(`/lugares-interes/viaje/${id}`),
        ]);

        setEstancias(estanciasResponse.data);
        setLugares(lugaresResponse.data);
      } catch (err) {
        console.error(err);
        setError("No se han podido cargar los datos necesarios.");
      }
    };

    cargarDatos();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      const payload = {
        nombre: form.nombre,
        descripcion: form.descripcion || null,
        fechaHoraInicio: form.fechaHoraInicio || null,
        fechaHoraFin: form.fechaHoraFin || null,
        localizador: form.localizador || null,
        enlaceReserva: form.enlaceReserva || null,
        precioPagado: form.precioPagado === "" ? null : Number(form.precioPagado),
        estado: form.estado,
        notas: form.notas || null,
        estancia: { id: Number(form.estanciaId) },
        lugarInteres:
          form.lugarInteresId === ""
            ? null
            : { id: Number(form.lugarInteresId) },
      };

      await api.post("/actividades", payload);
      navigate(`/viajes/${id}/actividades`);
    } catch (err) {
      console.error(err);
      setError("No se ha podido guardar la actividad.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      <header>
        <h1 className="text-2xl font-bold text-slate-900">Nueva actividad</h1>
        <p className="text-sm text-slate-500">Añade una actividad al viaje.</p>
      </header>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="nombre"
          value={form.nombre}
          onChange={handleChange}
          placeholder="Nombre"
          className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-slate-900"
        />

        <textarea
          name="descripcion"
          value={form.descripcion}
          onChange={handleChange}
          placeholder="Descripción"
          rows="3"
          className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-slate-900"
        />

        <select
          name="estanciaId"
          value={form.estanciaId}
          onChange={handleChange}
          className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-slate-900"
        >
          <option value="">Selecciona una estancia</option>
          {estancias.map((estancia) => (
            <option key={estancia.id} value={estancia.id}>
              {estancia.ciudad?.nombre} ({estancia.fechaLlegada} - {estancia.fechaSalida})
            </option>
          ))}
        </select>

        <select
          name="lugarInteresId"
          value={form.lugarInteresId}
          onChange={handleChange}
          className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-slate-900"
        >
          <option value="">Sin lugar asociado</option>
          {lugares.map((lugar) => (
            <option key={lugar.id} value={lugar.id}>
              {lugar.nombre}
            </option>
          ))}
        </select>

        <div className="grid grid-cols-1 gap-3">
          <input
            type="datetime-local"
            name="fechaHoraInicio"
            value={form.fechaHoraInicio}
            onChange={handleChange}
            className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-slate-900"
          />
          <input
            type="datetime-local"
            name="fechaHoraFin"
            value={form.fechaHoraFin}
            onChange={handleChange}
            className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-slate-900"
          />
        </div>

        <input
          name="localizador"
          value={form.localizador}
          onChange={handleChange}
          placeholder="Localizador"
          className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-slate-900"
        />

        <input
          name="enlaceReserva"
          value={form.enlaceReserva}
          onChange={handleChange}
          placeholder="Enlace de reserva"
          className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-slate-900"
        />

        <input
          type="number"
          step="0.01"
          name="precioPagado"
          value={form.precioPagado}
          onChange={handleChange}
          placeholder="Precio pagado"
          className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-slate-900"
        />

        <select
          name="estado"
          value={form.estado}
          onChange={handleChange}
          className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-slate-900"
        >
          <option value="PENDIENTE">PENDIENTE</option>
          <option value="PLANIFICADA">PLANIFICADA</option>
          <option value="REALIZADA">REALIZADA</option>
          <option value="CANCELADA">CANCELADA</option>
        </select>

        <textarea
          name="notas"
          value={form.notas}
          onChange={handleChange}
          placeholder="Notas"
          rows="4"
          className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-slate-900"
        />

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={saving}
          className="w-full rounded-xl bg-slate-900 px-4 py-3 text-sm font-medium text-white disabled:opacity-50"
        >
          {saving ? "Guardando..." : "Guardar actividad"}
        </button>
      </form>
    </div>
  );
}