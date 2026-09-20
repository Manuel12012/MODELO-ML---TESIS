
import { useEffect, useState } from "react";

import {
  BrainCircuit,
  Loader2,
  Clock3,
  Wallet,
  Bug,
  MapPin,
  BriefcaseBusiness,
  UserRound,
  Server,
  Sparkles,
  AlertCircle,
  FolderKanban,
} from "lucide-react";

import {
  getProjects,
  predictProjectById,
} from "../services/api";


function Prediction() {
  // ============================================================
  // ESTADOS
  // ============================================================

  const [projects, setProjects] = useState([]);

  const [selectedProjectId, setSelectedProjectId] = useState("");

  const [selectedProject, setSelectedProject] = useState(null);

  const [prediction, setPrediction] = useState(null);

  const [loadingProjects, setLoadingProjects] = useState(true);

  const [loadingPrediction, setLoadingPrediction] = useState(false);

  const [error, setError] = useState("");


  // ============================================================
  // CARGAR PROYECTOS DESDE POSTGRESQL
  // ============================================================

  useEffect(() => {
    async function loadProjects() {
      try {
        setLoadingProjects(true);
        setError("");

        const data = await getProjects();

        setProjects(data);
      } catch (err) {
        console.error(err);

        setError(
          "No se pudieron cargar los proyectos."
        );
      } finally {
        setLoadingProjects(false);
      }
    }

    loadProjects();
  }, []);


  // ============================================================
  // SELECCIONAR PROYECTO
  // ============================================================

  function handleProjectChange(event) {
    const projectId = event.target.value;

    setSelectedProjectId(projectId);

    // Limpiamos la predicción anterior
    setPrediction(null);

    setError("");

    if (!projectId) {
      setSelectedProject(null);
      return;
    }

    const project = projects.find(
      (item) =>
        String(item.id) === String(projectId)
    );

    setSelectedProject(project || null);
  }


  // ============================================================
  // EJECUTAR PREDICCIÓN
  // ============================================================

  async function handlePrediction() {
    if (!selectedProjectId) {
      setError(
        "Seleccione un proyecto antes de realizar la predicción."
      );

      return;
    }

    try {
      setLoadingPrediction(true);
      setError("");

      const result = await predictProjectById(
        selectedProjectId
      );

      setPrediction(result);
    } catch (err) {
      console.error(err);

      setError(
        "No se pudo realizar la predicción."
      );
    } finally {
      setLoadingPrediction(false);
    }
  }


  return (
    <div className="space-y-8">


      {/* ======================================================
          ENCABEZADO
      ====================================================== */}

      <div>
        <div className="mb-2 flex items-center gap-2 text-sm font-medium text-blue-600">
          <BrainCircuit size={17} />

          Predicción mediante Machine Learning
        </div>

        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          Nueva predicción
        </h1>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
          Seleccione un proyecto registrado para generar una
          estimación de su desempeño mediante el modelo
          predictivo.
        </p>
      </div>


      {/* ======================================================
          CONTENEDOR PRINCIPAL
      ====================================================== */}

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">


        {/* ====================================================
            PANEL IZQUIERDO
        ==================================================== */}

        <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">


          {/* HEADER */}

          <div className="border-b border-slate-100 px-6 py-5">

            <div className="flex items-center gap-3">

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <FolderKanban size={21} />
              </div>

              <div>
                <h2 className="font-semibold text-slate-900">
                  Seleccionar proyecto
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Seleccione un proyecto para analizar.
                </p>
              </div>

            </div>

          </div>


          {/* CONTENIDO */}

          <div className="p-6">


            {/* ==================================================
                COMBOBOX
            ================================================== */}

            <label
              htmlFor="project"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Proyecto
            </label>

            <div className="relative">

              <select
                id="project"
                value={selectedProjectId}
                onChange={handleProjectChange}
                disabled={
                  loadingProjects ||
                  loadingPrediction
                }
                className="w-full appearance-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 disabled:cursor-not-allowed disabled:bg-slate-50"
              >

                <option value="">
                  {loadingProjects
                    ? "Cargando proyectos..."
                    : "Seleccione un proyecto..."}
                </option>

                {projects.map((project) => (
                  <option
                    key={project.id}
                    value={project.id}
                  >
                    {project.project_code}
                    {" — "}
                    {project.region}
                  </option>
                ))}

              </select>

              <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
                ▼
              </span>

            </div>


            {/* ==================================================
                DATOS DEL PROYECTO
            ================================================== */}

            {selectedProject && (

              <div className="mt-7">

                <div className="mb-4 flex items-center justify-between">

                  <div>
                    <h3 className="font-semibold text-slate-900">
                      Datos del proyecto
                    </h3>

                    <p className="mt-1 text-xs text-slate-500">
                      Información utilizada por el modelo.
                    </p>
                  </div>

                  <span className="rounded-lg bg-slate-100 px-3 py-1 text-xs font-medium text-slate-500">
                    ID #{selectedProject.id}
                  </span>

                </div>


                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">


                  <DataField
                    icon={<Clock3 size={17} />}
                    label="Días planificados"
                    value={
                      selectedProject.planned_days
                        ? `${selectedProject.planned_days} días`
                        : "—"
                    }
                  />


                  <DataField
                    icon={<Wallet size={17} />}
                    label="Presupuesto"
                    value={
                      selectedProject.budget_pen !== null &&
                      selectedProject.budget_pen !== undefined
                        ? `S/ ${Number(
                            selectedProject.budget_pen
                          ).toLocaleString("es-PE", {
                            minimumFractionDigits: 2,
                          })}`
                        : "—"
                    }
                  />


                  <DataField
                    icon={<Bug size={17} />}
                    label="Tamaño del proyecto"
                    value={
                      selectedProject.kloc !== null &&
                      selectedProject.kloc !== undefined
                        ? `${selectedProject.kloc} KLOC`
                        : "—"
                    }
                  />


                  <DataField
                    icon={<MapPin size={17} />}
                    label="Región"
                    value={selectedProject.region || "—"}
                  />


                  <DataField
                    icon={<BriefcaseBusiness size={17} />}
                    label="Línea de servicio"
                    value={
                      selectedProject.service_line || "—"
                    }
                  />


                  <DataField
                    icon={<UserRound size={17} />}
                    label="Project Manager"
                    value={
                      selectedProject.pm_code || "—"
                    }
                  />


                  <DataField
                    icon={<Server size={17} />}
                    label="Nodo del sistema"
                    value={
                      selectedProject.sys_node || "—"
                    }
                  />


                  <DataField
                    icon={<FolderKanban size={17} />}
                    label="Código ERP"
                    value={
                      selectedProject.erp_id || "—"
                    }
                  />

                </div>


                {/* ==================================================
                    BOTÓN
                ================================================== */}

                <button
                  type="button"
                  onClick={handlePrediction}
                  disabled={loadingPrediction}
                  className="mt-7 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                >

                  {loadingPrediction ? (
                    <>
                      <Loader2
                        size={18}
                        className="animate-spin"
                      />

                      Ejecutando predicción...
                    </>
                  ) : (
                    <>
                      <BrainCircuit size={18} />

                      Ejecutar predicción
                    </>
                  )}

                </button>


                <p className="mt-3 text-center text-xs text-slate-400">
                  La predicción se realizará utilizando el modelo
                  de Machine Learning entrenado.
                </p>

              </div>

            )}


            {/* ==================================================
                SIN PROYECTO
            ================================================== */}

            {!selectedProject && !loadingProjects && (

              <div className="mt-6 rounded-xl border border-dashed border-slate-200 bg-slate-50 px-5 py-8 text-center">

                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-white text-slate-400 shadow-sm">
                  <FolderKanban size={22} />
                </div>

                <h3 className="mt-4 text-sm font-semibold text-slate-700">
                  Ningún proyecto seleccionado
                </h3>

                <p className="mx-auto mt-1 max-w-sm text-xs leading-5 text-slate-500">
                  Seleccione un proyecto en la lista superior
                  para visualizar sus datos y ejecutar la predicción.
                </p>

              </div>

            )}


            {/* ==================================================
                ERROR
            ================================================== */}

            {error && (

              <div className="mt-5 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4">

                <AlertCircle
                  size={18}
                  className="mt-0.5 shrink-0 text-red-600"
                />

                <div>
                  <p className="text-sm font-semibold text-red-800">
                    Error
                  </p>

                  <p className="mt-1 text-xs leading-5 text-red-700">
                    {error}
                  </p>
                </div>

              </div>

            )}

          </div>

        </section>


        {/* ====================================================
            PANEL DERECHO — RESULTADOS
        ==================================================== */}

        <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">


          {!prediction ? (

            <EmptyPrediction />

          ) : (

            <PredictionResults
              prediction={prediction}
            />

          )}

        </section>

      </div>

    </div>
  );
}


