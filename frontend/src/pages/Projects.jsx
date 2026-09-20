import { useEffect, useState } from "react";

import {
  FolderKanban,
  Search,
  CheckCircle2,
  X,
  Save,
  CircleDollarSign,
  Bug,
  Activity,
  Clock3,
  AlertCircle,
} from "lucide-react";

import {
  getProjects,
  registerProjectResult,
} from "../services/api";


function Projects() {

  // ============================================================
  // ESTADOS
  // ============================================================

  const [projects, setProjects] = useState([]);

  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");


  // ============================================================
  // MODAL
  // ============================================================

  const [selectedProject, setSelectedProject] = useState(null);

  const [showResultModal, setShowResultModal] = useState(false);


  // ============================================================
  // FORMULARIO RESULTADO
  // ============================================================

  const [actualDays, setActualDays] = useState("");

  const [actualCost, setActualCost] = useState("");

  const [actualDefects, setActualDefects] = useState("");


  // ============================================================
  // ESTADO DEL GUARDADO
  // ============================================================

  const [savingResult, setSavingResult] = useState(false);

  const [resultError, setResultError] = useState("");


  // ============================================================
  // CARGAR PROYECTOS
  // ============================================================

  useEffect(() => {

    loadProjects();

  }, []);


  async function loadProjects() {

    try {

      setLoading(true);

      setError("");

      const data = await getProjects();

      setProjects(data);

    } catch (err) {

      console.error(err);

      setError(
        err.message ||
        "No se pudieron cargar los proyectos."
      );

    } finally {

      setLoading(false);

    }
  }


  // ============================================================
  // FILTRAR PROYECTOS
  // ============================================================

  const filteredProjects = projects.filter(
    (project) =>
      project.project_code
        ?.toLowerCase()
        .includes(search.toLowerCase())
  );


  // ============================================================
  // ABRIR MODAL
  // ============================================================

  function openResultModal(project) {

    setSelectedProject(project);

    setResultError("");

    setActualDays(
      project.actual_days !== null &&
      project.actual_days !== undefined
        ? project.actual_days
        : ""
    );

    setActualCost(
      project.actual_cost_pen !== null &&
      project.actual_cost_pen !== undefined
        ? project.actual_cost_pen
        : ""
    );

    setActualDefects(
      project.defects !== null &&
      project.defects !== undefined
        ? project.defects
        : ""
    );

    setShowResultModal(true);
  }


  // ============================================================
  // CERRAR MODAL
  // ============================================================

  function closeResultModal() {

    if (savingResult) {
      return;
    }

    setShowResultModal(false);

    setSelectedProject(null);

    setActualDays("");

    setActualCost("");

    setActualDefects("");

    setResultError("");
  }


  // ============================================================
  // REGISTRAR RESULTADO
  // ============================================================

  async function handleSaveResult(event) {

    event.preventDefault();

    if (!selectedProject) {
      return;
    }


    // ----------------------------------------------------------
    // VALIDACIONES FRONTEND
    // ----------------------------------------------------------

    if (
      actualDays === "" ||
      Number(actualDays) <= 0
    ) {

      setResultError(
        "Los días reales deben ser mayores que cero."
      );

      return;
    }


    if (
      actualCost === "" ||
      Number(actualCost) < 0
    ) {

      setResultError(
        "El costo real no puede ser negativo."
      );

      return;
    }


    if (
      actualDefects === "" ||
      Number(actualDefects) < 0
    ) {

      setResultError(
        "La cantidad de errores no puede ser negativa."
      );

      return;
    }


    try {

      setSavingResult(true);

      setResultError("");


      // --------------------------------------------------------
      // DATOS QUE ENVIAREMOS AL BACKEND
      // --------------------------------------------------------

      const resultData = {

        actual_days: Number(actualDays),

        actual_cost_pen: Number(actualCost),

        actual_defects: Number(actualDefects),

      };


      // --------------------------------------------------------
      // LLAMAR API
      // --------------------------------------------------------

      const result = await registerProjectResult(
        selectedProject.id,
        resultData
      );


      // --------------------------------------------------------
      // ACTUALIZAR PROYECTO EN EL ESTADO LOCAL
      // --------------------------------------------------------

      setProjects((currentProjects) =>

        currentProjects.map((project) =>

          project.id === selectedProject.id

            ? {
                ...project,

                actual_days:
                  result.actual_days,

                actual_cost_pen:
                  result.actual_cost_pen,

                defects:
                  result.actual_defects,

                status:
                  result.status,
              }

            : project

        )

      );


      // --------------------------------------------------------
      // CERRAR MODAL
      // --------------------------------------------------------

      setShowResultModal(false);

      setSelectedProject(null);

      setActualDays("");

      setActualCost("");

      setActualDefects("");

      setResultError("");


    } catch (err) {

      console.error(
        "Error al registrar resultado:",
        err
      );

      setResultError(
        err.message ||
        "No se pudo registrar el resultado."
      );


    } finally {

      setSavingResult(false);

    }
  }


  // ============================================================
  // RENDER
  // ============================================================

  return (

    <div className="min-h-screen bg-slate-50 text-slate-800">


      {/* ======================================================
          CONTENEDOR PRINCIPAL
      ======================================================= */}

      <div className="mx-auto max-w-7xl px-6 py-8">


        {/* ====================================================
            HEADER
        ===================================================== */}

        <div className="mb-8 flex flex-col gap-5 md:flex-row md:items-center md:justify-between">

          <div>

            <div className="flex items-center gap-3">

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 border border-blue-100">

                <FolderKanban
                  size={23}
                  className="text-blue-600"
                />

              </div>

              <div>

                <h1 className="text-2xl font-bold text-slate-900">

                  Proyectos

                </h1>

                <p className="mt-1 text-sm text-slate-500">

                  Gestión y seguimiento de proyectos de software

                </p>

              </div>

            </div>

          </div>


          {/* ==================================================
              TOTAL
          =================================================== */}

          <div className="rounded-xl border border-slate-200 bg-white px-5 py-3 shadow-sm">

            <div className="flex items-center gap-3">

              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100">

                <FolderKanban
                  size={18}
                  className="text-slate-600"
                />

              </div>

              <div>

                <p className="text-xs font-medium text-slate-500">

                  Total de proyectos

                </p>

                <p className="text-lg font-bold text-slate-900">

                  {projects.length}

                </p>

              </div>

            </div>

          </div>

        </div>


        {/* ====================================================
            BUSCADOR
        ===================================================== */}

        <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">

          <div className="relative max-w-md">

            <Search
              size={19}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="text"
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Buscar por código de proyecto..."
              className="
                w-full
                rounded-xl
                border
                border-slate-200
                bg-slate-50
                py-2.5
                pl-10
                pr-4
                text-sm
                text-slate-800
                outline-none
                transition
                placeholder:text-slate-400
                focus:border-blue-400
                focus:bg-white
                focus:ring-2
                focus:ring-blue-100
              "
            />

          </div>

        </div>


        {/* ====================================================
            ERROR GENERAL
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
            LOADING
        ===================================================== */}

        {loading ? (

          <div className="flex min-h-[350px] items-center justify-center rounded-2xl border border-slate-200 bg-white shadow-sm">

            <div className="text-center">

              <div className="mx-auto mb-4 h-9 w-9 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />

              <p className="text-sm text-slate-500">

                Cargando proyectos...

              </p>

            </div>

          </div>

        ) : (

          /* ==================================================
             TABLA
          =================================================== */

          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

            <div className="overflow-x-auto">

              <table className="w-full min-w-[950px]">

                <thead>

                  <tr className="border-b border-slate-200 bg-slate-50">

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">

                      Proyecto

                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">

                      Región

                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">

                      Servicio

                    </th>

                    <th className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wide text-slate-500">

                      Días planificados

                    </th>

                    <th className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wide text-slate-500">

                      Presupuesto

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

                  {filteredProjects.length === 0 ? (

                    <tr>

                      <td
                        colSpan="7"
                        className="px-6 py-16 text-center"
                      >

                        <div className="flex flex-col items-center">

                          <FolderKanban
                            size={40}
                            className="mb-3 text-slate-300"
                          />

                          <p className="font-medium text-slate-600">

                            No se encontraron proyectos

                          </p>

                          <p className="mt-1 text-sm text-slate-400">

                            Intenta cambiar el término de búsqueda.

                          </p>

                        </div>

                      </td>

                    </tr>

                  ) : (

                    filteredProjects.map((project) => {

                      const isFinished =
                        project.status === "finalizado";


                      return (

                        <tr
                          key={project.id}
                          className="transition hover:bg-slate-50"
                        >

                          {/* PROJECT */}

                          <td className="px-6 py-5">

                            <div className="flex items-center gap-3">

                              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50">

                                <FolderKanban
                                  size={19}
                                  className="text-blue-600"
                                />

                              </div>

                              <div>

                                <p className="font-semibold text-slate-800">

                                  {project.project_code}

                                </p>

                                <p className="mt-0.5 text-xs text-slate-400">

                                  ID #{project.id}

                                </p>

                              </div>

                            </div>

                          </td>


                          {/* REGION */}

                          <td className="px-6 py-5">

                            <span className="text-sm text-slate-600">

                              {project.region || "—"}

                            </span>

                          </td>


                          {/* SERVICE */}

                          <td className="px-6 py-5">

                            <span className="text-sm text-slate-600">

                              {project.service_line || "—"}

                            </span>

                          </td>


                          {/* PLANNED DAYS */}

                          <td className="px-6 py-5 text-center">

                            <div className="inline-flex items-center gap-2 text-sm font-medium text-slate-700">

                              <Clock3
                                size={16}
                                className="text-slate-400"
                              />

                              {project.planned_days ?? "—"}

                            </div>

                          </td>


                          {/* BUDGET */}

                          <td className="px-6 py-5 text-center">

                            <div className="inline-flex items-center gap-2 text-sm font-medium text-slate-700">

                              <CircleDollarSign
                                size={16}
                                className="text-slate-400"
                              />

                              {project.budget_pen !== null &&
                              project.budget_pen !== undefined
                                ? `S/ ${Number(
                                    project.budget_pen
                                  ).toLocaleString(
                                    "es-PE",
                                    {
                                      minimumFractionDigits: 2,
                                    }
                                  )}`
                                : "—"}

                            </div>

                          </td>


                          {/* STATUS */}

                          <td className="px-6 py-5 text-center">

                            {isFinished ? (

                              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700">

                                <CheckCircle2
                                  size={14}
                                />

                                Finalizado

                              </span>

                            ) : (

                              <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-700">

                                <Activity
                                  size={14}
                                />

                                En ejecución

                              </span>

                            )}

                          </td>


                          {/* ACTION */}

                          <td className="px-6 py-5 text-center">

                            {isFinished ? (

                              <span className="text-xs font-medium text-slate-400">

                                Resultado registrado

                              </span>

                            ) : (

                              <button
                                type="button"
                                onClick={() =>
                                  openResultModal(project)
                                }
                                className="
                                  inline-flex
                                  items-center
                                  gap-2
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
                                  hover:border-blue-300
                                  hover:bg-blue-100
                                "
                              >

                                <CheckCircle2
                                  size={15}
                                />

                                Registrar resultado

                              </button>

                            )}

                          </td>

                        </tr>

                      );

                    })

                  )}

                </tbody>

              </table>

            </div>


            {/* ==================================================
                FOOTER TABLA
            =================================================== */}

            <div className="border-t border-slate-200 bg-slate-50 px-6 py-3">

              <p className="text-xs text-slate-500">

                Mostrando{" "}

                <span className="font-semibold text-slate-700">

                  {filteredProjects.length}

                </span>{" "}

                de{" "}

                <span className="font-semibold text-slate-700">

                  {projects.length}

                </span>{" "}

                proyectos

              </p>

            </div>

          </div>

        )}

      </div>


      {/* ======================================================
          MODAL
      ======================================================= */}

      {showResultModal && selectedProject && (

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

          {/* ==================================================
              MODAL CARD
          =================================================== */}

          <div className="w-full max-w-lg overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">


            {/* =================================================
                MODAL HEADER
            ================================================== */}

            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">

              <div>

                <div className="flex items-center gap-3">

                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50">

                    <FolderKanban
                      size={19}
                      className="text-blue-600"
                    />

                  </div>

                  <div>

                    <h2 className="text-lg font-bold text-slate-900">

                      Registrar resultado

                    </h2>

                    <p className="text-xs text-slate-500">

                      {selectedProject.project_code}

                    </p>

                  </div>

                </div>

              </div>


              <button
                type="button"
                onClick={closeResultModal}
                disabled={savingResult}
                className="
                  rounded-lg
                  p-2
                  text-slate-400
                  transition
                  hover:bg-slate-100
                  hover:text-slate-600
                  disabled:cursor-not-allowed
                  disabled:opacity-50
                "
              >

                <X size={20} />

              </button>

            </div>


            {/* =================================================
                MODAL BODY
            ================================================== */}

            <form
              onSubmit={handleSaveResult}
              className="p-6"
            >

              {/* =================================================
                  INFO PROYECTO
              ================================================== */}

              <div className="mb-6 grid grid-cols-2 gap-3">

                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">

                  <div className="mb-1 flex items-center gap-2">

                    <Clock3
                      size={15}
                      className="text-slate-400"
                    />

                    <span className="text-xs font-medium text-slate-500">

                      Días planificados

                    </span>

                  </div>

                  <p className="text-lg font-bold text-slate-800">

                    {selectedProject.planned_days ?? "—"}

                  </p>

                </div>


                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">

                  <div className="mb-1 flex items-center gap-2">

                    <CircleDollarSign
                      size={15}
                      className="text-slate-400"
                    />

                    <span className="text-xs font-medium text-slate-500">

                      Presupuesto

                    </span>

                  </div>

                  <p className="text-lg font-bold text-slate-800">

                    {selectedProject.budget_pen !== null &&
                    selectedProject.budget_pen !== undefined
                      ? `S/ ${Number(
                          selectedProject.budget_pen
                        ).toLocaleString(
                          "es-PE",
                          {
                            minimumFractionDigits: 2,
                          }
                        )}`
                      : "—"}

                  </p>

                </div>

              </div>


              {/* =================================================
                  CAMPOS
              ================================================== */}

              <div className="space-y-5">


                {/* DIAS */}

                <div>

                  <label className="mb-2 block text-sm font-semibold text-slate-700">

                    Días reales

                  </label>

                  <div className="relative">

                    <Clock3
                      size={18}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      type="number"
                      min="1"
                      value={actualDays}
                      onChange={(event) =>
                        setActualDays(
                          event.target.value
                        )
                      }
                      disabled={savingResult}
                      placeholder="Ej. 120"
                      className="
                        w-full
                        rounded-xl
                        border
                        border-slate-200
                        bg-white
                        py-3
                        pl-10
                        pr-4
                        text-sm
                        text-slate-800
                        outline-none
                        transition
                        placeholder:text-slate-400
                        focus:border-blue-400
                        focus:ring-2
                        focus:ring-blue-100
                        disabled:cursor-not-allowed
                        disabled:bg-slate-50
                      "
                    />

                  </div>

                </div>


                {/* COSTO */}

                <div>

                  <label className="mb-2 block text-sm font-semibold text-slate-700">

                    Costo real

                  </label>

                  <div className="relative">

                    <CircleDollarSign
                      size={18}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={actualCost}
                      onChange={(event) =>
                        setActualCost(
                          event.target.value
                        )
                      }
                      disabled={savingResult}
                      placeholder="Ej. 15000.00"
                      className="
                        w-full
                        rounded-xl
                        border
                        border-slate-200
                        bg-white
                        py-3
                        pl-10
                        pr-4
                        text-sm
                        text-slate-800
                        outline-none
                        transition
                        placeholder:text-slate-400
                        focus:border-blue-400
                        focus:ring-2
                        focus:ring-blue-100
                        disabled:cursor-not-allowed
                        disabled:bg-slate-50
                      "
                    />

                  </div>

                </div>


                {/* ERRORES */}

                <div>

                  <label className="mb-2 block text-sm font-semibold text-slate-700">

                    Errores detectados

                  </label>

                  <div className="relative">

                    <Bug
                      size={18}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      type="number"
                      min="0"
                      step="1"
                      value={actualDefects}
                      onChange={(event) =>
                        setActualDefects(
                          event.target.value
                        )
                      }
                      disabled={savingResult}
                      placeholder="Ej. 15"
                      className="
                        w-full
                        rounded-xl
                        border
                        border-slate-200
                        bg-white
                        py-3
                        pl-10
                        pr-4
                        text-sm
                        text-slate-800
                        outline-none
                        transition
                        placeholder:text-slate-400
                        focus:border-blue-400
                        focus:ring-2
                        focus:ring-blue-100
                        disabled:cursor-not-allowed
                        disabled:bg-slate-50
                      "
                    />

                  </div>

                </div>

              </div>


              {/* =================================================
                  ERROR DEL MODAL
              ================================================== */}

              {resultError && (

                <div className="mt-5 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4">

                  <AlertCircle
                    size={18}
                    className="mt-0.5 shrink-0 text-red-500"
                  />

                  <div>

                    <p className="text-sm font-semibold text-red-700">

                      No se pudo registrar

                    </p>

                    <p className="mt-1 text-xs leading-5 text-red-600">

                      {resultError}

                    </p>

                  </div>

                </div>

              )}


              {/* =================================================
                  ADVERTENCIA
              ================================================== */}

              <div className="mt-5 rounded-xl border border-amber-200 bg-amber-50 p-4">

                <p className="text-xs leading-5 text-amber-700">

                  Al guardar el resultado, el proyecto pasará
                  automáticamente al estado{" "}

                  <span className="font-bold">
                    Finalizado
                  </span>

                  {" "}y los valores registrados se utilizarán
                  para calcular los indicadores reales.

                </p>

              </div>


              {/* =================================================
                  BOTONES
              ================================================== */}

              <div className="mt-6 flex justify-end gap-3">

                <button
                  type="button"
                  onClick={closeResultModal}
                  disabled={savingResult}
                  className="
                    rounded-xl
                    border
                    border-slate-200
                    bg-white
                    px-4
                    py-2.5
                    text-sm
                    font-semibold
                    text-slate-600
                    transition
                    hover:bg-slate-50
                    disabled:cursor-not-allowed
                    disabled:opacity-50
                  "
                >

                  Cancelar

                </button>


                <button
                  type="submit"
                  disabled={savingResult}
                  className="
                    inline-flex
                    items-center
                    justify-center
                    gap-2
                    rounded-xl
                    bg-blue-600
                    px-5
                    py-2.5
                    text-sm
                    font-semibold
                    text-white
                    shadow-sm
                    transition
                    hover:bg-blue-700
                    disabled:cursor-not-allowed
                    disabled:opacity-60
                  "
                >

                  {savingResult ? (

                    <>

                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />

                      Guardando...

                    </>

                  ) : (

                    <>

                      <Save size={17} />

                      Finalizar proyecto

                    </>

                  )}

                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </div>

  );
}


export default Projects;