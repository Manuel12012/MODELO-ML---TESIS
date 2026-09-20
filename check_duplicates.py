import pandas as pd
from pathlib import Path


BASE_DIR = Path(__file__).resolve().parent
INPUT_FILE = BASE_DIR / "dataset_proyectos.csv"


df = pd.read_csv(INPUT_FILE)


print("=" * 60)
print("ANÁLISIS DE PROJECT_CODE")
print("=" * 60)

print(f"\nTotal de registros: {len(df)}")

print(
    f"PROJECT_CODE únicos: "
    f"{df['PROJECT_CODE'].nunique()}"
)

print(
    f"PROJECT_CODE duplicados: "
    f"{df['PROJECT_CODE'].duplicated().sum()}"
)


print("\nPrimeros 20 PROJECT_CODE:")

print(
    df[
        ["ERP_ID", "PROJECT_CODE", "REGION", "SERVICE_LINE"]
    ].head(20).to_string(index=False)
)


print("\nEjemplos de códigos repetidos:")

duplicated_codes = (
    df["PROJECT_CODE"]
    .value_counts()
)

duplicated_codes = duplicated_codes[
    duplicated_codes > 1
].head(10)


print(duplicated_codes)


print("\nDetalle de los primeros códigos repetidos:")

for code in duplicated_codes.index:

    print("\n" + "-" * 60)
    print(f"PROJECT_CODE: {code}")

    print(
        df[
            df["PROJECT_CODE"] == code
        ][
            [
                "ERP_ID",
                "PROJECT_CODE",
                "REGION",
                "SERVICE_LINE",
                "PLANNED_DAYS",
                "ACTUAL_DAYS",
                "BUDGET_PEN",
                "ACTUAL_COST_PEN",
                "KLOC",
                "DEFECTS",
                "PM_CODE",
                "SYS_NODE"
            ]
        ].to_string(index=False)
    )


print("\n" + "=" * 60)