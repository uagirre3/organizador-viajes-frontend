import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";

const lugarInicial = {
  nombre: "",
  descripcion: "",
  direccion: "",
  tipoLugar: "",
  fechaPrevista: "",
  prioridad: "MEDIA",
  estado: "PENDIENTE",
  precioEstimado: "",
  enlaceInformacion: "",
  notas: "",
  estanciaId: "",
};

export default function NuevoLugarPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState(lugarInicial);
  const [estancias, setEstancias] = useState([]);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const cargarEstancias = async () => {
      try {
        const response = await api.get(`/estancias/viaje/${id}`);
        setEstancias(response.data);
      } catch (err) {
        console.error(err);
        setError("No se han podido cargar las estancias.");
      }
    };

    cargarEstancias();
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
        direccion: form.direccion || null,
        tipoLugar: form.tipoLugar || null,
        fechaPrevista: form.fechaPrevista || null,
        prioridad: form.prioridad,
        estado: form.estado,
        precioEstimado:
          form.precioEstimado === "" ? null : Number(form.precioEstimado),
        enlaceInformacion: form.enlaceInformacion || null,
        notas: form.notas || null,
        estancia: { id: Number(form.estanciaId) },
      };

      await api.post("/lugares-interes", payload);
      navigate(`/viajes/${id}/lugares`);
    } catch (err) {
      console.error(err);
      setError("No se ha podido guardar el lugar.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      <header>
        <h1 className="text-2xl font-bold text-slate-900">Nuevo lugar</h1>
        <p className="text-sm text-slate-500">Añade un lugar al viaje.</p>
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

        <input
          name="direccion"
          value={form.direccion}
          onChange={handleChange}
          placeholder="Dirección"
          className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-slate-900"
        />

        <input
          name="tipoLugar"
          value={form.tipoLugar}
          onChange={handleChange}
          placeholder="Tipo de lugar"
          className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-slate-900"
        />

        <input
          type="date"
          name="fechaPrevista"
          value={form.fechaPrevista}
          onChange={handleChange}
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

        <div className="grid grid-cols-2 gap-3">
          <select
            name="prioridad"
            value={form.prioridad}
            onChange={handleChange}
            className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-slate-900"
          >
            <option value="BAJA">BAJA</option>
            <option value="MEDIA">MEDIA</option>
            <option value="ALTA">ALTA</option>
          </select>

          <select
            name="estado"
            value={form.estado}
            onChange={handleChange}
            className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-slate-900"
          >
            <option value="PENDIENTE">PENDIENTE</option>
            <option value="PLANIFICADO">PLANIFICADO</option>
            <option value="VISITADO">VISITADO</option>
            <option value="CANCELADO">CANCELADO</option>
          </select>
        </div>

        <input
          type="number"
          step="0.01"
          name="precioEstimado"
          value={form.precioEstimado}
          onChange={handleChange}
          placeholder="Precio estimado"
          className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-slate-900"
        />

        <input
          name="enlaceInformacion"
          value={form.enlaceInformacion}
          onChange={handleChange}
          placeholder="Enlace de información"
          className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-slate-900"
        />

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
          {saving ? "Guardando..." : "Guardar lugar"}
        </button>
      </form>
    </div>
  );
}