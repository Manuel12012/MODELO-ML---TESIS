import os

from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, DeclarativeBase


# Cargar las variables del archivo .env
load_dotenv()


# Obtener la URL de conexión
DATABASE_URL = os.getenv("DATABASE_URL")


# Verificar que exista la variable
if not DATABASE_URL:
    raise ValueError("DATABASE_URL no está configurada en el archivo .env")


# Crear el motor de conexión
engine = create_engine(
    DATABASE_URL,
    echo=False
)


# Crear la fábrica de sesiones
SessionLocal = sessionmaker(
    bind=engine,
    autoflush=False,
    autocommit=False
)


# Clase base para los modelos SQLAlchemy
class Base(DeclarativeBase):
    pass


# Dependencia para obtener una sesión de PostgreSQL
def get_db():
    db = SessionLocal()

    try:
        yield db
    finally:
        db.close()