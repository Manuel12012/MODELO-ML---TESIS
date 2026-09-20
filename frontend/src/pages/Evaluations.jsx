import { useEffect, useState } from "react";

import {
  BrainCircuit,
  CalendarDays,
  Eye,
  RefreshCw,
  AlertCircle,
  Activity,
  Loader2,
} from "lucide-react";


const API_URL = "http://127.0.0.1:8000";


function Evaluations() {

  const [evaluations, setEvaluations] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");


  // ============================================================
  // CARGAR EVALUACIONES
  // ============================================================

  async function loadEvaluations() {

    try {

      setLoading(true);

      setError("");


      const response = await fetch(
        `${API_URL}/evaluations/`,
        {
          method: "GET",

          headers: {
            Accept: "application/json",
          },
        }
      );


      if (!response.ok) {

        throw new Error(
          "Error al obtener las evaluaciones"
        );

      }


      const data = await response.json();


      setEvaluations(data);

    } catch (err) {

      console.error(err);

      setError(
        "No se pudieron cargar las evaluaciones. Verifique que el backend esté ejecutándose."
      );

    } finally {

      setLoading(false);

    }

  }


  // ============================================================
  // CARGA INICIAL
  // ============================================================

  useEffect(() => {

    loadEvaluations();

  }, []);


  // ============================================================
  // FORMATEAR FECHA
  // ============================================================

  function formatDate(date) {

    if (!date) {

      return "—";

    }


    return new Date(date).toLocaleString(
      "es-PE",
      {
        dateStyle: "short",
        timeStyle: "short",
      }
    );

  }


  // ============================================================
  // RENDER
  // ============================================================

  return (

    <div className="space-y-8 pb-10">


      {/* ======================================================
          HEADER
      ====================================================== */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">

        <div>

          <div className="mb-2 flex items-center gap-2 text-sm font-medium text-blue-600">

            <Activity size={17} />

            Historial predictivo

          </div>


          <h2 className="text-3xl font-bold tracking-tight text-slate-900">

            Evaluaciones

          </h2>


          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">

            Historial de las evaluaciones predictivas realizadas
            sobre los proyectos registrados.

          </p>

        </div>


        {/* BOTÓN ACTUALIZAR */}

        <button
          type="button"
          onClick={loadEvaluations}
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 hover:text-blue-600 disabled:cursor-not-allowed disabled:opacity-60"
        >

          <RefreshCw
            size={16}
            className={
              loading
                ? "animate-spin"
                : ""
            }
          />

          Actualizar

        </button>

      </div>


      {/* ======================================================
          RESUMEN
      ====================================================== */}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">


        {/* TOTAL EVALUACIONES */}

        <SummaryCard
          icon={<BrainCircuit size={20} />}
          title="Evaluaciones"
          value={evaluations.length}
          color="blue"
        />


        {/* PROYECTOS EVALUADOS */}

        <SummaryCard
          icon={<Activity size={20} />}
          title="Proyectos evaluados"
          value={
            new Set(
              evaluations.map(
                (evaluation) =>
                  evaluation.project_id
              )
            ).size
          }
          color="emerald"
        />


        {/* ÚLTIMA EVALUACIÓN */}

        <SummaryCard
          icon={<CalendarDays size={20} />}
          title="Última evaluación"
          value={
            evaluations.length > 0
              ? formatDate(
                  evaluations[0].created_at
                )
              : "—"
          }
          color="purple"
        />

      </div>


      {/* ======================================================
          ERROR
      ====================================================== */}

      {error && (

        <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4">

          <AlertCircle
            size={18}
            className="mt-0.5 shrink-0 text-red-600"
          />

          <div>

            <p className="text-sm font-semibold text-red-800">

              Error al cargar las evaluaciones

            </p>

            <p className="mt-1 text-xs leading-5 text-red-700">

              {error}

            </p>

          </div>

        </div>

      )}


      {/* ======================================================
          TABLA PRINCIPAL
      ====================================================== */}

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">


        {/* CABECERA */}

        <div className="border-b border-slate-100 bg-slate-50/70 px-6 py-5">

          <h3 className="font-semibold text-slate-900">

            Historial de predicciones

          </h3>


          <p className="mt-1 text-xs leading-5 text-slate-500">

            Resultados almacenados de las evaluaciones
            realizadas mediante el modelo predictivo.

          </p>

        </div>


        {/* ====================================================
            LOADING
        ==================================================== */}

        {loading ? (

          <LoadingState />

        ) : evaluations.length === 0 ? (

          /* ==================================================
             EMPTY
          ================================================== */

          <EmptyState />

        ) : (

          /* ==================================================
             TABLA
          ================================================== */

          <div className="overflow-x-auto">

            <table className="w-full min-w-[950px]">


              {/* ==================================================
                  HEADER TABLA
              ================================================== */}

              <thead>

                <tr className="border-b border-slate-100 text-left">


                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-400">

                    Evaluación

                  </th>


                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-400">

                    Proyecto

                  </th>


                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-400">

                    Fecha

                  </th>


                  <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-slate-400">

                    Retraso

                  </th>


                  <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-slate-400">

                    Sobrecosto

                  </th>


                  <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-slate-400">

                    Densidad

                  </th>


                  <th className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wider text-slate-400">

                    Estado

                  </th>


                  <th className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wider text-slate-400">

                    Acción

                  </th>


                </tr>

              </thead>


              {/* ==================================================
                  BODY
              ================================================== */}

              <tbody>


                {evaluations.map(
                  (evaluation) => (

                    <tr
                      key={
                        evaluation.evaluation_id
                      }
                      className="border-b border-slate-50 transition hover:bg-slate-50"
                    >


                      {/* ========================================
                          ID EVALUACIÓN
                      ======================================== */}

                      <td className="px-6 py-4">

                        <span className="font-semibold text-slate-800">

                          #{evaluation.evaluation_id}

                        </span>

                      </td>


                      {/* ========================================
                          PROYECTO
                      ======================================== */}

                      <td className="px-6 py-4">

                        <div className="flex items-center gap-3">


                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">

                            <BrainCircuit size={17} />

                          </div>


                          <div>

                            <p className="text-sm font-semibold text-slate-900">

                              {evaluation.project_code}

                            </p>


                            <p className="mt-0.5 text-xs text-slate-400">

                              Proyecto #
                              {evaluation.project_id}

                            </p>

                          </div>

                        </div>

                      </td>


                      {/* ========================================
                          FECHA
                      ======================================== */}

                      <td className="px-6 py-4">

                        <div className="flex items-center gap-2 text-sm text-slate-600">

                          <CalendarDays
                            size={15}
                            className="text-slate-400"
                          />

                          {formatDate(
                            evaluation.created_at
                          )}

                        </div>

                      </td>


                      {/* ========================================
                          RETRASO
                      ======================================== */}

                      <td className="px-6 py-4 text-right">

                        <MetricValue
                          value={
                            evaluation.predicted_delay_pct
                          }
                          suffix="%"
                          decimals={2}
                        />

                      </td>


                      {/* ========================================
                          SOBRECOSTO
                      ======================================== */}

                      <td className="px-6 py-4 text-right">

                        <MetricValue
                          value={
                            evaluation.predicted_overrun_pct
                          }
                          suffix="%"
                          decimals={2}
                        />

                      </td>


                      {/* ========================================
                          DENSIDAD DE DEFECTOS
                      ======================================== */}

                      <td className="px-6 py-4 text-right">

                        <MetricValue
                          value={
                            evaluation.predicted_defect_density
                          }
                          decimals={3}
                        />

                      </td>


                      {/* ========================================
                          ESTADO
                      ======================================== */}

                      <td className="px-6 py-4 text-center">

                        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700">

                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />

                          Completada

                        </span>

                      </td>


                      {/* ========================================
                          ACCIÓN
                      ======================================== */}

                      <td className="px-6 py-4 text-center">

                        <button
                          type="button"
                          title="Ver detalle"
                          className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition hover:bg-blue-50 hover:text-blue-600"
                        >

                          <Eye size={17} />

                        </button>

                      </td>


                    </tr>

                  )
                )}

              </tbody>

            </table>

          </div>

        )}

      </section>


      {/* ======================================================
          INFORMACIÓN
      ====================================================== */}

      <div className="rounded-2xl border border-blue-100 bg-gradient-to-r from-blue-50 to-indigo-50 p-5">

        <div className="flex items-start gap-4">


          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-blue-600 shadow-sm">

            <BrainCircuit size={19} />

          </div>


          <div>

            <h4 className="text-sm font-semibold text-slate-900">

              Evaluaciones mediante Machine Learning

            </h4>


            <p className="mt-1 max-w-3xl text-xs leading-5 text-slate-600">

              Cada registro representa una evaluación realizada
              sobre un proyecto. Los resultados corresponden a
              estimaciones generadas por los modelos predictivos
              entrenados.

            </p>

          </div>

        </div>

      </div>


    </div>

  );

}


/* ==============================================================
   SUMMARY CARD
============================================================== */

function SummaryCard({
  icon,
  title,
  value,
  color,
}) {

  const colors = {

    blue:
      "bg-blue-50 text-blue-600",

    emerald:
      "bg-emerald-50 text-emerald-600",

    purple:
      "bg-purple-50 text-purple-600",

  };


  return (

    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">

      <div className="flex items-center gap-4">


        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${colors[color]}`}
        >

          {icon}

        </div>


        <div className="min-w-0">

          <p className="text-xs font-medium text-slate-400">

            {title}

          </p>


          <p className="mt-1 truncate text-xl font-bold text-slate-900">

            {value}

          </p>

        </div>

      </div>

    </div>

  );

}


/* ==============================================================
   MÉTRICA
============================================================== */

function MetricValue({
  value,
  suffix = "",
  decimals = 2,
}) {

  if (
    value === null ||
    value === undefined
  ) {

    return (

      <span className="text-slate-400">

        —

      </span>

    );

  }


  return (

    <span className="font-semibold text-slate-800">

      {Number(value).toFixed(decimals)}

      {suffix}

    </span>

  );

}


/* ==============================================================
   LOADING
============================================================== */

function LoadingState() {

  return (

    <div className="flex min-h-[350px] items-center justify-center">

      <div className="flex items-center gap-3 text-sm text-slate-500">

        <Loader2
          size={20}
          className="animate-spin text-blue-600"
        />

        Cargando evaluaciones...

      </div>

    </div>

  );

}


/* ==============================================================
   EMPTY STATE
============================================================== */

function EmptyState() {

  return (

    <div className="flex min-h-[350px] flex-col items-center justify-center px-6 py-12 text-center">


      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">

        <BrainCircuit size={29} />

      </div>


      <h3 className="mt-5 text-lg font-semibold text-slate-900">

        No existen evaluaciones

      </h3>


      <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">

        Las evaluaciones aparecerán aquí después de
        ejecutar una predicción sobre un proyecto.

      </p>

    </div>

  );

}


export default Evaluations;
