import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";

const estanciaInicial = {
  fechaLlegada: "",
  fechaSalida: "",
  orden: "",
  notas: "",
  ciudadId: "",
};

export default function NuevaEstanciaPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState(estanciaInicial);
  const [ciudades, setCiudades] = useState([]);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const cargarCiudades = async () => {
      try {
        const response = await api.get("/ciudades");
        setCiudades(response.data);
      } catch (err) {
        console.error(err);
        setError("No se han podido cargar las ciudades.");
      }
    };

    cargarCiudades();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSaving(true);

    try {
      const payload = {
        fechaLlegada: form.fechaLlegada,
        fechaSalida: form.fechaSalida,
        orden: Number(form.orden),
        notas: form.notas,
        viaje: { id: Number(id) },
        ciudad: { id: Number(form.ciudadId) },
      };

      await api.post("/estancias", payload);
      navigate(`/viajes/${id}`);
    } catch (err) {
      console.error(err);
      setError("No se ha podido guardar la estancia.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      <header>
        <h1 className="text-2xl font-bold text-slate-900">Nueva estancia</h1>
        <p className="text-sm text-slate-500">Añade una ciudad al viaje.</p>
      </header>

      <form onSubmit={handleSubmit} className="space-y-4">
        <select
          name="ciudadId"
          value={form.ciudadId}
          onChange={handleChange}
          className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-slate-900"
        >
          <option value="">Selecciona una ciudad</option>
          {ciudades.map((ciudad) => (
            <option key={ciudad.id} value={ciudad.id}>
              {ciudad.nombre} ({ciudad.pais})
            </option>
          ))}
        </select>

        <div className="grid grid-cols-2 gap-3">
          <input
            type="date"
            name="fechaLlegada"
            value={form.fechaLlegada}
            onChange={handleChange}
            className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-slate-900"
          />
          <input
            type="date"
            name="fechaSalida"
            value={form.fechaSalida}
            onChange={handleChange}
            className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-slate-900"
          />
        </div>

        <input
          type="number"
          name="orden"
          value={form.orden}
          onChange={handleChange}
          placeholder="Orden"
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
          {saving ? "Guardando..." : "Guardar estancia"}
        </button>
      </form>
    </div>
  );
}