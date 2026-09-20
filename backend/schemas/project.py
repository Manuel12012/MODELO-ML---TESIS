from pydantic import BaseModel
from typing import Optional


class ProjectCreate(BaseModel):
    erp_id: Optional[str] = None
    project_code: str
    region: Optional[str] = None
    service_line: Optional[str] = None
    planned_days: Optional[int] = None
    actual_days: Optional[int] = None
    budget_pen: Optional[float] = None
    revenue_pen: Optional[float] = None
    actual_cost_pen: Optional[float] = None
    profit_pen: Optional[float] = None
    kloc: Optional[float] = None
    defects: Optional[int] = None
    pm_code: Optional[str] = None
    sys_node: Optional[str] = None


class ProjectResponse(ProjectCreate):
    id: int
    status: str

    class Config:
        from_attributes = True


class ProjectResultCreate(BaseModel):
    actual_days: int
    actual_cost_pen: float
    actual_defects: int


class ProjectResultResponse(BaseModel):
    message: str
    project_id: int
    project_code: str
    status: str
    actual_days: int
    actual_cost_pen: float
    actual_defects: int
    delay_pct: float
    overrun_pct: float
    defect_density: float