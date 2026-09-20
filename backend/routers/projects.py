from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import select

from app.models.prediction_evaluation import PredictionEvaluation
from app.models.prediction_result import PredictionResult
from app.services.prediction_service import predict_project
from app.services.indicator_service import calculate_indicators
from app.database import get_db
from app.models.project import Project

from schemas.project import (
    ProjectCreate,
    ProjectResponse,
    ProjectResultCreate,
    ProjectResultResponse
)


router = APIRouter(
    prefix="/projects",
    tags=["Projects"]
)


# ============================================================
# OBTENER TODOS LOS PROYECTOS
# ============================================================

@router.get(
    "/",
    response_model=list[ProjectResponse]
)
def get_projects(
    db: Session = Depends(get_db)
):

    statement = select(Project)

    result = db.execute(statement)

    projects = result.scalars().all()

    return projects


# ============================================================
# OBTENER UN PROYECTO POR ID
# ============================================================

@router.get(
    "/{project_id}",
    response_model=ProjectResponse
)
def get_project(
    project_id: int,
    db: Session = Depends(get_db)
):

    statement = select(Project).where(
        Project.id == project_id
    )

    result = db.execute(statement)

    project = result.scalar_one_or_none()

    if project is None:

        raise HTTPException(
            status_code=404,
            detail="Proyecto no encontrado"
        )

    return project


# ============================================================
# PREDECIR UN PROYECTO
# ============================================================

@router.post("/{project_id}/predict")
def predict_project_by_id(
    project_id: int,
    db: Session = Depends(get_db)
):

    # --------------------------------------------------------
    # 1. Buscar proyecto
    # --------------------------------------------------------

    statement = select(Project).where(
        Project.id == project_id
    )

    result = db.execute(statement)

    project = result.scalar_one_or_none()

    if project is None:

        raise HTTPException(
            status_code=404,
            detail="Proyecto no encontrado"
        )


    # --------------------------------------------------------
    # 2. Preparar datos para el modelo
    # --------------------------------------------------------

    class ProjectData:
        pass

    data = ProjectData()

    data.planned_days = project.planned_days

    data.budget_pen = project.budget_pen

    data.kloc = project.kloc

    data.region = project.region

    data.service_line = project.service_line

    data.pm_code = project.pm_code

    data.sys_node = project.sys_node


    # --------------------------------------------------------
    # 3. Ejecutar modelo ML
    # --------------------------------------------------------

    predictions = predict_project(data)


    # --------------------------------------------------------
    # 4. Calcular indicadores
    # --------------------------------------------------------

    indicators = calculate_indicators(

        planned_days=project.planned_days,

        budget_pen=project.budget_pen,

        kloc=project.kloc,

        actual_days_pred=predictions["actual_days"],

        actual_cost_pred=predictions["actual_cost_pen"],

        defects_pred=predictions["defects"]

    )


    # --------------------------------------------------------
    # 5. Crear evaluación
    # --------------------------------------------------------

    evaluation = PredictionEvaluation(

        project_id=project.id,

        # IMPORTANTE:
        # Cambiar posteriormente por el usuario
        # autenticado realmente.

        user_id=1,

        model_version_id=1

    )

    db.add(evaluation)

    db.flush()


    # --------------------------------------------------------
    # 6. Crear resultado de predicción
    # --------------------------------------------------------

    prediction_result = PredictionResult(

        evaluation_id=evaluation.id,

        predicted_delay_pct=(
            indicators["retraso_porcentaje"]
        ),

        predicted_overrun_pct=(
            indicators["sobrecosto_porcentaje"]
        ),

        predicted_defect_density=(
            indicators["densidad_defectos"]
        ),

        predicted_success=None

    )

    db.add(prediction_result)


    # --------------------------------------------------------
    # 7. Guardar
    # --------------------------------------------------------

    db.commit()

    db.refresh(evaluation)

    db.refresh(prediction_result)


    # --------------------------------------------------------
    # 8. Respuesta
    # --------------------------------------------------------

    return {

        "message": "Predicción realizada correctamente",

        "evaluation_id": evaluation.id,

        "project_id": project.id,

        "project_code": project.project_code,

        "predicciones": {

            "actual_days":
                predictions["actual_days"],

            "actual_cost_pen":
                predictions["actual_cost_pen"],

            "defects":
                predictions["defects"]

        },

        "indicadores": {

            "retraso_porcentaje":
                indicators["retraso_porcentaje"],

            "sobrecosto_porcentaje":
                indicators["sobrecosto_porcentaje"],

            "densidad_defectos":
                indicators["densidad_defectos"]

        }

    }


