import { useEffect, useState } from "react";

import {
  Activity,
  AlertCircle,
  BarChart3,
  CheckCircle2,
  Clock3,
  FolderKanban,
  RefreshCw,
  X,
} from "lucide-react";

import {
  getEvaluationComparisons,
} from "../services/api";


function PredictionComparison() {

  // ============================================================
  // ESTADOS
  // ============================================================

  const [evaluations, setEvaluations] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [selectedEvaluation, setSelectedEvaluation] =
    useState(null);


  // ============================================================
  // CARGAR EVALUACIONES
  // ============================================================

  useEffect(() => {

    loadEvaluations();

  }, []);


  async function loadEvaluations() {

    try {

      setLoading(true);

      setError("");

      const data =
        await getEvaluationComparisons();

      setEvaluations(data);

    } catch (err) {

      console.error(err);

      setError(
        err.message ||
        "No se pudieron cargar las evaluaciones."
      );

    } finally {

      setLoading(false);

    }
  }


  // ============================================================
  // CÁLCULOS RESUMEN
  // ============================================================

  const totalEvaluations =
    evaluations.length;


  const averageDelayDifference =
    totalEvaluations > 0

      ? evaluations.reduce(
          (sum, evaluation) =>
            sum +
            Math.abs(
              Number(
                evaluation.difference.delay_pct
              )
            ),
          0
        ) / totalEvaluations

      : 0;


  const averageOverrunDifference =
    totalEvaluations > 0

      ? evaluations.reduce(
          (sum, evaluation) =>
            sum +
            Math.abs(
              Number(
                evaluation.difference.overrun_pct
              )
            ),
          0
        ) / totalEvaluations

      : 0;


  const averageDefectDifference =
    totalEvaluations > 0

      ? evaluations.reduce(
          (sum, evaluation) =>
            sum +
            Math.abs(
              Number(
                evaluation.difference.defect_density
              )
            ),
          0
        ) / totalEvaluations

      : 0;


  // ============================================================
  // FORMATEAR NÚMEROS
  // ============================================================

  function formatNumber(value, decimals = 2) {

    if (
      value === null ||
      value === undefined ||
      Number.isNaN(Number(value))
    ) {

      return "—";

    }

    return Number(value).toLocaleString(
      "es-PE",
      {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      }
    );
  }


  // ============================================================
  // FORMATEAR MONEDA
  // ============================================================

  function formatCurrency(value) {

    if (
      value === null ||
      value === undefined
    ) {

      return "—";

    }

    return `S/ ${Number(value).toLocaleString(
      "es-PE",
      {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }
    )}`;
  }


  // ============================================================
  // DIFERENCIA
  // ============================================================

  function getDifferenceClass(value) {

    const number = Number(value);

    if (number === 0) {

      return "text-slate-500";

    }

    return number > 0
      ? "text-red-600"
      : "text-emerald-600";
  }


  // ============================================================
  // RENDER
  // ============================================================

  return (

    <div className="min-h-screen bg-slate-50 text-slate-800">

      <div className="mx-auto max-w-7xl px-6 py-8">


        {/* ====================================================
            HEADER
        ===================================================== */}

        <div className="mb-8 flex flex-col gap-5 md:flex-row md:items-center md:justify-between">

          <div>

            <div className="flex items-center gap-3">

              <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-blue-100 bg-blue-50">

                <BarChart3
                  size={23}
                  className="text-blue-600"
                />

              </div>

              <div>

                <h1 className="text-2xl font-bold text-slate-900">

                  Evaluaciones

                </h1>

                <p className="mt-1 text-sm text-slate-500">

                  Comparación entre predicciones y resultados reales

                </p>

              </div>

            </div>

          </div>


          {/* ==================================================
              REFRESH
          =================================================== */}

          <button
            type="button"
            onClick={loadEvaluations}
            disabled={loading}
            className="
              inline-flex
              items-center
              justify-center
              gap-2
              rounded-xl
              border
              border-slate-200
              bg-white
              px-4
              py-2.5
              text-sm
              font-semibold
              text-slate-600
              shadow-sm
              transition
              hover:bg-slate-50
              disabled:cursor-not-allowed
              disabled:opacity-50
            "
          >

            <RefreshCw
              size={17}
              className={
                loading
                  ? "animate-spin"
                  : ""
              }
            />

            Actualizar

          </button>

        </div>


        {/* ====================================================
            ERROR
        ===================================================== */}

        {error && (

          <div className="mb-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">

            <AlertCircle
              size={19}
              className="mt-0.5 shrink-0"
            />

            <div>

              <p className="font-semibold">

                Error

              </p>

              <p className="mt-1">

                {error}

              </p>

            </div>

          </div>

        )}


        {/* ====================================================
            RESUMEN
        ===================================================== */}

        <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">


          {/* TOTAL */}

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">

                  Evaluaciones

                </p>

                <p className="mt-2 text-2xl font-bold text-slate-900">

                  {totalEvaluations}

                </p>

              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50">

                <FolderKanban
                  size={19}
                  className="text-blue-600"
                />

              </div>

            </div>

          </div>


          {/* ERROR RETRASO */}

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">

                  Diferencia retraso

                </p>

                <p className="mt-2 text-2xl font-bold text-slate-900">

                  {formatNumber(
                    averageDelayDifference
                  )}

                  %

                </p>

              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-50">

                <Clock3
                  size={19}
                  className="text-amber-600"
                />

              </div>

            </div>

          </div>


          {/* ERROR COSTO */}

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">

                  Diferencia sobrecosto

                </p>

                <p className="mt-2 text-2xl font-bold text-slate-900">

                  {formatNumber(
                    averageOverrunDifference
                  )}

                  %

                </p>

              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-violet-50">

                <Activity
                  size={19}
                  className="text-violet-600"
                />

              </div>

            </div>

          </div>


          {/* ERROR DEFECTOS */}

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">

                  Diferencia defectos

                </p>

                <p className="mt-2 text-2xl font-bold text-slate-900">

                  {formatNumber(
                    averageDefectDifference
                  )}

                </p>

              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-50">

                <CheckCircle2
                  size={19}
                  className="text-red-500"
                />

              </div>

            </div>

          </div>

        </div>


        {/* ====================================================
            CONTENIDO
        ===================================================== */}

        {loading ? (

          <div className="flex min-h-[350px] items-center justify-center rounded-2xl border border-slate-200 bg-white shadow-sm">

            <div className="text-center">

              <div className="mx-auto mb-4 h-9 w-9 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />

              <p className="text-sm text-slate-500">

                Cargando evaluaciones...

              </p>

            </div>

          </div>

        ) : evaluations.length === 0 ? (

          <div className="flex min-h-[350px] items-center justify-center rounded-2xl border border-slate-200 bg-white shadow-sm">

            <div className="text-center">

              <BarChart3
                size={42}
                className="mx-auto mb-4 text-slate-300"
              />

              <h3 className="font-semibold text-slate-700">

                No hay evaluaciones disponibles

              </h3>

              <p className="mt-2 max-w-md text-sm text-slate-400">

                Las comparaciones aparecerán cuando
                un proyecto tenga una predicción y
                posteriormente se registre su resultado real.

              </p>

            </div>

          </div>

        ) : (

          /* ==================================================
             TABLA
          =================================================== */

          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

            <div className="overflow-x-auto">

              <table className="w-full min-w-[1050px]">

                <thead>

                  <tr className="border-b border-slate-200 bg-slate-50">

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">

                      Proyecto

                    </th>

                    <th className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wide text-slate-500">

                      Retraso

                    </th>

                    <th className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wide text-slate-500">

                      Sobrecosto

                    </th>

                    <th className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wide text-slate-500">

                      Densidad

                    </th>

                    <th className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wide text-slate-500">

                      Estado

                    </th>

                    <th className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wide text-slate-500">

                      Acción

                    </th>

                  </tr>

                </thead>


                <tbody className="divide-y divide-slate-100">

                  {evaluations.map(
                    (evaluation) => (

                      <tr
                        key={
                          evaluation.evaluation_id
                        }
                        className="transition hover:bg-slate-50"
                      >

                        {/* PROYECTO */}

                        <td className="px-6 py-5">

                          <div className="flex items-center gap-3">

                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50">

                              <FolderKanban
                                size={18}
                                className="text-blue-600"
                              />

                            </div>

                            <div>

                              <p className="font-semibold text-slate-800">

                                {
                                  evaluation.project_code
                                }

                              </p>

                              <p className="mt-0.5 text-xs text-slate-400">

                                Evaluación #
                                {
                                  evaluation.evaluation_id
                                }

                              </p>

                            </div>

                          </div>

                        </td>


                        {/* RETRASO */}

                        <td className="px-6 py-5">

                          <div className="text-center">

                            <p className="text-sm font-semibold text-slate-700">

                              {
                                formatNumber(
                                  evaluation.prediction.delay_pct
                                )
                              }
                              %

                            </p>

                            <p
                              className={`mt-1 text-xs font-medium ${getDifferenceClass(
                                evaluation.difference.delay_pct
                              )}`}
                            >

                              Real:{" "}

                              {
                                formatNumber(
                                  evaluation.actual.delay_pct
                                )
                              }
                              %

                            </p>

                          </div>

                        </td>


                        {/* SOBRECOSTO */}

                        <td className="px-6 py-5">

                          <div className="text-center">

                            <p className="text-sm font-semibold text-slate-700">

                              {
                                formatNumber(
                                  evaluation.prediction.overrun_pct
                                )
                              }
                              %

                            </p>

                            <p
                              className={`mt-1 text-xs font-medium ${getDifferenceClass(
                                evaluation.difference.overrun_pct
                              )}`}
                            >

                              Real:{" "}

                              {
                                formatNumber(
                                  evaluation.actual.overrun_pct
                                )
                              }
                              %

                            </p>

                          </div>

                        </td>


                        {/* DENSIDAD */}

                        <td className="px-6 py-5">

                          <div className="text-center">

                            <p className="text-sm font-semibold text-slate-700">

                              {
                                formatNumber(
                                  evaluation.prediction.defect_density
                                )
                              }

                            </p>

                            <p
                              className={`mt-1 text-xs font-medium ${getDifferenceClass(
                                evaluation.difference.defect_density
                              )}`}
                            >

                              Real:{" "}

                              {
                                formatNumber(
                                  evaluation.actual.defect_density
                                )
                              }

                            </p>

                          </div>

                        </td>


                        {/* ESTADO */}

                        <td className="px-6 py-5 text-center">

                          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700">

                            <CheckCircle2
                              size={14}
                            />

                            Finalizado

                          </span>

                        </td>


                        {/* ACCIÓN */}

                        <td className="px-6 py-5 text-center">

                          <button
                            type="button"
                            onClick={() =>
                              setSelectedEvaluation(
                                evaluation
                              )
                            }
                            className="
                              rounded-lg
                              border
                              border-blue-200
                              bg-blue-50
                              px-3.5
                              py-2
                              text-xs
                              font-semibold
                              text-blue-700
                              transition
                              hover:bg-blue-100
                            "
                          >

                            Ver comparación

                          </button>

                        </td>

                      </tr>

                    )
                  )}

                </tbody>

              </table>

            </div>


            {/* ==================================================
                FOOTER
            =================================================== */}

            <div className="border-t border-slate-200 bg-slate-50 px-6 py-3">

              <p className="text-xs text-slate-500">

                {evaluations.length} evaluación(es)
                disponible(s)

              </p>

            </div>

          </div>

        )}

      </div>


      {/* ======================================================
          MODAL DETALLE
      ======================================================= */}

      {selectedEvaluation && (

        <div
          className="
            fixed
            inset-0
            z-50
            flex
            items-center
            justify-center
            bg-slate-900/40
            px-4
            py-6
            backdrop-blur-sm
          "
        >

          <div className="w-full max-w-3xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">


            {/* =================================================
                HEADER
            ================================================== */}

            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">

              <div>

                <div className="flex items-center gap-3">

                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50">

                    <BarChart3
                      size={19}
                      className="text-blue-600"
                    />

                  </div>

                  <div>

                    <h2 className="text-lg font-bold text-slate-900">

                      Comparación de resultados

                    </h2>

                    <p className="text-xs text-slate-500">

                      {
                        selectedEvaluation.project_code
                      }

                    </p>

                  </div>

                </div>

              </div>


              <button
                type="button"
                onClick={() =>
                  setSelectedEvaluation(null)
                }
                className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
              >

                <X size={20} />

              </button>

            </div>


            {/* =================================================
                BODY
            ================================================== */}

            <div className="p-6">


              {/* =================================================
                  COLUMNAS
              ================================================== */}

              <div className="mb-6 grid grid-cols-3 gap-4">

                <div className="rounded-xl border border-blue-100 bg-blue-50 p-4">

                  <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">

                    Predicción ML

                  </p>

                  <p className="mt-1 text-xs text-blue-500">

                    Valores estimados por el modelo

                  </p>

                </div>


                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">

                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-600">

                    Resultado real

                  </p>

                  <p className="mt-1 text-xs text-slate-500">

                    Valores registrados

                  </p>

                </div>


                <div className="rounded-xl border border-amber-100 bg-amber-50 p-4">

                  <p className="text-xs font-semibold uppercase tracking-wide text-amber-600">

                    Diferencia

                  </p>

                  <p className="mt-1 text-xs text-amber-500">

                    Real − predicción

                  </p>

                </div>

              </div>


              {/* =================================================
                  RETRASO
              ================================================== */}

              <div className="mb-4 rounded-xl border border-slate-200 bg-white">

                <div className="grid grid-cols-3 divide-x divide-slate-200">

                  <div className="p-5">

                    <p className="text-xs text-slate-500">

                      Retraso predicho

                    </p>

                    <p className="mt-2 text-xl font-bold text-blue-600">

                      {
                        formatNumber(
                          selectedEvaluation
                            .prediction
                            .delay_pct
                        )
                      }
                      %

                    </p>

                  </div>


                  <div className="p-5">

                    <p className="text-xs text-slate-500">

                      Retraso real

                    </p>

                    <p className="mt-2 text-xl font-bold text-slate-800">

                      {
                        formatNumber(
                          selectedEvaluation
                            .actual
                            .delay_pct
                        )
                      }
                      %

                    </p>

                  </div>


                  <div className="p-5">

                    <p className="text-xs text-slate-500">

                      Diferencia

                    </p>

                    <p
                      className={`mt-2 text-xl font-bold ${getDifferenceClass(
                        selectedEvaluation
                          .difference
                          .delay_pct
                      )}`}
                    >

                      {
                        formatNumber(
                          selectedEvaluation
                            .difference
                            .delay_pct
                        )
                      }
                      pp

                    </p>

                  </div>

                </div>

              </div>


              {/* =================================================
                  SOBRECOSTO
              ================================================== */}

              <div className="mb-4 rounded-xl border border-slate-200 bg-white">

                <div className="grid grid-cols-3 divide-x divide-slate-200">

                  <div className="p-5">

                    <p className="text-xs text-slate-500">

                      Sobrecosto predicho

                    </p>

                    <p className="mt-2 text-xl font-bold text-blue-600">

                      {
                        formatNumber(
                          selectedEvaluation
                            .prediction
                            .overrun_pct
                        )
                      }
                      %

                    </p>

                  </div>


                  <div className="p-5">

                    <p className="text-xs text-slate-500">

                      Sobrecosto real

                    </p>

                    <p className="mt-2 text-xl font-bold text-slate-800">

                      {
                        formatNumber(
                          selectedEvaluation
                            .actual
                            .overrun_pct
                        )
                      }
                      %

                    </p>

                  </div>


                  <div className="p-5">

                    <p className="text-xs text-slate-500">

                      Diferencia

                    </p>

                    <p
                      className={`mt-2 text-xl font-bold ${getDifferenceClass(
                        selectedEvaluation
                          .difference
                          .overrun_pct
                      )}`}
                    >

                      {
                        formatNumber(
                          selectedEvaluation
                            .difference
                            .overrun_pct
                        )
                      }
                      pp

                    </p>

                  </div>

                </div>

              </div>


              {/* =================================================
                  DENSIDAD
              ================================================== */}

              <div className="rounded-xl border border-slate-200 bg-white">

                <div className="grid grid-cols-3 divide-x divide-slate-200">

                  <div className="p-5">

                    <p className="text-xs text-slate-500">

                      Densidad predicha

                    </p>

                    <p className="mt-2 text-xl font-bold text-blue-600">

                      {
                        formatNumber(
                          selectedEvaluation
                            .prediction
                            .defect_density
                        )
                      }

                    </p>

                  </div>


                  <div className="p-5">

                    <p className="text-xs text-slate-500">

                      Densidad real

                    </p>

                    <p className="mt-2 text-xl font-bold text-slate-800">

                      {
                        formatNumber(
                          selectedEvaluation
                            .actual
                            .defect_density
                        )
                      }

                    </p>

                  </div>


                  <div className="p-5">

                    <p className="text-xs text-slate-500">

                      Diferencia

                    </p>

                    <p
                      className={`mt-2 text-xl font-bold ${getDifferenceClass(
                        selectedEvaluation
                          .difference
                          .defect_density
                      )}`}
                    >

                      {
                        formatNumber(
                          selectedEvaluation
                            .difference
                            .defect_density
                        )
                      }

                    </p>

                  </div>

                </div>

              </div>


              {/* =================================================
                  DATOS REALES
              ================================================== */}

              <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-5">

                <p className="mb-4 text-sm font-semibold text-slate-700">

                  Valores registrados

                </p>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">

                  <div>

                    <p className="text-xs text-slate-500">

                      Días reales

                    </p>

                    <p className="mt-1 font-semibold text-slate-800">

                      {
                        formatNumber(
                          selectedEvaluation
                            .actual
                            .days,
                          0
                        )
                      }

                    </p>

                  </div>


                  <div>

                    <p className="text-xs text-slate-500">

                      Costo real

                    </p>

                    <p className="mt-1 font-semibold text-slate-800">

                      {
                        formatCurrency(
                          selectedEvaluation
                            .actual
                            .cost_pen
                        )
                      }

                    </p>

                  </div>


                  <div>

                    <p className="text-xs text-slate-500">

                      Errores reales

                    </p>

                    <p className="mt-1 font-semibold text-slate-800">

                      {
                        formatNumber(
                          selectedEvaluation
                            .actual
                            .defects,
                          0
                        )
                      }

                    </p>

                  </div>

                </div>

              </div>


              {/* =================================================
                  CERRAR
              ================================================== */}

              <div className="mt-6 flex justify-end">

                <button
                  type="button"
                  onClick={() =>
                    setSelectedEvaluation(null)
                  }
                  className="
                    rounded-xl
                    border
                    border-slate-200
                    bg-white
                    px-5
                    py-2.5
                    text-sm
                    font-semibold
                    text-slate-600
                    transition
                    hover:bg-slate-50
                  "
                >

                  Cerrar

                </button>

              </div>

            </div>

          </div>

        </div>

      )}

    </div>

  );
}


export default PredictionComparison;