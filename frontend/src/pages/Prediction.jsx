import { useState } from "react";
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
  ArrowUpRight,
  AlertCircle,
} from "lucide-react";

import { predictProject } from "../services/api";

const REGIONES = [
  "Arequipa",
  "Cajamarca",
  "Cusco",
  "Huancayo",
  "Iquitos",
  "Lima",
  "Piura",
  "Puno",
  "Tacna",
  "Trujillo",
];

const SERVICE_LINES = [
  "Audiovisual",
  "Business Proc",
  "Project Mgmt",
  "Videoconference",
];

const PM_CODES = [
  "PM_MEZA",
  "PM_PEREZ",
  "PM_RIVAS",
  "PM_SOTO",
  "PM_VEGA",
];

const SYS_NODES = [
  "SRV-NODE-1",
  "SRV-NODE-2",
  "SRV-NODE-3",
  "SRV-NODE-4",
  "SRV-NODE-5",
  "SRV-NODE-6",
  "SRV-NODE-7",
  "SRV-NODE-8",
  "SRV-NODE-9",
  "SRV-NODE-10",
];

function Prediction() {
  const [form, setForm] = useState({
    planned_days: 120,
    budget_pen: 80000,
    kloc: 25,
    region: "Lima",
    service_line: "Project Mgmt",
    pm_code: "PM_MEZA",
    sys_node: "SRV-NODE-1",
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const data = await predictProject({
        ...form,
        planned_days: Number(form.planned_days),
        budget_pen: Number(form.budget_pen),
        kloc: Number(form.kloc),
      });

      setResult(data);
    } catch (err) {
      console.error(err);

      setError(
        "No se pudo obtener la predicción. Verifique que el backend esté ejecutándose."
      );
    } finally {
      setLoading(false);
    }
  }

  function getIndicatorStyle(value, type) {
    let positive = false;

    if (type === "delay" || type === "cost") {
      positive = value <= 0;
    }

    if (type === "defects") {
      positive = value <= 0.5;
    }

    return positive
      ? "border-emerald-200 bg-emerald-50 text-emerald-700"
      : "border-amber-200 bg-amber-50 text-amber-700";
  }

  return (
    <div className="space-y-8 pb-10">
      {/* HEADER */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2 text-sm font-medium text-blue-600">
            <Sparkles size={16} />
            Inteligencia predictiva
          </div>

          <h2 className="text-3xl font-bold tracking-tight text-slate-900">
            Nueva predicción
          </h2>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
            Configure las características iniciales del proyecto para estimar
            su duración, costo y cantidad de defectos mediante los modelos de
            Machine Learning.
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-medium text-slate-500 shadow-sm">
          <span className="h-2 w-2 rounded-full bg-emerald-500" />
          Modelos disponibles
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        {/* FORMULARIO */}

        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white px-6 py-5">
            <div className="flex items-center gap-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-white shadow-lg shadow-blue-600/20">
                <BrainCircuit size={21} />
              </div>

              <div>
                <h3 className="font-semibold text-slate-900">
                  Información del proyecto
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  Variables utilizadas por el modelo predictivo.
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-6">
            {/* MÉTRICAS NUMÉRICAS */}

            <div className="mb-7">
              <h4 className="mb-4 text-xs font-semibold uppercase tracking-wider text-slate-400">
                Parámetros principales
              </h4>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <InputField
                  label="Días planificados"
                  name="planned_days"
                  type="number"
                  min="1"
                  value={form.planned_days}
                  onChange={handleChange}
                  icon={<Clock3 size={17} />}
                />

                <InputField
                  label="Presupuesto"
                  name="budget_pen"
                  type="number"
                  min="1"
                  value={form.budget_pen}
                  onChange={handleChange}
                  icon={<Wallet size={17} />}
                  prefix="S/"
                />

                <InputField
                  label="Tamaño"
                  name="kloc"
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={form.kloc}
                  onChange={handleChange}
                  icon={<Bug size={17} />}
                  suffix="KLOC"
                />
              </div>
            </div>

            {/* CARACTERÍSTICAS */}

            <div>
              <h4 className="mb-4 text-xs font-semibold uppercase tracking-wider text-slate-400">
                Características del proyecto
              </h4>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <SelectField
                  label="Región"
                  name="region"
                  value={form.region}
                  onChange={handleChange}
                  options={REGIONES}
                  icon={<MapPin size={17} />}
                />

                <SelectField
                  label="Línea de servicio"
                  name="service_line"
                  value={form.service_line}
                  onChange={handleChange}
                  options={SERVICE_LINES}
                  icon={<BriefcaseBusiness size={17} />}
                />

                <SelectField
                  label="Project Manager"
                  name="pm_code"
                  value={form.pm_code}
                  onChange={handleChange}
                  options={PM_CODES}
                  icon={<UserRound size={17} />}
                />

                <SelectField
                  label="Nodo del sistema"
                  name="sys_node"
                  value={form.sys_node}
                  onChange={handleChange}
                  options={SYS_NODES}
                  icon={<Server size={17} />}
                />
              </div>
            </div>

            {/* ERROR */}

            {error && (
              <div className="mt-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                <AlertCircle size={18} className="mt-0.5 shrink-0" />

                <div>
                  <p className="font-semibold">No se pudo realizar la predicción</p>
                  <p className="mt-1 text-red-600">{error}</p>
                </div>
              </div>
            )}

            {/* BOTÓN */}

            <button
              type="submit"
              disabled={loading}
              className="mt-7 flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-slate-900/10 transition-all hover:bg-blue-600 hover:shadow-blue-600/20 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Analizando proyecto...
                </>
              ) : (
                <>
                  <BrainCircuit size={18} />
                  Ejecutar predicción
                  <ArrowUpRight size={17} />
                </>
              )}
            </button>

            <p className="mt-3 text-center text-xs text-slate-400">
              La respuesta es una estimación generada por los modelos entrenados.
            </p>
          </form>
        </section>

        {/* RESULTADOS */}

        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          {!result ? (
            <EmptyResult />
          ) : (
            <PredictionResult
              result={result}
              getIndicatorStyle={getIndicatorStyle}
            />
          )}
        </section>
      </div>
    </div>
  );
}

