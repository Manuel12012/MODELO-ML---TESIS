import {
    Plus,
    Search,
    FolderKanban,
    ArrowUpRight,
    Clock3,
    Wallet,
    Bug,
    Database,
} from "lucide-react";

import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

function Projects() {
    const navigate = useNavigate();

    const [search, setSearch] = useState("");

    // ------------------------------------------------------------
    // DATOS TEMPORALES
    // ------------------------------------------------------------
    // Posteriormente estos datos vendrán desde la base de datos.
    const projects = [];

    const filteredProjects = useMemo(() => {
        return projects.filter((project) =>
            project.name
                .toLowerCase()
                .includes(search.toLowerCase())
        );
    }, [search, projects]);

    return (
        <div className="space-y-8 pb-10">

            {/* ======================================================
            HEADER
        ====================================================== */}

            <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">

                <div>

                    <div className="mb-2 flex items-center gap-2 text-sm font-medium text-blue-600">
                        <FolderKanban size={16} />

                        Gestión de proyectos
                    </div>

                    <h2 className="text-3xl font-bold tracking-tight text-slate-900">
                        Proyectos
                    </h2>

                    <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                        Consulte y gestione las evaluaciones predictivas de los
                        proyectos de software.
                    </p>

                </div>


                <button
                    onClick={() => navigate("/prediccion")}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-900/10 transition-all hover:bg-blue-600 hover:shadow-blue-600/20"
                >
                    <Plus size={18} />

                    Nueva predicción

                    <ArrowUpRight size={16} />
                </button>

            </div>


            {/* ======================================================
            RESUMEN
        ====================================================== */}

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">

                <SummaryCard
                    icon={<FolderKanban size={19} />}
                    label="Proyectos registrados"
                    value={projects.length}
                    color="blue"
                />

                <SummaryCard
                    icon={<Clock3 size={19} />}
                    label="Evaluaciones predictivas"
                    value="0"
                    color="violet"
                />

                <SummaryCard
                    icon={<Database size={19} />}
                    label="Fuente de información"
                    value="ML"
                    color="emerald"
                />

            </div>


            {/* ======================================================
            CONTENEDOR PRINCIPAL
        ====================================================== */}

            <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

                {/* TOOLBAR */}

                <div className="flex flex-col gap-4 border-b border-slate-100 bg-slate-50/70 p-5 sm:flex-row sm:items-center sm:justify-between">

                    <div>

                        <h3 className="font-semibold text-slate-900">
                            Evaluaciones de proyectos
                        </h3>

                        <p className="mt-1 text-xs text-slate-500">
                            Historial de proyectos analizados por el sistema.
                        </p>

                    </div>


                    <div className="relative w-full sm:w-72">

                        <Search
                            size={17}
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                        />

                        <input
                            type="text"
                            value={search}
                            onChange={(event) =>
                                setSearch(event.target.value)
                            }
                            placeholder="Buscar proyecto..."
                            className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                        />

                    </div>

                </div>


                {/* ====================================================
              TABLA / EMPTY STATE
          ==================================================== */}

                {filteredProjects.length === 0 ? (

                    <EmptyState
                        hasSearch={search.length > 0}
                        onCreate={() => navigate("/prediccion")}
                    />

                ) : (

                    <ProjectTable projects={filteredProjects} />

                )}

            </section>


            {/* ======================================================
            INFORMACIÓN
        ====================================================== */}

            <div className="rounded-2xl border border-blue-100 bg-gradient-to-r from-blue-50 to-indigo-50 p-5">

                <div className="flex items-start gap-4">

                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-blue-600 shadow-sm">
                        <BrainIcon />
                    </div>

                    <div>

                        <h4 className="text-sm font-semibold text-slate-900">
                            Evaluación mediante Machine Learning
                        </h4>

                        <p className="mt-1 max-w-3xl text-xs leading-5 text-slate-600">
                            Cada evaluación utiliza los modelos predictivos entrenados
                            para estimar la duración, el costo y los defectos esperados
                            del proyecto. Los indicadores de desempeño se calculan a
                            partir de dichas estimaciones.
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
    label,
    value,
    color,
}) {

    const colors = {
        blue: "bg-blue-50 text-blue-600",
        violet: "bg-violet-50 text-violet-600",
        emerald: "bg-emerald-50 text-emerald-600",
    };

    return (

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

            <div className="flex items-center gap-4">

                <div
                    className={`flex h-11 w-11 items-center justify-center rounded-xl ${colors[color]}`}
                >
                    {icon}
                </div>

                <div>

                    <p className="text-xs font-medium text-slate-400">
                        {label}
                    </p>

                    <p className="mt-1 text-2xl font-bold tracking-tight text-slate-900">
                        {value}
                    </p>

                </div>

            </div>

        </div>

    );
}


