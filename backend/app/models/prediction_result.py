from datetime import datetime

from sqlalchemy import Integer, Numeric, DateTime, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base


class PredictionResult(Base):
    __tablename__ = "prediction_results"

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True
    )

    evaluation_id: Mapped[int] = mapped_column(
        Integer,
        ForeignKey("prediction_evaluations.id"),
        nullable=False
    )

    predicted_delay_pct: Mapped[float | None] = mapped_column(
        Numeric,
        nullable=True
    )

    predicted_overrun_pct: Mapped[float | None] = mapped_column(
        Numeric,
        nullable=True
    )

    predicted_defect_density: Mapped[float | None] = mapped_column(
        Numeric,
        nullable=True
    )

    predicted_success: Mapped[bool | None] = mapped_column(
        nullable=True
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
        nullable=False
    )