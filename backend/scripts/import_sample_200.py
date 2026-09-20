import os
import sys

import pandas as pd

# Permite importar módulos desde backend/
sys.path.append(
    os.path.dirname(
        os.path.dirname(
            os.path.abspath(__file__)
        )
    )
)

from app.database import SessionLocal
from app.models.project import Project


PROJECT_ROOT = os.path.dirname(
    os.path.dirname(
        os.path.dirname(
            os.path.abspath(__file__)
        )
    )
)

CSV_PATH = os.path.join(
    PROJECT_ROOT,
    "muestra_200_proyectos.csv"
)


def import_projects():

    print("========================================")
    print(" IMPORTACIÓN DE 200 PROYECTOS")
    print("========================================")

    # -----------------------------------------
    # 1. Leer CSV
    # -----------------------------------------

    if not os.path.exists(CSV_PATH):
        print(
            f"\nERROR: No se encontró el archivo:\n"
            f"{CSV_PATH}"
        )
        return

    df = pd.read_csv(CSV_PATH)

    print(
        f"\nProyectos encontrados en CSV: "
        f"{len(df)}"
    )

    # -----------------------------------------
    # 2. Validar columnas
    # -----------------------------------------

    required_columns = [
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

    missing_columns = [
        column
        for column in required_columns
        if column not in df.columns
    ]

    if missing_columns:
        print("\nERROR: Faltan columnas:")
        for column in missing_columns:
            print(f" - {column}")

        print("\nColumnas encontradas:")
        print(list(df.columns))

        return

    # -----------------------------------------
    # 3. Conectar PostgreSQL
    # -----------------------------------------

    db = SessionLocal()

    inserted = 0
    updated = 0
    errors = 0

    try:

        # -----------------------------------------
        # 4. Procesar proyectos
        # -----------------------------------------

        for _, row in df.iterrows():

            try:

                erp_id = str(
                    row["ERP_ID"]
                ).strip()

                # Buscar por ERP_ID
                project = (
                    db.query(Project)
                    .filter(
                        Project.erp_id == erp_id
                    )
                    .first()
                )

                # ---------------------------------
                # Datos del proyecto
                # ---------------------------------

                data = {
                    "erp_id": erp_id,

                    "project_code":
                        str(
                            row["PROJECT_CODE"]
                        ).strip(),

                    "region":
                        str(
                            row["REGION"]
                        ).strip(),

                    "service_line":
                        str(
                            row["SERVICE_LINE"]
                        ).strip(),

                    "planned_days":
                        int(
                            row["PLANNED_DAYS"]
                        ),

                    "actual_days":
                        int(
                            row["ACTUAL_DAYS"]
                        ),

                    "budget_pen":
                        float(
                            row["BUDGET_PEN"]
                        ),

                    "revenue_pen":
                        float(
                            row["REVENUE_PEN"]
                        ),

                    "actual_cost_pen":
                        float(
                            row["ACTUAL_COST_PEN"]
                        ),

                    "profit_pen":
                        float(
                            row["PROFIT_PEN"]
                        ),

                    "kloc":
                        float(
                            row["KLOC"]
                        ),

                    "defects":
                        int(
                            row["DEFECTS"]
                        ),

                    "pm_code":
                        str(
                            row["PM_CODE"]
                        ).strip(),

                    "sys_node":
                        str(
                            row["SYS_NODE"]
                        ).strip(),

                    # Son proyectos históricos
                    "status":
                        "finalizado"
                }

                # ---------------------------------
                # Insertar o actualizar
                # ---------------------------------

                if project is None:

                    project = Project(
                        **data
                    )

                    db.add(project)

                    inserted += 1

                    print(
                        f"[INSERTADO] "
                        f"{erp_id} - "
                        f"{data['project_code']}"
                    )

                else:

                    for key, value in data.items():
                        setattr(
                            project,
                            key,
                            value
                        )

                    updated += 1

                    print(
                        f"[ACTUALIZADO] "
                        f"{erp_id} - "
                        f"{data['project_code']}"
                    )

            except Exception as error:

                errors += 1

                print(
                    f"\n[ERROR] ERP_ID={row.get('ERP_ID')}"
                )

                print(error)

        # -----------------------------------------
        # 5. Confirmar transacción
        # -----------------------------------------

        db.commit()

        print("\n========================================")
        print(" IMPORTACIÓN TERMINADA")
        print("========================================")

        print(
            f"Insertados : {inserted}"
        )

        print(
            f"Actualizados: {updated}"
        )

        print(
            f"Errores    : {errors}"
        )

        print(
            f"Total CSV  : {len(df)}"
        )

    except Exception as error:

        db.rollback()

        print(
            "\nERROR GENERAL:"
        )

        print(error)

    finally:

        db.close()


if __name__ == "__main__":
    import_projects()