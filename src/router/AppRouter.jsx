import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";

import AppLayout from "../layouts/AppLayout";
import ViajesPage from "../pages/ViajesPage";
import NuevoViajePage from "../pages/NuevoViajePage";
import DetalleViajePage from "../pages/DetalleViajePage";
import NuevaEstanciaPage from "../pages/NuevaEstanciaPage";
import ActividadesViajePage from "../pages/ActividadesViajePage";
import NuevaActividadPage from "../pages/NuevaActividadPage";
import LugaresViajePage from "../pages/LugaresViajePage";
import NuevoLugarPage from "../pages/NuevoLugarPage";
import TrayectosViajePage from "../pages/TrayectosViajePage";
import NuevoTrayectoPage from "../pages/NuevoTrayectoPage";
import EditarViajePage from "../pages/EditarViajePage";
import EditarEstanciaPage from "../pages/EditarEstanciaPage";
import EditarActividadPage from "../pages/EditarActividadPage";
import EditarLugarPage from "../pages/EditarLugarPage";
import EditarTrayectoPage from "../pages/EditarTrayectoPage";
import AlojamientosPage from "../pages/AlojamientosPage";
import NuevoAlojamientoPage from "../pages/NuevoAlojamientoPage";
import ReservasPage from "../pages/ReservasPage";
import NuevaReservaPage from "../pages/NuevaReservaPage";
import AgendaViajePage from "../pages/AgendaViajePage";
import ResumenViajePage from "../pages/ResumenViajePage";
import DiaViajePage from "../pages/DiaViajePage";
import DetalleAlojamientoPage from "../pages/DetalleAlojamientoPage";
import DetalleReservaPage from "../pages/DetalleReservaPage";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>

          {/* 🔹 Redirect inicial */}
          <Route path="/" element={<Navigate to="/viajes" />} />

          {/* 🔹 VIAJES */}
          <Route path="/viajes" element={<ViajesPage />} />
          <Route path="/viajes/nuevo" element={<NuevoViajePage />} />
          <Route path="/viajes/:id" element={<DetalleViajePage />} />
          <Route path="/viajes/:id/editar" element={<EditarViajePage />} />
          <Route path="/viajes/:id/agenda" element={<AgendaViajePage />} />
          <Route path="/viajes/:id/resumen" element={<ResumenViajePage />} />
          <Route path="/viajes/:id/dias/:fecha" element={<DiaViajePage />} />

          {/* 🔹 ESTANCIAS */}
          <Route path="/viajes/:id/estancias/nueva" element={<NuevaEstanciaPage />} />
          <Route path="/viajes/:id/estancias/:estanciaId/editar" element={<EditarEstanciaPage />} />

          {/* 🔹 ACTIVIDADES */}
          <Route path="/viajes/:id/actividades" element={<ActividadesViajePage />} />
          <Route path="/viajes/:id/actividades/nueva" element={<NuevaActividadPage />} />
          <Route path="/viajes/:id/actividades/:actividadId/editar" element={<EditarActividadPage />} />

          {/* 🔹 LUGARES */}
          <Route path="/viajes/:id/lugares" element={<LugaresViajePage />} />
          <Route path="/viajes/:id/lugares/nuevo" element={<NuevoLugarPage />} />
          <Route path="/viajes/:id/lugares/:lugarId/editar" element={<EditarLugarPage />} />

          {/* 🔹 TRAYECTOS */}
          <Route path="/viajes/:id/trayectos" element={<TrayectosViajePage />} />
          <Route path="/viajes/:id/trayectos/nuevo" element={<NuevoTrayectoPage />} />
          <Route path="/viajes/:id/trayectos/:trayectoId/editar" element={<EditarTrayectoPage />} />

          {/* 🔹 ALOJAMIENTOS */}
          <Route path="/alojamientos" element={<AlojamientosPage />} />
          <Route path="/alojamientos/nuevo" element={<NuevoAlojamientoPage />} />
          <Route path="/alojamientos/:alojamientoId" element={<DetalleAlojamientoPage />} />

          {/* 🔹 RESERVAS */}
          <Route path="/reservas" element={<ReservasPage />} />
          <Route path="/reservas/nueva" element={<NuevaReservaPage />} />
          <Route path="/reservas/:reservaId" element={<DetalleReservaPage />} />

          {/* 🔹 FALLBACK */}
          <Route path="*" element={<h2>Página no encontrada</h2>} />

        </Route>
      </Routes>
    </BrowserRouter>
  );
}