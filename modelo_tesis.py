import pandas as pd
import numpy as np
import joblib

from sklearn.model_selection import train_test_split, KFold, cross_val_score
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import OneHotEncoder
from sklearn.pipeline import Pipeline
from sklearn.impute import SimpleImputer
from sklearn.linear_model import LinearRegression
from sklearn.metrics import (
    mean_squared_error,
    mean_absolute_error,
    r2_score
)


# ============================================================
# CONFIGURACIÓN
# ============================================================

ARCHIVO = "dataset_proyectos.csv"

RANDOM_STATE = 42
TEST_SIZE = 0.20


# ============================================================
# CARGAR DATASET
# ============================================================

df = pd.read_csv(ARCHIVO)

print("\n" + "=" * 100)
print("MODELO PREDICTIVO — FLUJO COMPLETO")
print("=" * 100)

print(f"\nCantidad de proyectos originales: {len(df)}")


# ============================================================
# LIMPIEZA
# ============================================================

df = df.dropna().copy()

print(
    f"Proyectos utilizados después de limpieza: {len(df)}"
)


# ============================================================
# VARIABLES PREDICTORAS
# ============================================================
#
# Son las variables que se conocen antes de que el proyecto
# termine.
#
# NO se utilizan como variables predictoras:
#
# ACTUAL_DAYS
# ACTUAL_COST_PEN
# DEFECTS
#
# porque son precisamente los resultados que queremos predecir.
# ============================================================

FEATURES_NUMERICAS = [
    "PLANNED_DAYS",
    "BUDGET_PEN",
    "KLOC"
]


FEATURES_CATEGORICAS = [
    "REGION",
    "SERVICE_LINE",
    "PM_CODE",
    "SYS_NODE"
]


FEATURES = (
    FEATURES_NUMERICAS +
    FEATURES_CATEGORICAS
)


# ============================================================
# VARIABLES OBJETIVO
# ============================================================

TARGETS = {
    "ACTUAL_DAYS": "ACTUAL_DAYS",
    "ACTUAL_COST_PEN": "ACTUAL_COST_PEN",
    "DEFECTS": "DEFECTS"
}


# ============================================================
# VARIABLES DE ENTRADA
# ============================================================

X = df[FEATURES]


# ============================================================
# PREPROCESAMIENTO
# ============================================================

numeric_transformer = Pipeline(
    steps=[
        (
            "imputer",
            SimpleImputer(strategy="median")
        )
    ]
)


categorical_transformer = Pipeline(
    steps=[
        (
            "imputer",
            SimpleImputer(strategy="most_frequent")
        ),
        (
            "onehot",
            OneHotEncoder(
                handle_unknown="ignore",
                sparse_output=False
            )
        )
    ]
)


preprocessor = ColumnTransformer(
    transformers=[
        (
            "num",
            numeric_transformer,
            FEATURES_NUMERICAS
        ),
        (
            "cat",
            categorical_transformer,
            FEATURES_CATEGORICAS
        )
    ]
)


# ============================================================
# VALIDACIÓN CRUZADA
# ============================================================

cv = KFold(
    n_splits=5,
    shuffle=True,
    random_state=RANDOM_STATE
)


# ============================================================
# FUNCIÓN PARA CALCULAR MÉTRICAS
# ============================================================

def calcular_metricas(y_real, y_pred):

    rmse = np.sqrt(
        mean_squared_error(
            y_real,
            y_pred
        )
    )

    mae = mean_absolute_error(
        y_real,
        y_pred
    )

    r2 = r2_score(
        y_real,
        y_pred
    )

    vme = np.mean(
        y_pred - y_real
    )

    return r2, rmse, mae, vme


# ============================================================
# ESTRUCTURAS PARA GUARDAR RESULTADOS
# ============================================================

resultados_modelos = []

predicciones = pd.DataFrame(
    index=df.index
)


# ============================================================
# GUARDAR VARIABLES NECESARIAS PARA LOS INDICADORES
# ============================================================

