import { useEffect, useState } from "react";

import {
  FolderKanban,
  BrainCircuit,
  Clock3,
  Wallet,
  Bug,
  Database,
  TrendingUp,
  Activity,
} from "lucide-react";

import StatCard from "../components/StatCard";


function Dashboard() {

  // ============================================================
  // ESTADO
  // ============================================================

  const [evaluations, setEvaluations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);


  // ============================================================
  // OBTENER EVALUACIONES DESDE FASTAPI
  // ============================================================

  useEffect(() => {

    const fetchEvaluations = async () => {

      try {

        setLoading(true);

        const response = await fetch(
          "http://127.0.0.1:8000/evaluations/"
        );

        if (!response.ok) {
          throw new Error(
            "No se pudieron obtener las evaluaciones"
          );
        }

        const data = await response.json();

        setEvaluations(data);
        setError(false);

      } catch (err) {

        console.error(
          "Error al obtener evaluaciones:",
          err
        );

        setError(true);

      } finally {

        setLoading(false);

      }

    };

    fetchEvaluations();

  }, []);


  // ============================================================
  // INDICADORES
  // ============================================================

  const totalPredictions = evaluations.length;

  const successfulPredictions = evaluations.filter(
    (evaluation) =>
      evaluation.predicted_success === true
  ).length;

  const successRate =
    totalPredictions > 0
      ? (
          (successfulPredictions / totalPredictions) *
          100
        ).toFixed(1)
      : "0.0";


  // ============================================================
  // ÚLTIMAS EVALUACIONES
  // ============================================================

  const recentEvaluations = evaluations.slice(0, 5);


  // ============================================================
  // FORMATEAR FECHA
  // ============================================================

  const formatDate = (date) => {

    return new Date(date).toLocaleDateString(
      "es-PE",
      {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }
    );

  };


  // ============================================================
  // RENDER
  // ============================================================

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

          {loading
            ? "Conectando..."
            : "Sistema operativo"}

        </div>

      </div>


      {/* =====================================================
          ESTADÍSTICAS PRINCIPALES
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
          value={
            loading
              ? "..."
              : totalPredictions.toString()
          }
          icon={<BrainCircuit size={21} />}
          color="purple"
        />


        <StatCard
          title="Predicciones exitosas"
          value={
            loading
              ? "..."
              : successfulPredictions.toString()
          }
          icon={<Activity size={21} />}
          color="green"
        />


        <StatCard
          title="Tasa estimada de éxito"
          value={
            loading
              ? "..."
              : `${successRate}%`
          }
          icon={<TrendingUp size={21} />}
          color="orange"
        />

      </div>


      {/* =====================================================
          ERROR DE CONEXIÓN
      ====================================================== */}

      {error && (

        <div className="rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">

          No se pudo conectar con el servicio de evaluaciones.
          Verifica que FastAPI esté ejecutándose correctamente.

        </div>

      )}


      {/* =====================================================
          CONTENIDO PRINCIPAL
      ====================================================== */}

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">


        {/* ===================================================
            ÚLTIMAS PREDICCIONES
        ==================================================== */}

        <section className="rounded-2xl border border-slate-200 bg-white shadow-sm xl:col-span-2">


          {/* HEADER */}

          <div className="border-b border-slate-100 px-6 py-5">

            <div className="flex items-center gap-3">

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">

                <BrainCircuit size={20} />

              </div>


              <div>

                <h3 className="font-semibold text-slate-900">
                  Últimas predicciones
                </h3>

                <p className="mt-0.5 text-xs text-slate-500">
                  Evaluaciones generadas por el sistema.
                </p>

              </div>

            </div>

          </div>


          {/* LISTA */}

          <div className="divide-y divide-slate-100">


            {/* CARGANDO */}

            {loading && (

              <div className="px-6 py-8 text-center text-sm text-slate-400">

                Cargando evaluaciones...

              </div>

            )}


            {/* SIN DATOS */}

            {!loading &&
              recentEvaluations.length === 0 && (

                <div className="px-6 py-8 text-center">

                  <BrainCircuit
                    size={30}
                    className="mx-auto text-slate-300"
                  />

                  <p className="mt-3 text-sm font-medium text-slate-600">
                    No existen predicciones todavía
                  </p>

                  <p className="mt-1 text-xs text-slate-400">
                    Las nuevas evaluaciones aparecerán aquí.
                  </p>

                </div>

              )}


            {/* EVALUACIONES */}

            {!loading &&
              recentEvaluations.map(
                (evaluation) => (

                  <div
                    key={evaluation.evaluation_id}
                    className="flex flex-col gap-4 px-6 py-5 sm:flex-row sm:items-center sm:justify-between"
                  >


                    {/* PROYECTO */}

                    <div className="flex items-center gap-3">

                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-50 text-slate-600">

                        <FolderKanban size={18} />

                      </div>


                      <div>

                        <p className="text-sm font-semibold text-slate-800">
                          {evaluation.project_code}
                        </p>

                        <p className="mt-0.5 text-xs text-slate-400">
                          {formatDate(
                            evaluation.created_at
                          )}
                        </p>

                      </div>

                    </div>


                    {/* INDICADORES */}

                    <div className="flex flex-wrap items-center gap-5 text-xs">


                      {/* RETRASO */}

                      <div>

                        <p className="text-slate-400">
                          Retraso
                        </p>

                        <p className="mt-0.5 font-semibold text-slate-700">

                          {evaluation.predicted_delay_pct !== null &&
                          evaluation.predicted_delay_pct !== undefined

                            ? `${evaluation.predicted_delay_pct.toFixed(2)}%`

                            : "—"}

                        </p>

                      </div>


                      {/* SOBRECOSTO */}

                      <div>

                        <p className="text-slate-400">
                          Sobrecosto
                        </p>

                        <p className="mt-0.5 font-semibold text-slate-700">

                          {evaluation.predicted_overrun_pct !== null &&
                          evaluation.predicted_overrun_pct !== undefined

                            ? `${evaluation.predicted_overrun_pct.toFixed(2)}%`

                            : "—"}

                        </p>

                      </div>


                      {/* CALIDAD */}

                      <div>

                        <p className="text-slate-400">
                          Calidad
                        </p>

                        <p className="mt-0.5 font-semibold text-slate-700">

                          {evaluation.predicted_defect_density !== null &&
                          evaluation.predicted_defect_density !== undefined

                            ? evaluation.predicted_defect_density.toFixed(2)

                            : "—"}

                        </p>

                      </div>


                      {/* ESTADO */}

                      <div
                        className={`rounded-full px-2.5 py-1 font-medium ${
                          evaluation.predicted_success === true
                            ? "bg-emerald-50 text-emerald-700"
                            : evaluation.predicted_success === false
                            ? "bg-red-50 text-red-700"
                            : "bg-slate-100 text-slate-500"
                        }`}
                      >

                        {evaluation.predicted_success === true
                          ? "Éxito"
                          : evaluation.predicted_success === false
                          ? "No éxito"
                          : "Pendiente"}

                      </div>

                    </div>

                  </div>

                )
              )}

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
                  Métricas utilizadas por el sistema.
                </p>

              </div>

            </div>

          </div>


          <div className="space-y-3 p-5">


            {/* TIEMPO */}

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


            {/* PRESUPUESTO */}

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


            {/* CALIDAD */}

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


            {/* ÉXITO */}

            <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-4">

              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600">

                <TrendingUp size={18} />

              </div>

              <div>

                <p className="text-sm font-medium text-slate-800">
                  Éxito estimado
                </p>

                <p className="mt-0.5 text-xs text-slate-500">
                  Resultado global de la predicción
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

            <Database size={21} />

          </div>


          <div>

            <h3 className="text-sm font-semibold text-slate-900">
              Sistema basado en datos históricos
            </h3>

            <p className="mt-1 text-xs leading-5 text-slate-600">

              El sistema utiliza información histórica de proyectos
              de software para generar estimaciones relacionadas con
              el tiempo, presupuesto y calidad del proyecto.

            </p>

          </div>

        </div>

      </div>


    </div>

  );
}


export default Dashboard;
