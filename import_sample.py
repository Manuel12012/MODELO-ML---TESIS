import sys
from pathlib import Path

import pandas as pd


# ============================================================
# CONFIGURACIÓN DE RUTAS
# ============================================================

BASE_DIR = Path(__file__).resolve().parent

BACKEND_DIR = BASE_DIR / "backend"

SAMPLE_FILE = BASE_DIR / "muestra_200_proyectos.csv"


# Permitir importar módulos desde backend/
sys.path.insert(0, str(BACKEND_DIR))


# ============================================================
# IMPORTACIONES DEL BACKEND
# ============================================================

from app.database import SessionLocal
from app.models.project import Project


# ============================================================
# IMPORTAR PROYECTOS
# ============================================================

def import_projects():

    print("=" * 60)
    print("IMPORTACIÓN DE MUESTRA A POSTGRESQL")
    print("=" * 60)

    # --------------------------------------------------------
    # Verificar archivo
    # --------------------------------------------------------

    if not SAMPLE_FILE.exists():

        raise FileNotFoundError(
            f"No se encontró: {SAMPLE_FILE}"
        )

    print(
        f"\nArchivo: {SAMPLE_FILE.name}"
    )

    # --------------------------------------------------------
    # Leer CSV
    # --------------------------------------------------------

    df = pd.read_csv(SAMPLE_FILE)

    print(
        f"Proyectos encontrados: {len(df)}"
    )

    if len(df) != 200:

        raise ValueError(
            f"Se esperaban 200 proyectos, "
            f"pero se encontraron {len(df)}."
        )

    # --------------------------------------------------------
    # Conectar a PostgreSQL
    # --------------------------------------------------------

    db = SessionLocal()

    try:

        # ----------------------------------------------------
        # Verificar que projects esté vacío
        # ----------------------------------------------------

        existing_count = db.query(Project).count()

        print(
            f"Proyectos existentes en PostgreSQL: "
            f"{existing_count}"
        )

        if existing_count > 0:

            raise ValueError(
                "La tabla projects no está vacía. "
                "No se realizará la importación."
            )

        # ----------------------------------------------------
        # Crear proyectos
        # ----------------------------------------------------

        projects = []

        for _, row in df.iterrows():

            project = Project(

                erp_id=str(row["ERP_ID"]),

                project_code=str(
                    row["PROJECT_CODE"]
                ),

                region=str(
                    row["REGION"]
                ),

                service_line=str(
                    row["SERVICE_LINE"]
                ),

                planned_days=int(
                    row["PLANNED_DAYS"]
                ),

                actual_days=int(
                    row["ACTUAL_DAYS"]
                ),

                budget_pen=float(
                    row["BUDGET_PEN"]
                ),

                revenue_pen=float(
                    row["REVENUE_PEN"]
                ),

                actual_cost_pen=float(
                    row["ACTUAL_COST_PEN"]
                ),

                profit_pen=float(
                    row["PROFIT_PEN"]
                ),

                kloc=float(
                    row["KLOC"]
                ),

                defects=int(
                    row["DEFECTS"]
                ),

                pm_code=str(
                    row["PM_CODE"]
                ),

                sys_node=str(
                    row["SYS_NODE"]
                )
            )

            projects.append(project)

        # ----------------------------------------------------
        # Guardar
        # ----------------------------------------------------

        db.add_all(projects)

        db.commit()

        print(
            f"\n✓ {len(projects)} proyectos "
            "insertados correctamente."
        )

    except Exception:

        db.rollback()

        raise

    finally:

        db.close()

    print("\n" + "=" * 60)
    print("IMPORTACIÓN COMPLETADA")
    print("=" * 60)


# ============================================================
# EJECUCIÓN
# ============================================================

if __name__ == "__main__":

    import_projects()