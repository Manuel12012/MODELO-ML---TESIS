import { NavLink, useNavigate } from "react-router-dom";

import {
  LayoutDashboard,
  FolderKanban,
  BrainCircuit,
  ClipboardList,
  BarChart3,
  LogOut,
  Activity,
} from "lucide-react";


function Sidebar() {

  const navigate = useNavigate();


  // ============================================================
  // CERRAR SESIÓN
  // ============================================================

  function logout() {

    localStorage.removeItem("authenticated");

    navigate("/login", {
      replace: true,
    });

  }


  // ============================================================
  // ESTILO DE OPCIONES
  // ============================================================

  const navItemClass = ({ isActive }) =>
    [
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
      "outline-none",
      "focus-visible:ring-2",
      "focus-visible:ring-blue-500",
      "focus-visible:ring-offset-2",
      "focus-visible:ring-offset-slate-950",

      isActive
        ? "bg-blue-600 text-white shadow-sm shadow-blue-900/30"
        : "text-slate-400 hover:bg-slate-800 hover:text-white",
    ].join(" ");


  return (

    <aside className="flex h-screen w-64 shrink-0 flex-col bg-slate-950 text-white">


      {/* =====================================================
          MARCA
      ====================================================== */}

      <div className="flex h-20 shrink-0 items-center border-b border-slate-800 px-5">

        <div className="flex items-center gap-3">

          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-600 shadow-lg shadow-blue-900/30">

            <Activity
              size={22}
              strokeWidth={2.2}
            />

          </div>


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

      <nav className="flex-1 px-4 py-6">

        <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.15em] text-slate-500">

          Principal

        </p>


        <div className="space-y-1.5">


          {/* ==================================================
              DASHBOARD
          ================================================== */}

          <NavLink
            to="/dashboard"
            className={navItemClass}
          >

            <LayoutDashboard
              size={19}
              strokeWidth={1.9}
            />

            <span>

              Dashboard

            </span>

          </NavLink>


          {/* ==================================================
              PROYECTOS
          ================================================== */}

          <NavLink
            to="/proyectos"
            className={navItemClass}
          >

            <FolderKanban
              size={19}
              strokeWidth={1.9}
            />

            <span>

              Proyectos

            </span>

          </NavLink>


          {/* ==================================================
              NUEVA PREDICCIÓN
          ================================================== */}

          <NavLink
            to="/prediccion"
            className={navItemClass}
          >

            <BrainCircuit
              size={19}
              strokeWidth={1.9}
            />

            <span>

              Nueva predicción

            </span>

          </NavLink>


          {/* ==================================================
              EVALUACIONES
          ================================================== */}

          <NavLink
            to="/evaluaciones"
            className={navItemClass}
          >

            <ClipboardList
              size={19}
              strokeWidth={1.9}
            />

            <span>

              Evaluaciones

            </span>

          </NavLink>


          {/* ==================================================
              COMPARACIÓN
          ================================================== */}

          <NavLink
            to="/prediction-comparison"
            className={navItemClass}
          >

            <BarChart3
              size={19}
              strokeWidth={1.9}
            />

            <span>

              Comparación

            </span>

          </NavLink>


        </div>

      </nav>


      {/* =====================================================
          CERRAR SESIÓN
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