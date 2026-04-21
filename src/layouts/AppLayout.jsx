import { Outlet } from "react-router-dom";
import BottomNav from "../components/BottomNav";

export default function AppLayout() {
  return (
    <div className="min-h-screen bg-slate-100">
      <div className="mx-auto min-h-screen max-w-md bg-white shadow-sm">
        <main className="px-4 pt-4 pb-32">
          <Outlet />
        </main>

        <BottomNav />
      </div>
    </div>
  );
}