predicciones["PLANNED_DAYS"] = (
    df["PLANNED_DAYS"]
)

predicciones["BUDGET_PEN"] = (
    df["BUDGET_PEN"]
)

predicciones["KLOC"] = (
    df["KLOC"]
)


# ============================================================
# ENTRENAMIENTO DE LOS 3 MODELOS
# ============================================================

for nombre_objetivo, target in TARGETS.items():

    print("\n\n" + "=" * 100)
    print(f"MODELO: {nombre_objetivo}")
    print("=" * 100)


    # --------------------------------------------------------
    # VARIABLE OBJETIVO
    # --------------------------------------------------------

    y = df[target]


    # --------------------------------------------------------
    # DIVISIÓN 80/20
    # --------------------------------------------------------

    X_train, X_test, y_train, y_test = train_test_split(
        X,
        y,
        test_size=TEST_SIZE,
        random_state=RANDOM_STATE
    )


    print("\n" + "-" * 80)
    print("DIVISIÓN DE DATOS")
    print("-" * 80)

    print(
        f"Entrenamiento: {len(X_train)} proyectos"
    )

    print(
        f"Prueba:        {len(X_test)} proyectos"
    )


    # --------------------------------------------------------
    # MODELO
    # --------------------------------------------------------

    modelo = Pipeline(
        steps=[
            (
                "preprocessor",
                preprocessor
            ),
            (
                "model",
                LinearRegression()
            )
        ]
    )


    # --------------------------------------------------------
    # ENTRENAMIENTO
    # --------------------------------------------------------

    modelo.fit(
        X_train,
        y_train
    )


    # --------------------------------------------------------
    # PREDICCIONES
    # --------------------------------------------------------

    y_train_pred = modelo.predict(
        X_train
    )

    y_test_pred = modelo.predict(
        X_test
    )


    # --------------------------------------------------------
    # MÉTRICAS DE ENTRENAMIENTO
    # --------------------------------------------------------

    (
        r2_train,
        rmse_train,
        mae_train,
        vme_train
    ) = calcular_metricas(
        y_train,
        y_train_pred
    )


    # --------------------------------------------------------
    # MÉTRICAS DE PRUEBA
    # --------------------------------------------------------

    (
        r2_test,
        rmse_test,
        mae_test,
        vme_test
    ) = calcular_metricas(
        y_test,
        y_test_pred
    )


    # --------------------------------------------------------
    # VALIDACIÓN CRUZADA
    # --------------------------------------------------------

    scores_cv = cross_val_score(
        modelo,
        X,
        y,
        cv=cv,
        scoring="r2"
    )


    r2_cv_mean = scores_cv.mean()

    r2_cv_std = scores_cv.std()


    # --------------------------------------------------------
    # MOSTRAR RESULTADOS
    # --------------------------------------------------------

    print("\n" + "-" * 80)
    print("RESULTADOS DEL MODELO")
    print("-" * 80)

    print(
        f"R² entrenamiento : {r2_train:.6f}"
    )

    print(
        f"R² prueba        : {r2_test:.6f}"
    )

    print(
        f"R² CV promedio   : {r2_cv_mean:.6f}"
    )

    print(
        f"R² CV desviación : {r2_cv_std:.6f}"
    )

    print(
        f"RMSE             : {rmse_test:.6f}"
    )

    print(
        f"MAE              : {mae_test:.6f}"
    )

    print(
        f"VME              : {vme_test:.6f}"
    )


    # --------------------------------------------------------
    # GUARDAR PREDICCIONES DEL TEST
    # --------------------------------------------------------

    columna_prediccion = (
        f"{target}_PRED"
    )

    predicciones[
        columna_prediccion
    ] = np.nan


    predicciones.loc[
        X_test.index,
        columna_prediccion
    ] = y_test_pred


    # --------------------------------------------------------
    # GUARDAR RESULTADOS DEL MODELO
    # --------------------------------------------------------

    resultados_modelos.append({

        "Objetivo": nombre_objetivo,

        "R2_Entrenamiento": r2_train,

        "R2_Prueba": r2_test,

        "R2_CV_Promedio": r2_cv_mean,

        "R2_CV_Std": r2_cv_std,

        "RMSE": rmse_test,

        "MAE": mae_test,

        "VME": vme_test
    })


    # --------------------------------------------------------
    # GUARDAR MODELO
    # --------------------------------------------------------

    nombre_archivo = (
        target.lower()
        + "_regresion_lineal.pkl"
    )


    joblib.dump(
        modelo,
        nombre_archivo
    )


    print(
        f"\nModelo guardado: {nombre_archivo}"
    )


