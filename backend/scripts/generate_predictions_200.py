import os
import sys

from sqlalchemy import select

# ============================================================
# PERMITIR IMPORTAR MÓDULOS DESDE backend/
# ============================================================

sys.path.append(
    os.path.dirname(
        os.path.dirname(
            os.path.abspath(__file__)
        )
    )
)


# ============================================================
# IMPORTACIONES DEL PROYECTO
# ============================================================

from app.database import SessionLocal

from app.models.project import Project
from app.models.prediction_evaluation import PredictionEvaluation
from app.models.prediction_result import PredictionResult

from app.services.prediction_service import predict_project


# ============================================================
# GENERAR PREDICCIONES
# ============================================================

def generate_predictions():

    print("========================================")
    print(" GENERACIÓN DE PREDICCIONES ML")
    print("========================================")

    db = SessionLocal()

    generated = 0
    skipped = 0
    errors = 0

    try:

        # ----------------------------------------------------
        # Obtener proyectos finalizados
        # ----------------------------------------------------

        statement = (
            select(Project)
            .where(
                Project.status == "finalizado"
            )
            .order_by(
                Project.id
            )
        )

        projects = db.execute(
            statement
        ).scalars().all()

        print(
            f"\nProyectos encontrados: "
            f"{len(projects)}"
        )

        # ----------------------------------------------------
        # Procesar proyectos
        # ----------------------------------------------------

        for project in projects:

            try:

                # ------------------------------------------------
                # Verificar si ya existe una predicción
                # ------------------------------------------------

                existing_evaluation = (
                    db.query(
                        PredictionEvaluation
                    )
                    .filter(
                        PredictionEvaluation.project_id
                        == project.id
                    )
                    .first()
                )

                if existing_evaluation:

                    skipped += 1

                    print(
                        f"[OMITIDO] "
                        f"{project.erp_id} - "
                        f"{project.project_code} "
                        f"(ya tiene predicción)"
                    )

                    continue

                # ------------------------------------------------
                # Preparar datos para el modelo
                # ------------------------------------------------

                class ProjectData:
                    pass

                data = ProjectData()

                data.planned_days = (
                    project.planned_days
                )

                data.budget_pen = float(
                    project.budget_pen
                )

                data.kloc = float(
                    project.kloc
                )

                data.region = (
                    project.region
                )

                data.service_line = (
                    project.service_line
                )

                data.pm_code = (
                    project.pm_code
                )

                data.sys_node = (
                    project.sys_node
                )

                # ------------------------------------------------
                # Ejecutar modelo ML
                # ------------------------------------------------

                prediction = predict_project(
                    data
                )

                predicted_actual_days = (
                    prediction["actual_days"]
                )

                predicted_actual_cost = (
                    prediction["actual_cost_pen"]
                )

                predicted_defects = (
                    prediction["defects"]
                )

                # ------------------------------------------------
                # Calcular indicadores predichos
                # ------------------------------------------------

                planned_days = float(
                    project.planned_days
                )

                budget_pen = float(
                    project.budget_pen
                )

                kloc = float(
                    project.kloc
                )

                predicted_delay_pct = (
                    (
                        predicted_actual_days
                        - planned_days
                    )
                    / planned_days
                ) * 100

                predicted_overrun_pct = (
                    (
                        predicted_actual_cost
                        - budget_pen
                    )
                    / budget_pen
                ) * 100

                predicted_defect_density = (
                    predicted_defects
                    / kloc
                )

                # ------------------------------------------------
                # Crear evaluación
                # ------------------------------------------------

                evaluation = PredictionEvaluation(

                    project_id =
                        project.id,

                    user_id =
                        1,

                    model_version_id =
                        1
                )

                db.add(evaluation)

                # ------------------------------------------------
                # Necesitamos el ID de evaluación
                # ------------------------------------------------

                db.flush()

                # ------------------------------------------------
                # Crear resultado
                # ------------------------------------------------

                result = PredictionResult(

                    evaluation_id =
                        evaluation.id,

                    predicted_delay_pct =
                        predicted_delay_pct,

                    predicted_overrun_pct =
                        predicted_overrun_pct,

                    predicted_defect_density =
                        predicted_defect_density,

                    predicted_success =
                        None
                )

                db.add(result)

                generated += 1

                print(
                    f"[PREDICCIÓN] "
                    f"{project.erp_id} - "
                    f"{project.project_code} | "
                    f"Retraso: "
                    f"{predicted_delay_pct:.2f}% | "
                    f"Sobre costo: "
                    f"{predicted_overrun_pct:.2f}% | "
                    f"Densidad: "
                    f"{predicted_defect_density:.4f}"
                )

            except Exception as error:

                errors += 1

                print(
                    f"\n[ERROR] "
                    f"{project.erp_id} - "
                    f"{project.project_code}"
                )

                print(
                    f"Detalle: {error}"
                )

        # ----------------------------------------------------
        # Guardar todas las predicciones
        # ----------------------------------------------------

        db.commit()

        print("\n========================================")
        print(" PROCESO TERMINADO")
        print("========================================")

        print(
            f"Predicciones generadas : "
            f"{generated}"
        )

        print(
            f"Predicciones omitidas  : "
            f"{skipped}"
        )

        print(
            f"Errores                : "
            f"{errors}"
        )

        print(
            f"Total proyectos        : "
            f"{len(projects)}"
        )

    except Exception as error:

        db.rollback()

        print(
            "\nERROR GENERAL:"
        )

        print(error)

        print(
            "\nNo se confirmaron los cambios."
        )

    finally:

        db.close()


# ============================================================
# EJECUCIÓN
# ============================================================

if __name__ == "__main__":
    generate_predictions()