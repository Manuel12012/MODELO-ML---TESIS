import {
  Bell,
  UserRound,
} from "lucide-react";


function Header() {

  return (

    <header className="flex h-20 items-center justify-between border-b border-slate-200 bg-white px-6 lg:px-8">

      {/* =====================================================
          TÍTULO
      ====================================================== */}

      <div>

        <h1 className="text-lg font-semibold text-slate-900">
          Sistema Predictivo
        </h1>

        <p className="mt-0.5 text-sm text-slate-500">
          Gestión y análisis de proyectos de software
        </p>

      </div>


      {/* =====================================================
          USUARIO
      ====================================================== */}

      <div className="flex items-center gap-5">


        {/* =================================================
            NOTIFICACIONES
        ================================================= */}

        <button
          type="button"
          className="relative flex h-10 w-10 items-center justify-center rounded-xl text-slate-500 transition hover:bg-slate-100 hover:text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          aria-label="Notificaciones"
        >

          <Bell
            size={19}
            strokeWidth={1.8}
          />


          {/* Indicador */}

          <span className="absolute right-2.5 top-2 h-2 w-2 rounded-full bg-blue-600 ring-2 ring-white" />

        </button>


        {/* =================================================
            SEPARADOR
        ================================================= */}

        <div className="hidden h-8 w-px bg-slate-200 sm:block" />


        {/* =================================================
            PERFIL
        ================================================= */}

        <div className="flex items-center gap-3">


          {/* AVATAR */}

          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-sm font-semibold text-white shadow-sm">

            <UserRound
              size={18}
              strokeWidth={1.8}
            />

          </div>


          {/* INFORMACIÓN */}

          <div className="hidden leading-tight sm:block">

            <p className="text-sm font-semibold text-slate-800">

              Administrador

            </p>


            <p className="mt-1 text-xs text-slate-500">

              Administrador ML

            </p>

          </div>

        </div>

      </div>

    </header>

  );

}


export default Header;