# ============================================================
# RESULTADOS REALES
# ============================================================

predicciones["ACTUAL_DAYS_REAL"] = (
    df["ACTUAL_DAYS"]
)

predicciones["ACTUAL_COST_PEN_REAL"] = (
    df["ACTUAL_COST_PEN"]
)

predicciones["DEFECTS_REAL"] = (
    df["DEFECTS"]
)


# ============================================================
# INDICADORES REALES
# ============================================================
#
# Estos indicadores se calculan utilizando los resultados
# reales de los proyectos históricos.
#
# Sirven para comparar posteriormente contra los indicadores
# obtenidos a partir de las predicciones.
# ============================================================

predicciones["RETRASO_REAL"] = (

    (
        predicciones["ACTUAL_DAYS_REAL"]
        -
        predicciones["PLANNED_DAYS"]
    )
    /
    predicciones["PLANNED_DAYS"]

) * 100


predicciones["SOBRECOSTO_REAL"] = (

    (
        predicciones["ACTUAL_COST_PEN_REAL"]
        -
        predicciones["BUDGET_PEN"]
    )
    /
    predicciones["BUDGET_PEN"]

) * 100


predicciones["DENSIDAD_DEFECTOS_REAL"] = (

    predicciones["DEFECTS_REAL"]
    /
    predicciones["KLOC"]

)


# ============================================================
# INDICADORES PREDICHOS
# ============================================================
#
# Aquí se aplican las fórmulas de la matriz utilizando
# las predicciones producidas por Machine Learning.
# ============================================================

predicciones["RETRASO_PRED"] = (

    (
        predicciones["ACTUAL_DAYS_PRED"]
        -
        predicciones["PLANNED_DAYS"]
    )
    /
    predicciones["PLANNED_DAYS"]

) * 100


predicciones["SOBRECOSTO_PRED"] = (

    (
        predicciones["ACTUAL_COST_PEN_PRED"]
        -
        predicciones["BUDGET_PEN"]
    )
    /
    predicciones["BUDGET_PEN"]

) * 100


predicciones["DENSIDAD_DEFECTOS_PRED"] = (

    predicciones["DEFECTS_PRED"]
    /
    predicciones["KLOC"]

)


# ============================================================
# SELECCIONAR SOLAMENTE LOS PROYECTOS DE PRUEBA
# ============================================================
#
# Las predicciones ML fueron generadas para los 2,000
# proyectos del conjunto de prueba.
#
# Por ello, la evaluación final de los indicadores también
# se realiza solamente sobre esos mismos proyectos.
# ============================================================

evaluacion = predicciones.dropna(
    subset=[
        "ACTUAL_DAYS_PRED",
        "ACTUAL_COST_PEN_PRED",
        "DEFECTS_PRED"
    ]
).copy()


print("\n\n" + "=" * 100)
print("EVALUACIÓN FINAL DE INDICADORES")
print("=" * 100)

print(
    f"\nProyectos evaluados: {len(evaluacion)}"
)


# ============================================================
# INDICADORES A EVALUAR
# ============================================================

