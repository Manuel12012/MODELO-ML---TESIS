import {
    FolderKanban,
    BrainCircuit,
    Clock3,
    Wallet,
    Bug,
    Database,
    TrendingUp,
  } from "lucide-react";
  
  import StatCard from "../components/StatCard";
  
  function Dashboard() {
    return (
      <div className="space-y-8">
  
        {/* =====================================================
            ENCABEZADO
        ====================================================== */}
  
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
  
          <div>
            <p className="mb-1 text-sm font-medium text-blue-600">
              Panel principal
            </p>
  
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">
              Dashboard
            </h2>
  
            <p className="mt-1 max-w-2xl text-sm text-slate-500">
              Resumen del sistema predictivo de proyectos de software.
            </p>
          </div>
  
  
          {/* Estado del sistema */}
  
          <div className="flex items-center gap-2 self-start rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-700 sm:self-auto">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            Modelos disponibles
          </div>
  
        </div>
  
  
        {/* =====================================================
            ESTADÍSTICAS
        ====================================================== */}
  
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
  
          <StatCard
            title="Proyectos históricos"
            value="10,000"
            icon={<Database size={21} />}
            color="blue"
          />
  
          <StatCard
            title="Predicciones realizadas"
            value="0"
            icon={<BrainCircuit size={21} />}
            color="purple"
          />
  
          <StatCard
            title="Modelo de tiempo"
            value="R² 0.9619"
            icon={<Clock3 size={21} />}
            color="green"
          />
  
          <StatCard
            title="Modelo de presupuesto"
            value="R² 0.9644"
            icon={<Wallet size={21} />}
            color="orange"
          />
  
        </div>
  
  
        {/* =====================================================
            CONTENIDO PRINCIPAL
        ====================================================== */}
  
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
  
  
          {/* ===================================================
              MODELOS PREDICTIVOS
          ==================================================== */}
  
          <section className="rounded-2xl border border-slate-200 bg-white shadow-sm xl:col-span-2">
  
            <div className="border-b border-slate-100 px-6 py-5">
  
              <div className="flex items-center gap-3">
  
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <BrainCircuit size={20} />
                </div>
  
                <div>
                  <h3 className="font-semibold text-slate-900">
                    Modelos predictivos
                  </h3>
  
                  <p className="mt-0.5 text-xs text-slate-500">
                    Rendimiento obtenido durante la evaluación del modelo.
                  </p>
                </div>
  
              </div>
  
            </div>
  
  
            <div className="divide-y divide-slate-100">
  
              {/* Actual Days */}
  
              <div className="flex items-center justify-between gap-4 px-6 py-5">
  
                <div className="flex items-center gap-3">
  
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                    <Clock3 size={18} />
                  </div>
  
                  <div>
                    <p className="text-sm font-semibold text-slate-800">
                      Actual Days
                    </p>
  
                    <p className="mt-0.5 text-xs text-slate-500">
                      Predicción de duración real
                    </p>
                  </div>
  
                </div>
  
                <div className="text-right">
                  <p className="text-sm font-bold text-emerald-600">
                    R² 0.9619
                  </p>
  
                  <p className="mt-0.5 text-[11px] text-slate-400">
                    Excelente ajuste
                  </p>
                </div>
  
              </div>
  
  
              {/* Actual Cost */}
  
              <div className="flex items-center justify-between gap-4 px-6 py-5">
  
                <div className="flex items-center gap-3">
  
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-orange-50 text-orange-600">
                    <Wallet size={18} />
                  </div>
  
                  <div>
                    <p className="text-sm font-semibold text-slate-800">
                      Actual Cost
                    </p>
  
                    <p className="mt-0.5 text-xs text-slate-500">
                      Predicción del costo real
                    </p>
                  </div>
  
                </div>
  
                <div className="text-right">
                  <p className="text-sm font-bold text-emerald-600">
                    R² 0.9644
                  </p>
  
                  <p className="mt-0.5 text-[11px] text-slate-400">
                    Excelente ajuste
                  </p>
                </div>
  
              </div>
  
  
              {/* Defects */}
  
              <div className="flex items-center justify-between gap-4 px-6 py-5">
  
                <div className="flex items-center gap-3">
  
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
                    <Bug size={18} />
                  </div>
  
                  <div>
                    <p className="text-sm font-semibold text-slate-800">
                      Defects
                    </p>
  
                    <p className="mt-0.5 text-xs text-slate-500">
                      Predicción del número de defectos
                    </p>
                  </div>
  
                </div>
  
                <div className="text-right">
                  <p className="text-sm font-bold text-amber-600">
                    R² 0.4403
                  </p>
  
                  <p className="mt-0.5 text-[11px] text-slate-400">
                    Capacidad moderada
                  </p>
                </div>
  
              </div>
  
            </div>
  
          </section>
  
  
          {/* ===================================================
              INDICADORES
          ==================================================== */}
  
          <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
  
            <div className="border-b border-slate-100 px-6 py-5">
  
              <div className="flex items-center gap-3">
  
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
                  <TrendingUp size={20} />
                </div>
  
                <div>
                  <h3 className="font-semibold text-slate-900">
                    Indicadores
                  </h3>
  
                  <p className="mt-0.5 text-xs text-slate-500">
                    Métricas de desempeño del proyecto.
                  </p>
                </div>
  
              </div>
  
            </div>
  
  
            <div className="space-y-3 p-5">
  
              {/* Tiempo */}
  
              <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-4">
  
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                  <Clock3 size={18} />
                </div>
  
                <div>
                  <p className="text-sm font-medium text-slate-800">
                    Cumplimiento del tiempo
                  </p>
  
                  <p className="mt-0.5 text-xs text-slate-500">
                    Porcentaje de retraso
                  </p>
                </div>
  
              </div>
  
  
              {/* Presupuesto */}
  
              <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-4">
  
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-orange-100 text-orange-600">
                  <Wallet size={18} />
                </div>
  
                <div>
                  <p className="text-sm font-medium text-slate-800">
                    Cumplimiento del presupuesto
                  </p>
  
                  <p className="mt-0.5 text-xs text-slate-500">
                    Porcentaje de sobrecosto
                  </p>
                </div>
  
              </div>
  
  
              {/* Calidad */}
  
              <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-4">
  
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-red-100 text-red-600">
                  <Bug size={18} />
                </div>
  
                <div>
                  <p className="text-sm font-medium text-slate-800">
                    Calidad del software
                  </p>
  
                  <p className="mt-0.5 text-xs text-slate-500">
                    Densidad de defectos
                  </p>
                </div>
  
              </div>
  
            </div>
  
          </section>
  
        </div>
  
  
        {/* =====================================================
            INFORMACIÓN DEL SISTEMA
        ====================================================== */}
  
        <div className="rounded-2xl border border-blue-100 bg-gradient-to-r from-blue-50 to-indigo-50 p-5">
  
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
  
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-blue-600 shadow-sm">
              <FolderKanban size={21} />
            </div>
  
            <div>
              <h3 className="text-sm font-semibold text-slate-900">
                Sistema basado en datos históricos
              </h3>
  
              <p className="mt-1 text-xs leading-5 text-slate-600">
                Los modelos fueron entrenados utilizando 10,000 registros
                históricos de proyectos de software y permiten estimar
                duración, costo y defectos para nuevos proyectos.
              </p>
            </div>
  
          </div>
  
        </div>
  
      </div>
    );
  }
  
  export default Dashboard;