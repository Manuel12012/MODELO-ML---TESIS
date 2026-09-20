import pandas as pd
from pathlib import Path


# ============================================================
# CONFIGURACIÓN
# ============================================================

BASE_DIR = Path(__file__).resolve().parent

INPUT_FILE = BASE_DIR / "dataset_proyectos.csv"
OUTPUT_FILE = BASE_DIR / "muestra_200_proyectos.csv"

SAMPLE_SIZE = 200


# ============================================================
# COLUMNAS ESPERADAS
# ============================================================

EXPECTED_COLUMNS = [
    "ERP_ID",
    "PROJECT_CODE",
    "REGION",
    "SERVICE_LINE",
    "PLANNED_DAYS",
    "ACTUAL_DAYS",
    "BUDGET_PEN",
    "REVENUE_PEN",
    "ACTUAL_COST_PEN",
    "PROFIT_PEN",
    "KLOC",
    "DEFECTS",
    "PM_CODE",
    "SYS_NODE"
]


# ============================================================
# VALIDAR COLUMNAS
# ============================================================

def validate_columns(df):

    missing_columns = [
        column
        for column in EXPECTED_COLUMNS
        if column not in df.columns
    ]

    if missing_columns:
        raise ValueError(
            f"Faltan columnas en el CSV: {missing_columns}"
        )

    print("✓ Columnas verificadas correctamente")


# ============================================================
# VALIDAR NULOS
# ============================================================

def validate_nulls(df):

    nulls = df[EXPECTED_COLUMNS].isnull().sum()

    total_nulls = nulls.sum()

    if total_nulls > 0:

        print("\n⚠ Se encontraron valores nulos:")
        print(nulls[nulls > 0])

        raise ValueError(
            "El dataset contiene valores nulos."
        )

    print("✓ No se encontraron valores nulos")


# ============================================================
# VALIDAR DUPLICADOS
# ============================================================

def validate_duplicates(df):

    duplicates = df["ERP_ID"].duplicated().sum()

    if duplicates > 0:

        print(
            f"\n⚠ Se encontraron {duplicates} "
            "ERP_ID duplicados."
        )

        raise ValueError(
            "Existen registros duplicados por ERP_ID."
        )

    print("✓ No se encontraron ERP_ID duplicados")


# ============================================================
# VALIDAR VALORES NUMÉRICOS
# ============================================================

def validate_values(df):

    validations = {

        "PLANNED_DAYS": (
            df["PLANNED_DAYS"] > 0
        ),

        "BUDGET_PEN": (
            df["BUDGET_PEN"] > 0
        ),

        "KLOC": (
            df["KLOC"] > 0
        ),

        "DEFECTS": (
            df["DEFECTS"] >= 0
        ),

        "ACTUAL_DAYS": (
            df["ACTUAL_DAYS"] > 0
        ),

        "ACTUAL_COST_PEN": (
            df["ACTUAL_COST_PEN"] > 0
        )
    }

    for column, condition in validations.items():

        invalid_count = (~condition).sum()

        if invalid_count > 0:

            raise ValueError(
                f"La columna {column} contiene "
                f"{invalid_count} valores inválidos."
            )

    print("✓ Valores numéricos verificados correctamente")


# ============================================================
# CREAR MUESTRA
# ============================================================

def create_sample(df):

    if len(df) < SAMPLE_SIZE:

        raise ValueError(
            f"El dataset solo tiene {len(df)} registros. "
            f"Se necesitan {SAMPLE_SIZE}."
        )

    sample = df.head(SAMPLE_SIZE).copy()

    print(
        f"\n✓ Se seleccionaron "
        f"{len(sample)} proyectos"
    )

    return sample


# ============================================================
# GUARDAR MUESTRA
# ============================================================

def save_sample(sample):

    sample.to_csv(
        OUTPUT_FILE,
        index=False,
        encoding="utf-8-sig"
    )

    print(
        f"✓ Archivo generado: "
        f"{OUTPUT_FILE.name}"
    )


# ============================================================
# PROCESO PRINCIPAL
# ============================================================

def main():

    print("=" * 60)
    print("PREPARACIÓN DE MUESTRA DE PROYECTOS")
    print("=" * 60)

    if not INPUT_FILE.exists():

        raise FileNotFoundError(
            f"No se encontró el archivo: {INPUT_FILE}"
        )

    print(
        f"\nArchivo de entrada: "
        f"{INPUT_FILE.name}"
    )

    df = pd.read_csv(INPUT_FILE)

    print(
        f"Total de registros encontrados: "
        f"{len(df)}"
    )

    validate_columns(df)
    validate_nulls(df)
    validate_duplicates(df)
    validate_values(df)

    sample = create_sample(df)

    save_sample(sample)

    print("\n" + "=" * 60)
    print("PROCESO COMPLETADO")
    print("=" * 60)

    print(
        f"Dataset original : {len(df)} proyectos"
    )

    print(
        f"Muestra generada : {len(sample)} proyectos"
    )

    print(
        f"Archivo salida    : {OUTPUT_FILE}"
    )

    print("=" * 60)


if __name__ == "__main__":
    main()