indicadores = {

    "Retraso": (
        "RETRASO_REAL",
        "RETRASO_PRED"
    ),

    "Sobrecosto": (
        "SOBRECOSTO_REAL",
        "SOBRECOSTO_PRED"
    ),

    "Densidad de defectos": (
        "DENSIDAD_DEFECTOS_REAL",
        "DENSIDAD_DEFECTOS_PRED"
    )
}


resultados_indicadores = []


# ============================================================
# EVALUACIÓN DE INDICADORES
# ============================================================

for nombre, columnas in indicadores.items():

    real = evaluacion[
        columnas[0]
    ]

    pred = evaluacion[
        columnas[1]
    ]


    # --------------------------------------------------------
    # R²
    # --------------------------------------------------------

    r2 = r2_score(
        real,
        pred
    )


    # --------------------------------------------------------
    # RMSE
    # --------------------------------------------------------

    rmse = np.sqrt(
        mean_squared_error(
            real,
            pred
        )
    )


    # --------------------------------------------------------
    # MAE
    # --------------------------------------------------------

    mae = mean_absolute_error(
        real,
        pred
    )


    # --------------------------------------------------------
    # VME
    # --------------------------------------------------------

    vme = np.mean(
        pred - real
    )


    print("\n" + "-" * 80)
    print(nombre)
    print("-" * 80)

    print(
        f"R²   : {r2:.6f}"
    )

    print(
        f"RMSE : {rmse:.6f}"
    )

    print(
        f"MAE  : {mae:.6f}"
    )

    print(
        f"VME  : {vme:.6f}"
    )


    resultados_indicadores.append({

        "Indicador": nombre,

        "R2": r2,

        "RMSE": rmse,

        "MAE": mae,

        "VME": vme
    })


# ============================================================
# DATAFRAME DE RESULTADOS DE MODELOS
# ============================================================

resultados_modelos_df = pd.DataFrame(
    resultados_modelos
)


# ============================================================
# DATAFRAME DE RESULTADOS DE INDICADORES
# ============================================================

resultados_indicadores_df = pd.DataFrame(
    resultados_indicadores
)


# ============================================================
# MOSTRAR RESULTADOS DE MODELOS
# ============================================================

print("\n\n" + "=" * 100)
print("RESULTADOS DE LOS MODELOS ML")
print("=" * 100)

print(
    resultados_modelos_df.to_string(
        index=False,
        float_format=lambda x: f"{x:.6f}"
    )
)


# ============================================================
# MOSTRAR RESULTADOS DE INDICADORES
# ============================================================

print("\n\n" + "=" * 100)
print("RESULTADOS DE LOS INDICADORES")
print("=" * 100)

print(
    resultados_indicadores_df.to_string(
        index=False,
        float_format=lambda x: f"{x:.6f}"
    )
)


# ============================================================
# GUARDAR RESULTADOS DE MODELOS
# ============================================================

resultados_modelos_df.to_csv(
    "resultados_modelos.csv",
    index=False
)


# ============================================================
# GUARDAR RESULTADOS DE INDICADORES
# ============================================================

resultados_indicadores_df.to_csv(
    "resultados_indicadores.csv",
    index=False
)


# ============================================================
# GUARDAR TODAS LAS PREDICCIONES
# ============================================================

predicciones.to_csv(
    "predicciones_modelo.csv",
    index=False
)


# ============================================================
# GUARDAR EVALUACIÓN DE INDICADORES DEL TEST
# ============================================================

evaluacion.to_csv(
    "evaluacion_indicadores_test.csv",
    index=False
)


# ============================================================
# RESUMEN FINAL
# ============================================================

print("\n\n" + "=" * 100)
print("ARCHIVOS GENERADOS")
print("=" * 100)

print(
    """
- resultados_modelos.csv
- resultados_indicadores.csv
- predicciones_modelo.csv
- evaluacion_indicadores_test.csv

- actual_days_regresion_lineal.pkl
- actual_cost_pen_regresion_lineal.pkl
- defects_regresion_lineal.pkl
"""
)

print("=" * 100)
print("PROCESO TERMINADO")
print("=" * 100)
