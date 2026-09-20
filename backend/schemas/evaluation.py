from datetime import datetime

from pydantic import BaseModel


class PredictionEvaluationResponse(BaseModel):
    evaluation_id: int
    project_id: int
    project_code: str
    user_id: int
    model_version_id: int
    created_at: datetime
    predicted_delay_pct: float | None
    predicted_overrun_pct: float | None
    predicted_defect_density: float | None
    predicted_success: bool | None

    class Config:
        from_attributes = True