/* ==============================================================
   CAMPO DE DATOS
============================================================== */

function DataField({
  icon,
  label,
  value,
}) {
  return (
    <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">

      <div className="flex items-center gap-3">

        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-slate-500 shadow-sm">
          {icon}
        </div>

        <div className="min-w-0">

          <p className="text-xs font-medium text-slate-400">
            {label}
          </p>

          <p className="mt-1 truncate text-sm font-semibold text-slate-800">
            {value}
          </p>

        </div>

      </div>

    </div>
  );
}


/* ==============================================================
   ESTADO INICIAL DE RESULTADOS
============================================================== */

function EmptyPrediction() {
  return (
    <div className="flex min-h-[600px] flex-col items-center justify-center px-8 text-center">

      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
        <BrainCircuit size={30} />
      </div>

      <h2 className="mt-5 text-lg font-semibold text-slate-900">
        Resultado de la predicción
      </h2>

      <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500">
        Seleccione un proyecto y ejecute la predicción.
        Los resultados generados por el modelo aparecerán aquí.
      </p>


      <div className="mt-8 grid w-full max-w-sm grid-cols-3 gap-3">

        <ResultType
          icon={<Clock3 size={17} />}
          text="Tiempo"
        />

        <ResultType
          icon={<Wallet size={17} />}
          text="Costo"
        />

        <ResultType
          icon={<Bug size={17} />}
          text="Calidad"
        />

      </div>

    </div>
  );
}


