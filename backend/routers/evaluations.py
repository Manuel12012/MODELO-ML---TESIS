from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.prediction_evaluation import PredictionEvaluation
from app.models.prediction_result import PredictionResult
from app.models.project import Project

from schemas.evaluation import PredictionEvaluationResponse


router = APIRouter(
    prefix="/evaluations",
    tags=["Prediction Evaluations"]
)


# ============================================================
# OBTENER EVALUACIONES
# ============================================================

@router.get(
    "/",
    response_model=list[PredictionEvaluationResponse]
)
def get_evaluations(
    db: Session = Depends(get_db)
):

    statement = (
        select(
            PredictionEvaluation.id.label(
                "evaluation_id"
            ),

            PredictionEvaluation.project_id,

            Project.project_code,

            PredictionEvaluation.user_id,

            PredictionEvaluation.model_version_id,

            PredictionEvaluation.created_at,

            PredictionResult.predicted_delay_pct,

            PredictionResult.predicted_overrun_pct,

            PredictionResult.predicted_defect_density,

            PredictionResult.predicted_success,
        )

        .join(
            Project,
            Project.id ==
            PredictionEvaluation.project_id
        )

        .join(
            PredictionResult,
            PredictionResult.evaluation_id ==
            PredictionEvaluation.id
        )

        .order_by(
            PredictionEvaluation.created_at.desc()
        )
    )


    result = db.execute(statement)

    evaluations = result.mappings().all()


    return evaluations


# ============================================================
# COMPARAR PREDICCIÓN VS RESULTADO REAL
# ============================================================

@router.get("/comparison")
def get_evaluation_comparison(
    db: Session = Depends(get_db)
):

    statement = (

        select(

            PredictionEvaluation.id.label(
                "evaluation_id"
            ),

            Project.id.label(
                "project_id"
            ),

            Project.project_code,

            Project.status,

            Project.planned_days,

            Project.budget_pen,

            Project.kloc,

            Project.actual_days,

            Project.actual_cost_pen,

            Project.defects,

            PredictionResult.predicted_delay_pct,

            PredictionResult.predicted_overrun_pct,

            PredictionResult.predicted_defect_density,

            PredictionEvaluation.created_at,

        )

        .join(
            Project,
            Project.id ==
            PredictionEvaluation.project_id
        )

        .join(
            PredictionResult,
            PredictionResult.evaluation_id ==
            PredictionEvaluation.id
        )

        # Solo proyectos finalizados
        .where(
            Project.status == "finalizado"
        )

        .order_by(
            PredictionEvaluation.created_at.desc()
        )
    )


    result = db.execute(statement)

    evaluations = result.mappings().all()


    comparisons = []


    for evaluation in evaluations:

        # ====================================================
        # VALIDAR DATOS REALES
        # ====================================================

        if (
            evaluation.actual_days is None
            or evaluation.actual_cost_pen is None
            or evaluation.defects is None
        ):
            continue


        # ====================================================
        # CONVERTIR VALORES A FLOAT
        # ====================================================

        planned_days = float(
            evaluation.planned_days
        )

        budget_pen = float(
            evaluation.budget_pen
        )

        kloc = float(
            evaluation.kloc
        )

        actual_days = float(
            evaluation.actual_days
        )

        actual_cost_pen = float(
            evaluation.actual_cost_pen
        )

        actual_defects = float(
            evaluation.defects
        )


        # ====================================================
        # CALCULAR VALORES REALES
        # ====================================================

        real_delay_pct = (

            (
                actual_days -
                planned_days
            )

            / planned_days

        ) * 100


        real_overrun_pct = (

            (
                actual_cost_pen -
                budget_pen
            )

            / budget_pen

        ) * 100


        real_defect_density = (

            actual_defects /
            kloc

        )


        # ====================================================
        # DIFERENCIAS
        # ====================================================

        delay_difference = (

            real_delay_pct -
            float(
                evaluation.predicted_delay_pct
            )

        )


        overrun_difference = (

            real_overrun_pct -
            float(
                evaluation.predicted_overrun_pct
            )

        )


        defect_difference = (

            real_defect_density -
            float(
                evaluation.predicted_defect_density
            )

        )


        # ====================================================
        # AGREGAR COMPARACIÓN
        # ====================================================

        comparisons.append({

            "evaluation_id":
                evaluation.evaluation_id,

            "project_id":
                evaluation.project_id,

            "project_code":
                evaluation.project_code,

            "status":
                evaluation.status,

            "created_at":
                evaluation.created_at,

            # ----------------------------------------------
            # PREDICCIÓN
            # ----------------------------------------------

            "prediction": {

                "delay_pct":
                    round(
                        float(
                            evaluation.predicted_delay_pct
                        ),
                        4
                    ),

                "overrun_pct":
                    round(
                        float(
                            evaluation.predicted_overrun_pct
                        ),
                        4
                    ),

                "defect_density":
                    round(
                        float(
                            evaluation.predicted_defect_density
                        ),
                        4
                    )
            },

            # ----------------------------------------------
            # RESULTADO REAL
            # ----------------------------------------------

            "actual": {

                "days":
                    actual_days,

                "cost_pen":
                    actual_cost_pen,

                "defects":
                    actual_defects,

                "delay_pct":
                    round(
                        real_delay_pct,
                        4
                    ),

                "overrun_pct":
                    round(
                        real_overrun_pct,
                        4
                    ),

                "defect_density":
                    round(
                        real_defect_density,
                        4
                    )
            },

            # ----------------------------------------------
            # DIFERENCIA
            # ----------------------------------------------

            "difference": {

                "delay_pct":
                    round(
                        delay_difference,
                        4
                    ),

                "overrun_pct":
                    round(
                        overrun_difference,
                        4
                    ),

                "defect_density":
                    round(
                        defect_difference,
                        4
                    )
            }

        })


    return comparisons