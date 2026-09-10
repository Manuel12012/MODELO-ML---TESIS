import { NavLink, useNavigate } from "react-router-dom";

import {
  LayoutDashboard,
  FolderKanban,
  BrainCircuit,
  LogOut,
  Activity,
} from "lucide-react";

function Sidebar() {
  const navigate = useNavigate();

  function logout() {
    localStorage.removeItem("authenticated");

    navigate("/login", {
      replace: true,
    });
  }

  const navItemClass = ({ isActive }) =>
    [
      "group",
      "flex",
      "items-center",
      "gap-3",
      "rounded-xl",
      "px-3.5",
      "py-3",
      "text-sm",
      "font-medium",
      "transition-all",
      "duration-200",
      isActive
        ? "bg-blue-600 text-white shadow-sm shadow-blue-200"
        : "text-slate-400 hover:bg-slate-800 hover:text-white",
    ].join(" ");

  return (
    <aside className="flex h-screen w-64 shrink-0 flex-col bg-slate-950 text-white">

      {/* =====================================================
          MARCA
      ====================================================== */}

      <div className="flex h-20 items-center border-b border-slate-800 px-5">

        <div className="flex items-center gap-3">

          {/* Icono */}

          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 shadow-lg shadow-blue-900/30">
            <Activity
              size={22}
              strokeWidth={2.2}
            />
          </div>


          {/* Nombre */}

          <div className="leading-tight">

            <h1 className="text-base font-bold tracking-tight text-white">
              PredictSoft
            </h1>

            <span className="text-xs font-medium text-slate-500">
              ML Platform
            </span>

          </div>

        </div>

      </div>


      {/* =====================================================
          NAVEGACIÓN
      ====================================================== */}

      <nav className="flex-1 overflow-y-auto px-4 py-6">

        <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.15em] text-slate-500">
          Principal
        </p>


        <div className="space-y-1.5">

          {/* Dashboard */}

          <NavLink
            to="/dashboard"
            className={navItemClass}
          >
            <LayoutDashboard
              size={19}
              strokeWidth={1.9}
              className="shrink-0"
            />

            <span>
              Dashboard
            </span>
          </NavLink>


          {/* Proyectos */}

          <NavLink
            to="/proyectos"
            className={navItemClass}
          >
            <FolderKanban
              size={19}
              strokeWidth={1.9}
              className="shrink-0"
            />

            <span>
              Proyectos
            </span>
          </NavLink>


          {/* Predicción */}

          <NavLink
            to="/prediccion"
            className={navItemClass}
          >
            <BrainCircuit
              size={19}
              strokeWidth={1.9}
              className="shrink-0"
            />

            <span>
              Nueva predicción
            </span>
          </NavLink>

        </div>

      </nav>


      {/* =====================================================
          USUARIO / CERRAR SESIÓN
      ====================================================== */}

      <div className="border-t border-slate-800 p-4">

        <button
          type="button"
          onClick={logout}
          className="group flex w-full items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-medium text-slate-400 transition-all duration-200 hover:bg-red-500/10 hover:text-red-400"
        >

          <LogOut
            size={18}
            strokeWidth={1.9}
            className="transition-transform duration-200 group-hover:-translate-x-0.5"
          />

          <span>
            Cerrar sesión
          </span>

        </button>

      </div>

    </aside>
  );
}

export default Sidebar;
