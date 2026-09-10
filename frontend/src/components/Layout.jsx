import { Outlet } from "react-router-dom";

import Sidebar from "./SideBar";
import Header from "./Header";

function Layout() {
  return (
    <div className="flex min-h-screen bg-slate-50">

      {/* =====================================================
          SIDEBAR
      ====================================================== */}

      <Sidebar />


      {/* =====================================================
          CONTENIDO PRINCIPAL
      ====================================================== */}

      <div className="flex min-w-0 flex-1 flex-col">

        {/* Header */}

        <Header />


        {/* Contenido de las rutas */}

        <main className="flex-1 overflow-y-auto p-6 lg:p-8">

          <div className="mx-auto w-full max-w-7xl">

            <Outlet />

          </div>

        </main>

      </div>

    </div>
  );
}

export default Layout;