/* ==============================================================
   TIPO DE RESULTADO
============================================================== */

function ResultType({
  icon,
  text,
}) {
  return (
    <div className="rounded-xl border border-slate-100 bg-slate-50 p-3">

      <div className="flex justify-center text-slate-400">
        {icon}
      </div>

      <p className="mt-2 text-xs font-medium text-slate-500">
        {text}
      </p>

    </div>
  );
}


/* ==============================================================
   RESULTADOS
============================================================== */

function PredictionResults({
  prediction,
}) {
  const predicciones = prediction.predicciones;

  const indicadores = prediction.indicadores;


  return (
    <div>


      {/* ==================================================
          HEADER RESULTADO
      ================================================== */}

      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-6 text-white">

        <div className="flex items-start justify-between">

          <div>

            <div className="mb-2 flex items-center gap-2 text-blue-100">

              <Sparkles size={16} />

              <span className="text-xs font-semibold uppercase tracking-wider">
                Análisis completado
              </span>

            </div>

            <h2 className="text-xl font-bold">
              Resultado de la predicción
            </h2>

            <p className="mt-1 text-sm text-blue-100">
              Estimaciones generadas mediante Machine Learning.
            </p>

          </div>

          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10">
            <BrainCircuit size={20} />
          </div>

        </div>

      </div>


      {/* ==================================================
          CONTENIDO
      ================================================== */}

      <div className="space-y-6 p-6">


        {/* ==================================================
            PREDICCIONES
        ================================================== */}

        <div>

          <h3 className="font-semibold text-slate-900">
            Predicciones
          </h3>

          <p className="mt-1 text-xs text-slate-500">
            Valores estimados por los modelos entrenados.
          </p>

        </div>


        <div className="grid grid-cols-1 gap-3">


          <PredictionCard
            icon={<Clock3 size={20} />}
            title="Días reales estimados"
            value={Number(
              predicciones.actual_days
            ).toFixed(2)}
            unit="días"
            type="blue"
          />


          <PredictionCard
            icon={<Wallet size={20} />}
            title="Costo real estimado"
            value={`S/ ${Number(
              predicciones.actual_cost_pen
            ).toLocaleString("es-PE", {
              minimumFractionDigits: 2,
            })}`}
            type="green"
          />


          <PredictionCard
            icon={<Bug size={20} />}
            title="Defectos estimados"
            value={Number(
              predicciones.defects
            ).toFixed(2)}
            unit="defectos"
            type="purple"
          />

        </div>


        {/* ==================================================
            INDICADORES
        ================================================== */}

        <div className="border-t border-slate-100 pt-6">

          <h3 className="font-semibold text-slate-900">
            Indicadores de desempeño
          </h3>

          <p className="mt-1 text-xs text-slate-500">
            Calculados a partir de las predicciones obtenidas.
          </p>


          <div className="mt-4 space-y-3">


            <Indicator
              icon={<Clock3 size={17} />}
              title="Retraso"
              value={`${Number(
                indicadores.retraso_porcentaje
              ).toFixed(2)} %`}
            />


            <Indicator
              icon={<Wallet size={17} />}
              title="Sobrecosto"
              value={`${Number(
                indicadores.sobrecosto_porcentaje
              ).toFixed(2)} %`}
            />


            <Indicator
              icon={<Bug size={17} />}
              title="Densidad de defectos"
              value={Number(
                indicadores.densidad_defectos
              ).toFixed(3)}
            />

          </div>

        </div>


        {/* ==================================================
            INFORMACIÓN
        ================================================== */}

        <div className="rounded-xl border border-blue-100 bg-blue-50 p-4">

          <div className="flex gap-3">

            <BrainCircuit
              size={18}
              className="mt-0.5 shrink-0 text-blue-600"
            />

            <div>

              <p className="text-sm font-semibold text-blue-900">
                Resultado generado
              </p>

              <p className="mt-1 text-xs leading-5 text-blue-700">
                La estimación corresponde a los valores calculados
                por el modelo predictivo para el proyecto seleccionado.
              </p>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}


/* ==============================================================
   TARJETA DE PREDICCIÓN
============================================================== */

function PredictionCard({
  icon,
  title,
  value,
  unit,
  type,
}) {

  const styles = {
    blue: "bg-blue-50 text-blue-600",
    green: "bg-emerald-50 text-emerald-600",
    purple: "bg-purple-50 text-purple-600",
  };


  return (
    <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">

      <div className="flex items-center gap-4">

        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${styles[type]}`}
        >
          {icon}
        </div>

        <div className="min-w-0">

          <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
            {title}
          </p>

          <div className="mt-1 flex items-baseline gap-1.5">

            <span className="text-xl font-bold tracking-tight text-slate-900">
              {value}
            </span>

            {unit && (
              <span className="text-xs text-slate-400">
                {unit}
              </span>
            )}

          </div>

        </div>

      </div>

    </div>
  );
}


/* ==============================================================
   INDICADOR
============================================================== */

function Indicator({
  icon,
  title,
  value,
}) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-slate-100 bg-white p-4">

      <div className="flex items-center gap-3">

        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-50 text-slate-500">
          {icon}
        </div>

        <span className="text-sm font-medium text-slate-700">
          {title}
        </span>

      </div>

      <span className="rounded-lg bg-slate-100 px-3 py-1.5 text-sm font-bold text-slate-800">
        {value}
      </span>

    </div>
  );
}


export default Prediction;