/* ==============================================================
   EMPTY STATE
============================================================== */

function EmptyState({
    hasSearch,
    onCreate,
}) {

    return (

        <div className="flex min-h-[400px] flex-col items-center justify-center px-6 py-12 text-center">

            <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">

                <FolderKanban size={30} />

            </div>


            <h3 className="text-lg font-semibold text-slate-900">

                {hasSearch
                    ? "No se encontraron proyectos"
                    : "No hay proyectos registrados"}

            </h3>


            <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">

                {hasSearch
                    ? "No existe ningún proyecto que coincida con la búsqueda."
                    : "Realice una nueva predicción para comenzar a evaluar proyectos de software."}

            </p>


            {!hasSearch && (

                <button
                    onClick={onCreate}
                    className="mt-6 inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
                >

                    <Plus size={17} />

                    Crear evaluación

                </button>

            )}

        </div>

    );
}


/* ==============================================================
   PROJECT TABLE
============================================================== */

function ProjectTable({
    projects,
}) {

    return (

        <div className="overflow-x-auto">

            <table className="w-full min-w-[760px]">

                <thead>

                    <tr className="border-b border-slate-100 text-left">

                        <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-400">
                            Proyecto
                        </th>

                        <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-400">
                            Duración
                        </th>

                        <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-400">
                            Presupuesto
                        </th>

                        <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-400">
                            Defectos
                        </th>

                        <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-400">
                            Estado
                        </th>

                    </tr>

                </thead>


                <tbody>

                    {projects.map((project) => (

                        <tr
                            key={project.id}
                            className="border-b border-slate-50 transition hover:bg-slate-50"
                        >

                            <td className="px-6 py-4">

                                <div>

                                    <p className="text-sm font-semibold text-slate-900">
                                        {project.name}
                                    </p>

                                    <p className="mt-1 text-xs text-slate-400">
                                        {project.region}
                                    </p>

                                </div>

                            </td>


                            <td className="px-6 py-4 text-sm text-slate-600">
                                {project.days} días
                            </td>


                            <td className="px-6 py-4 text-sm text-slate-600">
                                S/ {project.cost}
                            </td>


                            <td className="px-6 py-4 text-sm text-slate-600">
                                {project.defects}
                            </td>


                            <td className="px-6 py-4">

                                <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                                    Evaluado
                                </span>

                            </td>

                        </tr>

                    ))}

                </tbody>

            </table>

        </div>

    );
}


/* ==============================================================
   ICONO
============================================================== */

function BrainIcon() {

    return (

        <svg
            width="19"
            height="19"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >

            <path d="M12 5a3 3 0 1 0-5.83 1" />

            <path d="M12 5a3 3 0 1 1 5.83 1" />

            <path d="M7 6a3 3 0 0 0-1 5.83" />

            <path d="M17 6a3 3 0 0 1 1 5.83" />

            <path d="M6 12a3 3 0 0 0 1 5.83" />

            <path d="M18 12a3 3 0 0 1-1 5.83" />

            <path d="M7 18a3 3 0 0 0 5 1" />

            <path d="M17 18a3 3 0 0 1-5 1" />

            <path d="M12 5v14" />

        </svg>

    );
}


export default Projects;
