from sqlalchemy import Integer, Numeric, Boolean, DateTime, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column
from datetime import datetime

from app.database import Base


class ActualResult(Base):
    __tablename__ = "actual_results"

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True
    )

    project_id: Mapped[int] = mapped_column(
        Integer,
        ForeignKey("projects.id"),
        nullable=False
    )

    actual_days: Mapped[int | None] = mapped_column(
        Integer,
        nullable=True
    )

    actual_cost_pen: Mapped[float | None] = mapped_column(
        Numeric(12, 2),
        nullable=True
    )

    actual_defects: Mapped[int | None] = mapped_column(
        Integer,
        nullable=True
    )

    actual_delay_pct: Mapped[float | None] = mapped_column(
        Numeric(10, 4),
        nullable=True
    )

    actual_overrun_pct: Mapped[float | None] = mapped_column(
        Numeric(10, 4),
        nullable=True
    )

    actual_defect_density: Mapped[float | None] = mapped_column(
        Numeric(10, 4),
        nullable=True
    )

    actual_success: Mapped[bool | None] = mapped_column(
        Boolean,
        nullable=True
    )

    completed_at: Mapped[datetime | None] = mapped_column(
        DateTime,
        nullable=True
    )