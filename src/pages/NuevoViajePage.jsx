import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const viajeInicial = {
  nombre: "",
  descripcion: "",
  fechaInicio: "",
  fechaFin: "",
  presupuestoEstimado: "",
  notasGenerales: "",
  estado: "PLANIFICADO",
};

export default function NuevoViajePage() {
  const [form, setForm] = useState(viajeInicial);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const navigate = useNavigate();

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
        ...form,
        presupuestoEstimado:
          form.presupuestoEstimado === ""
            ? null
            : Number(form.presupuestoEstimado),
      };

      const response = await api.post("/viajes", payload);
      navigate(`/viajes/${response.data.id}`);
    } catch (err) {
      console.error(err);
      setError("No se ha podido guardar el viaje.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      <header>
        <h1 className="text-2xl font-bold text-slate-900">Nuevo viaje</h1>
        <p className="text-sm text-slate-500">Crea un viaje nuevo.</p>
      </header>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="nombre"
          value={form.nombre}
          onChange={handleChange}
          placeholder="Nombre del viaje"
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

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <input
            type="date"
            name="fechaInicio"
            value={form.fechaInicio}
            onChange={handleChange}
            className="block h-12 w-full min-w-0 appearance-none rounded-xl border border-slate-300 pl-3 py-3 text-sm leading-tight outline-none focus:border-slate-900 sm:px-4"
          />

          <input
            type="date"
            name="fechaFin"
            value={form.fechaFin}
            onChange={handleChange}
            className="block h-12 w-full min-w-0 appearance-none rounded-xl border border-slate-300 pl-3 py-3 text-sm leading-tight outline-none focus:border-slate-900 sm:px-4"
          />
        </div>

        <input
          type="number"
          step="0.01"
          name="presupuestoEstimado"
          value={form.presupuestoEstimado}
          onChange={handleChange}
          placeholder="Presupuesto estimado"
          className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-slate-900"
        />

        <textarea
          name="notasGenerales"
          value={form.notasGenerales}
          onChange={handleChange}
          placeholder="Notas generales"
          rows="4"
          className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-slate-900"
        />

        <select
          name="estado"
          value={form.estado}
          onChange={handleChange}
          className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-slate-900"
        >
          <option value="PLANIFICADO">PLANIFICADO</option>
          <option value="EN_CURSO">EN_CURSO</option>
          <option value="FINALIZADO">FINALIZADO</option>
          <option value="CANCELADO">CANCELADO</option>
        </select>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={saving}
          className="w-full rounded-xl bg-slate-900 px-4 py-3 text-sm font-medium text-white disabled:opacity-50"
        >
          {saving ? "Guardando..." : "Guardar viaje"}
        </button>
      </form>
    </div>
  );
}