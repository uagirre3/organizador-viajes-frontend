import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";

const trayectoInicial = {
  tipoTransporte: "",
  fechaHoraSalida: "",
  fechaHoraLlegada: "",
  lugarSalida: "",
  lugarLlegada: "",
  localizador: "",
  enlaceReserva: "",
  precio: "",
  asiento: "",
  terminal: "",
  puerta: "",
  equipaje: "",
  notas: "",
  estado: "PENDIENTE",
  ciudadOrigenId: "",
  ciudadDestinoId: "",
};

export default function NuevoTrayectoPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState(trayectoInicial);
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
    setSaving(true);
    setError("");

    try {
      const payload = {
        tipoTransporte: form.tipoTransporte,
        fechaHoraSalida: form.fechaHoraSalida || null,
        fechaHoraLlegada: form.fechaHoraLlegada || null,
        lugarSalida: form.lugarSalida || null,
        lugarLlegada: form.lugarLlegada || null,
        localizador: form.localizador || null,
        enlaceReserva: form.enlaceReserva || null,
        precio: form.precio === "" ? null : Number(form.precio),
        asiento: form.asiento || null,
        terminal: form.terminal || null,
        puerta: form.puerta || null,
        equipaje: form.equipaje || null,
        notas: form.notas || null,
        estado: form.estado,
        viaje: { id: Number(id) },
        ciudadOrigen:
          form.ciudadOrigenId === "" ? null : { id: Number(form.ciudadOrigenId) },
        ciudadDestino:
          form.ciudadDestinoId === "" ? null : { id: Number(form.ciudadDestinoId) },
      };

      await api.post("/trayectos", payload);
      navigate(`/viajes/${id}/trayectos`);
    } catch (err) {
      console.error(err);
      setError("No se ha podido guardar el trayecto.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      <header>
        <h1 className="text-2xl font-bold text-slate-900">Nuevo trayecto</h1>
        <p className="text-sm text-slate-500">Añade un trayecto al viaje.</p>
      </header>

      <form onSubmit={handleSubmit} className="space-y-4">
        <select
          name="tipoTransporte"
          value={form.tipoTransporte}
          onChange={handleChange}
          className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-slate-900"
        >
          <option value="">Selecciona tipo</option>
          <option value="AVION">AVION</option>
          <option value="TREN">TREN</option>
          <option value="BUS">BUS</option>
          <option value="FERRY">FERRY</option>
          <option value="COCHE">COCHE</option>
          <option value="METRO">METRO</option>
          <option value="TAXI">TAXI</option>
          <option value="OTRO">OTRO</option>
        </select>

        <div className="grid grid-cols-1 gap-3">
          <input
            type="datetime-local"
            name="fechaHoraSalida"
            value={form.fechaHoraSalida}
            onChange={handleChange}
            className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-slate-900"
          />
          <input
            type="datetime-local"
            name="fechaHoraLlegada"
            value={form.fechaHoraLlegada}
            onChange={handleChange}
            className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-slate-900"
          />
        </div>

        <input
          name="lugarSalida"
          value={form.lugarSalida}
          onChange={handleChange}
          placeholder="Lugar de salida"
          className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-slate-900"
        />

        <input
          name="lugarLlegada"
          value={form.lugarLlegada}
          onChange={handleChange}
          placeholder="Lugar de llegada"
          className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-slate-900"
        />

        <div className="grid grid-cols-2 gap-3">
          <select
            name="ciudadOrigenId"
            value={form.ciudadOrigenId}
            onChange={handleChange}
            className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-slate-900"
          >
            <option value="">Ciudad origen</option>
            {ciudades.map((ciudad) => (
              <option key={ciudad.id} value={ciudad.id}>
                {ciudad.nombre}
              </option>
            ))}
          </select>

          <select
            name="ciudadDestinoId"
            value={form.ciudadDestinoId}
            onChange={handleChange}
            className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-slate-900"
          >
            <option value="">Ciudad destino</option>
            {ciudades.map((ciudad) => (
              <option key={ciudad.id} value={ciudad.id}>
                {ciudad.nombre}
              </option>
            ))}
          </select>
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
          name="precio"
          value={form.precio}
          onChange={handleChange}
          placeholder="Precio"
          className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-slate-900"
        />

        <input
          name="asiento"
          value={form.asiento}
          onChange={handleChange}
          placeholder="Asiento"
          className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-slate-900"
        />

        <input
          name="terminal"
          value={form.terminal}
          onChange={handleChange}
          placeholder="Terminal"
          className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-slate-900"
        />

        <input
          name="puerta"
          value={form.puerta}
          onChange={handleChange}
          placeholder="Puerta"
          className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-slate-900"
        />

        <input
          name="equipaje"
          value={form.equipaje}
          onChange={handleChange}
          placeholder="Equipaje"
          className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-slate-900"
        />

        <select
          name="estado"
          value={form.estado}
          onChange={handleChange}
          className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-slate-900"
        >
          <option value="PENDIENTE">PENDIENTE</option>
          <option value="RESERVADA">RESERVADA</option>
          <option value="CONFIRMADA">CONFIRMADA</option>
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
          {saving ? "Guardando..." : "Guardar trayecto"}
        </button>
      </form>
    </div>
  );
}