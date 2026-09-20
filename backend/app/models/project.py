from sqlalchemy import Integer, String, Numeric, DateTime
from sqlalchemy.orm import Mapped, mapped_column
from datetime import datetime

from app.database import Base


class Project(Base):
    __tablename__ = "projects"

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True
    )

    erp_id: Mapped[str | None] = mapped_column(
        String(50),
        unique=True,
        nullable=True
    )

    project_code: Mapped[str] = mapped_column(
        String(50),
        nullable=False
    )

    region: Mapped[str | None] = mapped_column(
        String(100),
        nullable=True
    )

    service_line: Mapped[str | None] = mapped_column(
        String(100),
        nullable=True
    )

    planned_days: Mapped[int | None] = mapped_column(
        Integer,
        nullable=True
    )

    actual_days: Mapped[int | None] = mapped_column(
        Integer,
        nullable=True
    )

    budget_pen: Mapped[float | None] = mapped_column(
        Numeric(12, 2),
        nullable=True
    )

    revenue_pen: Mapped[float | None] = mapped_column(
        Numeric(12, 2),
        nullable=True
    )

    actual_cost_pen: Mapped[float | None] = mapped_column(
        Numeric(12, 2),
        nullable=True
    )

    profit_pen: Mapped[float | None] = mapped_column(
        Numeric(12, 2),
        nullable=True
    )

    kloc: Mapped[float | None] = mapped_column(
        Numeric(10, 3),
        nullable=True
    )

    defects: Mapped[int | None] = mapped_column(
        Integer,
        nullable=True
    )

    pm_code: Mapped[str | None] = mapped_column(
        String(50),
        nullable=True
    )

    sys_node: Mapped[str | None] = mapped_column(
        String(50),
        nullable=True
    )

    status: Mapped[str] = mapped_column(
        String(20),
        default="en_ejecucion",
        nullable=False
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
        nullable=False
    )