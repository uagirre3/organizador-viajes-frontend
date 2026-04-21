import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import ViajeCard from "../components/ViajeCard";

export default function ViajesPage() {
  const [viajes, setViajes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const cargarViajes = async () => {
      try {
        const response = await api.get("/viajes");
        setViajes(response.data);
      } catch (err) {
        console.error(err);
        setError("No se han podido cargar los viajes.");
      } finally {
        setLoading(false);
      }
    };

    cargarViajes();
  }, []);

  return (
    <div className="space-y-4">
      <header className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Mis viajes</h1>
          <p className="text-sm text-slate-500">
            Consulta y organiza tus viajes.
          </p>
        </div>

        <Link
          to="/viajes/nuevo"
          className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white"
        >
          Nuevo
        </Link>
      </header>

      {loading && <p className="text-sm text-slate-500">Cargando viajes...</p>}
      {error && <p className="text-sm text-red-600">{error}</p>}

      {!loading && !error && (
        <div className="space-y-3">
          {viajes.length === 0 ? (
            <p className="text-sm text-slate-500">
              Todavía no tienes viajes creados.
            </p>
          ) : (
            viajes.map((viaje) => <ViajeCard key={viaje.id} viaje={viaje} />)
          )}
        </div>
      )}
    </div>
  );
}