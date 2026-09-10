from pathlib import Path

import joblib
import pandas as pd


# ============================================================
# RUTAS DE LOS MODELOS
# ============================================================

BASE_DIR = Path(__file__).resolve().parents[2]

MODELS_DIR = BASE_DIR / "models"


# ============================================================
# CARGAR MODELOS
# ============================================================

MODEL_ACTUAL_DAYS = joblib.load(
    MODELS_DIR / "actual_days_regresion_lineal.pkl"
)

MODEL_ACTUAL_COST = joblib.load(
    MODELS_DIR / "actual_cost_pen_regresion_lineal.pkl"
)

MODEL_DEFECTS = joblib.load(
    MODELS_DIR / "defects_regresion_lineal.pkl"
)


# ============================================================
# FUNCIÓN DE PREDICCIÓN
# ============================================================

def predict_project(data):

    X = pd.DataFrame([
        {
            "PLANNED_DAYS": data.planned_days,
            "BUDGET_PEN": data.budget_pen,
            "KLOC": data.kloc,

            "REGION": data.region,
            "SERVICE_LINE": data.service_line,
            "PM_CODE": data.pm_code,
            "SYS_NODE": data.sys_node
        }
    ])


    # --------------------------------------------------------
    # PREDICCIÓN DE DÍAS REALES
    # --------------------------------------------------------

    actual_days = MODEL_ACTUAL_DAYS.predict(X)[0]


    # --------------------------------------------------------
    # PREDICCIÓN DE COSTO REAL
    # --------------------------------------------------------

    actual_cost = MODEL_ACTUAL_COST.predict(X)[0]


    # --------------------------------------------------------
    # PREDICCIÓN DE DEFECTOS
    # --------------------------------------------------------

    defects = MODEL_DEFECTS.predict(X)[0]


    return {
        "actual_days": float(actual_days),
        "actual_cost_pen": float(actual_cost),
        "defects": float(defects)
    }
