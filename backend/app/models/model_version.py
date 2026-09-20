from sqlalchemy import Integer, String, Boolean, DateTime, Text
from sqlalchemy.orm import Mapped, mapped_column
from datetime import datetime

from app.database import Base


class ModelVersion(Base):
    __tablename__ = "model_versions"

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True
    )

    version: Mapped[str] = mapped_column(
        String(100),
        nullable=False
    )

    algorithm: Mapped[str] = mapped_column(
        String(100),
        nullable=False
    )

    model_path: Mapped[str | None] = mapped_column(
        String(255),
        nullable=True
    )

    description: Mapped[str | None] = mapped_column(
        Text,
        nullable=True
    )

    is_active: Mapped[bool] = mapped_column(
        Boolean,
        nullable=False
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        nullable=False
    )