# ============================================================
# CREAR PROYECTO
# ============================================================

# ============================================================
# CREATE PROJECT
# ============================================================

@router.post("/", response_model=ProjectResponse)
def create_project(
    project_data: ProjectCreate,
    db: Session = Depends(get_db)
):
    project = Project(
        erp_id=project_data.erp_id,
        project_code=project_data.project_code,
        region=project_data.region,
        service_line=project_data.service_line,
        planned_days=project_data.planned_days,
        actual_days=project_data.actual_days,
        budget_pen=project_data.budget_pen,
        revenue_pen=project_data.revenue_pen,
        actual_cost_pen=project_data.actual_cost_pen,
        profit_pen=project_data.profit_pen,
        kloc=project_data.kloc,
        defects=project_data.defects,
        pm_code=project_data.pm_code,
        sys_node=project_data.sys_node,

        # Estado inicial del proyecto
        status="en_ejecucion"
    )

    db.add(project)
    db.commit()
    db.refresh(project)

    return project


# ============================================================
# REGISTRAR RESULTADO REAL DEL PROYECTO
# ============================================================

@router.post(
    "/{project_id}/result",
    response_model=ProjectResultResponse
)
def register_project_result(
    project_id: int,
    result_data: ProjectResultCreate,
    db: Session = Depends(get_db)
):

    # ========================================================
    # 1. BUSCAR PROYECTO
    # ========================================================

    statement = select(Project).where(
        Project.id == project_id
    )

    result = db.execute(statement)

    project = result.scalar_one_or_none()

    if project is None:
        raise HTTPException(
            status_code=404,
            detail="Proyecto no encontrado"
        )


    # ========================================================
    # 2. VALIDACIONES
    # ========================================================

    if result_data.actual_days <= 0:
        raise HTTPException(
            status_code=400,
            detail="Los días reales deben ser mayores que cero"
        )

    if result_data.actual_cost_pen < 0:
        raise HTTPException(
            status_code=400,
            detail="El costo real no puede ser negativo"
        )

    if result_data.actual_defects < 0:
        raise HTTPException(
            status_code=400,
            detail="La cantidad de errores no puede ser negativa"
        )

    if project.planned_days is None or project.planned_days <= 0:
        raise HTTPException(
            status_code=400,
            detail="El proyecto no tiene días planificados válidos"
        )

    if project.budget_pen is None or project.budget_pen <= 0:
        raise HTTPException(
            status_code=400,
            detail="El proyecto no tiene un presupuesto válido"
        )

    if project.kloc is None or project.kloc <= 0:
        raise HTTPException(
            status_code=400,
            detail="El proyecto no tiene un valor KLOC válido"
        )


    # ========================================================
    # 3. GUARDAR RESULTADOS REALES
    # ========================================================

    project.actual_days = result_data.actual_days

    project.actual_cost_pen = result_data.actual_cost_pen

    project.defects = result_data.actual_defects


    # ========================================================
    # 4. CAMBIAR ESTADO
    # ========================================================

    project.status = "finalizado"


    # ========================================================
    # 5. CONVERTIR DECIMAL DE POSTGRESQL A FLOAT
    # ========================================================

    planned_days = float(
        project.planned_days
    )

    budget_pen = float(
        project.budget_pen
    )

    kloc = float(
        project.kloc
    )

    actual_days = float(
        result_data.actual_days
    )

    actual_cost_pen = float(
        result_data.actual_cost_pen
    )

    actual_defects = float(
        result_data.actual_defects
    )


    # ========================================================
    # 6. CALCULAR INDICADORES
    # ========================================================

    delay_pct = (
        (actual_days - planned_days)
        / planned_days
    ) * 100


    overrun_pct = (
        (actual_cost_pen - budget_pen)
        / budget_pen
    ) * 100


    defect_density = (
        actual_defects / kloc
    )


    # ========================================================
    # 7. GUARDAR EN POSTGRESQL
    # ========================================================

    db.commit()

    db.refresh(project)


    # ========================================================
    # 8. RESPUESTA
    # ========================================================

    return {
        "message": "Resultado del proyecto registrado correctamente",

        "project_id": project.id,

        "project_code": project.project_code,

        "status": project.status,

        "actual_days": project.actual_days,

        "actual_cost_pen": float(
            project.actual_cost_pen
        ),

        "actual_defects": project.defects,

        "delay_pct": round(
            delay_pct,
            4
        ),

        "overrun_pct": round(
            overrun_pct,
            4
        ),

        "defect_density": round(
            defect_density,
            4
        )
    }