/* ============================================================
   INPUT
============================================================ */

function InputField({
  label,
  name,
  type,
  value,
  onChange,
  icon,
  min,
  step,
  prefix,
  suffix,
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-slate-700">
        {label}
      </label>

      <div className="relative">
        <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
          {icon}
        </div>

        {prefix && (
          <span className="pointer-events-none absolute left-10 top-1/2 -translate-y-1/2 text-xs font-medium text-slate-400">
            {prefix}
          </span>
        )}

        <input
          type={type}
          name={name}
          min={min}
          step={step}
          value={value}
          onChange={onChange}
          required
          className={`w-full rounded-xl border border-slate-200 bg-slate-50 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 ${
            prefix ? "pl-16" : "pl-10"
          } ${suffix ? "pr-16" : "pr-3"}`}
        />

        {suffix && (
          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-slate-400">
            {suffix}
          </span>
        )}
      </div>
    </div>
  );
}

/* ============================================================
   SELECT
============================================================ */

function SelectField({
  label,
  name,
  value,
  onChange,
  options,
  icon,
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-slate-700">
        {label}
      </label>

      <div className="relative">
        <div className="pointer-events-none absolute left-3 top-1/2 z-10 -translate-y-1/2 text-slate-400">
          {icon}
        </div>

        <select
          name={name}
          value={value}
          onChange={onChange}
          className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 px-10 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
        >
          {options.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>

        <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
          ▾
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   ESTADO VACÍO
============================================================ */

function EmptyResult() {
  return (
    <div className="flex min-h-[600px] flex-col items-center justify-center px-8 text-center">
      <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
        <BrainCircuit size={30} />
      </div>

      <h3 className="text-lg font-semibold text-slate-900">
        Esperando una predicción
      </h3>

      <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500">
        Complete los datos del proyecto y ejecute el análisis para obtener las
        estimaciones de tiempo, presupuesto y calidad.
      </p>

      <div className="mt-8 grid w-full max-w-sm grid-cols-3 gap-3">
        <MiniFeature icon={<Clock3 size={16} />} text="Tiempo" />
        <MiniFeature icon={<Wallet size={16} />} text="Costo" />
        <MiniFeature icon={<Bug size={16} />} text="Calidad" />
      </div>
    </div>
  );
}

function MiniFeature({ icon, text }) {
  return (
    <div className="rounded-xl border border-slate-100 bg-slate-50 p-3">
      <div className="mb-1 flex justify-center text-slate-400">
        {icon}
      </div>

      <span className="text-xs font-medium text-slate-500">
        {text}
      </span>
    </div>
  );
}

/* ============================================================
   RESULTADO
============================================================ */

function PredictionResult({ result, getIndicatorStyle }) {
  const predictions = result.predicciones;
  const indicators = result.indicadores;

  return (
    <div>
      <div className="border-b border-slate-100 bg-gradient-to-br from-blue-600 via-blue-600 to-indigo-700 px-6 py-6 text-white">
        <div className="flex items-start justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2 text-blue-100">
              <Sparkles size={16} />

              <span className="text-xs font-semibold uppercase tracking-wider">
                Análisis completado
              </span>
            </div>

            <h3 className="text-xl font-bold">
              Resultado de la predicción
            </h3>

            <p className="mt-1 text-sm text-blue-100">
              Estimaciones generadas por Machine Learning.
            </p>
          </div>

          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10">
            <BrainCircuit size={20} />
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 xl:grid-cols-1">
          <PredictionCard
            icon={<Clock3 size={19} />}
            label="Días reales estimados"
            value={predictions.actual_days.toFixed(2)}
            unit="días"
            color="blue"
          />

          <PredictionCard
            icon={<Wallet size={19} />}
            label="Costo real estimado"
            value={`S/ ${predictions.actual_cost_pen.toLocaleString(
              "es-PE",
              {
                minimumFractionDigits: 2,
              }
            )}`}
            color="emerald"
          />

          <PredictionCard
            icon={<Bug size={19} />}
            label="Defectos estimados"
            value={predictions.defects.toFixed(2)}
            unit="defectos"
            color="violet"
          />
        </div>

        <div className="mt-7 border-t border-slate-100 pt-6">
          <div className="mb-4">
            <h4 className="font-semibold text-slate-900">
              Indicadores de desempeño
            </h4>

            <p className="mt-1 text-xs text-slate-500">
              Indicadores calculados a partir de los valores predichos.
            </p>
          </div>

          <div className="space-y-3">
            <IndicatorCard
              label="Porcentaje de retraso"
              value={`${indicators.retraso_porcentaje.toFixed(2)}%`}
              icon={<Clock3 size={17} />}
              style={getIndicatorStyle(
                indicators.retraso_porcentaje,
                "delay"
              )}
            />

            <IndicatorCard
              label="Porcentaje de sobrecosto"
              value={`${indicators.sobrecosto_porcentaje.toFixed(2)}%`}
              icon={<Wallet size={17} />}
              style={getIndicatorStyle(
                indicators.sobrecosto_porcentaje,
                "cost"
              )}
            />

            <IndicatorCard
              label="Densidad de defectos"
              value={indicators.densidad_defectos.toFixed(3)}
              icon={<Bug size={17} />}
              style={getIndicatorStyle(
                indicators.densidad_defectos,
                "defects"
              )}
            />
          </div>
        </div>

        <div className="mt-6 rounded-xl border border-blue-100 bg-blue-50 p-4">
          <div className="flex gap-3">
            <BrainCircuit
              size={18}
              className="mt-0.5 shrink-0 text-blue-600"
            />

            <div>
              <p className="text-sm font-semibold text-blue-900">
                Interpretación
              </p>

              <p className="mt-1 text-xs leading-5 text-blue-700">
                Los valores mostrados corresponden a estimaciones del modelo
                predictivo y sirven como apoyo para el análisis del desempeño
                esperado del proyecto.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   TARJETA DE PREDICCIÓN
============================================================ */

function PredictionCard({
  icon,
  label,
  value,
  unit,
  color,
}) {
  const colors = {
    blue: "bg-blue-50 text-blue-600",
    emerald: "bg-emerald-50 text-emerald-600",
    violet: "bg-violet-50 text-violet-600",
  };

  return (
    <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
      <div className="flex items-center gap-3">
        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${colors[color]}`}
        >
          {icon}
        </div>

        <div className="min-w-0">
          <span className="block text-xs font-medium uppercase tracking-wide text-slate-400">
            {label}
          </span>

          <div className="mt-1 flex items-baseline gap-1">
            <strong className="text-xl font-bold tracking-tight text-slate-900">
              {value}
            </strong>

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

/* ============================================================
   INDICADOR
============================================================ */

function IndicatorCard({
  label,
  value,
  icon,
  style,
}) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-slate-100 bg-white p-3.5">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-50 text-slate-500">
          {icon}
        </div>

        <span className="text-sm font-medium text-slate-700">
          {label}
        </span>
      </div>

      <span
        className={`rounded-lg border px-3 py-1.5 text-sm font-bold ${style}`}
      >
        {value}
      </span>
    </div>
  );
}

export default Prediction;
