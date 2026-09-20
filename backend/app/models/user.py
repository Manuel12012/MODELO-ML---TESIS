from sqlalchemy import Integer, String, Boolean, DateTime
from sqlalchemy.orm import Mapped, mapped_column
from datetime import datetime

from app.database import Base


class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True
    )

    username: Mapped[str] = mapped_column(
        String(100),
        nullable=False
    )

    full_name: Mapped[str | None] = mapped_column(
        String(150),
        nullable=True
    )

    email: Mapped[str] = mapped_column(
        String(150),
        nullable=False
    )

    password_hash: Mapped[str] = mapped_column(
        String(255),
        nullable=False
    )

    role: Mapped[str] = mapped_column(
        String(50),
        nullable=False
    )

    is_active: Mapped[bool] = mapped_column(
        Boolean,
        nullable=False
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        nullable=False
    )