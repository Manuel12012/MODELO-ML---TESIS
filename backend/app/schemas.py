from pydantic import BaseModel, Field


class ProjectInput(BaseModel):
    planned_days: float = Field(gt=0)
    budget_pen: float = Field(gt=0)
    kloc: float = Field(gt=0)

    region: str
    service_line: str
    pm_code: str
    sys_node: str


class PredictionResults(BaseModel):
    actual_days: float
    actual_cost_pen: float
    defects: float


class IndicatorResults(BaseModel):
    retraso_porcentaje: float
    sobrecosto_porcentaje: float
    densidad_defectos: float


class PredictionResponse(BaseModel):
    predicciones: PredictionResults
    indicadores: IndicatorResults
