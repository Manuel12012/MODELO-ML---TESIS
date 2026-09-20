from datetime import datetime

from sqlalchemy import Integer, DateTime, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base


class PredictionEvaluation(Base):
    __tablename__ = "prediction_evaluations"

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True
    )

    project_id: Mapped[int] = mapped_column(
        Integer,
        ForeignKey("projects.id"),
        nullable=False
    )

    user_id: Mapped[int] = mapped_column(
        Integer,
        ForeignKey("users.id"),
        nullable=False
    )

    model_version_id: Mapped[int] = mapped_column(
        Integer,
        ForeignKey("model_versions.id"),
        nullable=False
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
        nullable=False
    )