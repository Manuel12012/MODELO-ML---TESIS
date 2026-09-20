from sqlalchemy import Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column
from datetime import datetime

from app.database import Base


class AuditLog(Base):
    __tablename__ = "audit_logs"

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True
    )

    user_id: Mapped[int | None] = mapped_column(
        Integer,
        ForeignKey("users.id"),
        nullable=True
    )

    action: Mapped[str] = mapped_column(
        String(100),
        nullable=False
    )

    entity: Mapped[str | None] = mapped_column(
        String(100),
        nullable=True
    )

    entity_id: Mapped[int | None] = mapped_column(
        Integer,
        nullable=True
    )

    details: Mapped[str | None] = mapped_column(
        Text,
        nullable=True
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        nullable=False
    )