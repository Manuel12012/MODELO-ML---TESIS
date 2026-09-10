from fastapi import FastAPI

from app.schemas import (
    ProjectInput,
    PredictionResponse,
    PredictionResults,
    IndicatorResults
)

from app.services.prediction_service import (
    predict_project
)

from app.services.indicator_service import (
    calculate_indicators
)


# ============================================================
# APLICACIÓN
# ============================================================

app = FastAPI(
    title="Sistema Predictivo de Proyectos de Software",
    description=(
        "API para estimar resultados finales de "
        "proyectos de software mediante Machine Learning."
    ),
    version="1.0.0"
)


# ============================================================
# HEALTH CHECK
# ============================================================

@app.get("/")
def root():

    return {
        "message": "API predictiva funcionando"
    }


# ============================================================
# PREDICCIÓN
# ============================================================

@app.post(
    "/predict",
    response_model=PredictionResponse
)
def predict(project: ProjectInput):

    # --------------------------------------------------------
    # 1. MACHINE LEARNING
    # --------------------------------------------------------

    predictions = predict_project(
        project
    )


    # --------------------------------------------------------
    # 2. CÁLCULO DE INDICADORES
    # --------------------------------------------------------

    indicators = calculate_indicators(

        planned_days=project.planned_days,

        budget_pen=project.budget_pen,

        kloc=project.kloc,

        actual_days_pred=(
            predictions["actual_days"]
        ),

        actual_cost_pred=(
            predictions["actual_cost_pen"]
        ),

        defects_pred=(
            predictions["defects"]
        )
    )


    # --------------------------------------------------------
    # 3. RESPUESTA
    # --------------------------------------------------------

    return {

        "predicciones": {

            "actual_days": predictions[
                "actual_days"
            ],

            "actual_cost_pen": predictions[
                "actual_cost_pen"
            ],

            "defects": predictions[
                "defects"
            ]
        },

        "indicadores": {

            "retraso_porcentaje": indicators[
                "retraso_porcentaje"
            ],

            "sobrecosto_porcentaje": indicators[
                "sobrecosto_porcentaje"
            ],

            "densidad_defectos": indicators[
                "densidad_defectos"
            ]
        }
    }
