# FastAPI + Machine Learning API

API desarrollada con **FastAPI** para servir modelos de Machine Learning utilizando **scikit-learn**.

## 🛠️ Tecnologías

- Python 3.10+
- FastAPI
- Uvicorn
- Pandas
- Joblib
- Scikit-learn

## 🚀 Instalación y ejecución

Clonar el repositorio:

```bash
git clone <URL_DEL_REPOSITORIO>
cd <NOMBRE_DEL_PROYECTO>

Crear el entorno virtual:

python -m venv .venv

Activar el entorno virtual:

Windows - CMD:

.venv\Scripts\activate

Windows - PowerShell:

.venv\Scripts\Activate.ps1

macOS / Linux:

source .venv/bin/activate

Actualizar pip:

python -m pip install --upgrade pip

Instalar las dependencias:

pip install -r requirements.txt

Ejecutar la aplicación:

uvicorn main:app --reload

La API estará disponible en:

http://127.0.0.1:8000

Documentación interactiva:

http://127.0.0.1:8000/docs

Redoc:

http://127.0.0.1:8000/redoc

📦 requirements.txt
fastapi
uvicorn[standard]
pandas
joblib
scikit-learn

📁 Estructura del proyecto
.
├── .venv/
├── main.py
├── requirements.txt
├── .gitignore
└── README.md

🔄 Desarrollo
Para iniciar el servidor en modo desarrollo:

uvicorn main:app --reload

El parámetro --reload reinicia automáticamente el servidor cuando se detectan cambios en el código.

Para detener el servidor:

Ctrl + C

🔐 Entorno virtual
Si vuelves a abrir el proyecto posteriormente, no necesitas crear el entorno virtual nuevamente. Solo debes activarlo.

Windows:

.venv\Scripts\activate

macOS / Linux:

source .venv/bin/activate

Para salir del entorno virtual:

deactivate

➕ Agregar dependencias
Para instalar una nueva librería:

pip install <nombre-paquete>

Por ejemplo:

pip install requests

Para actualizar el archivo requirements.txt:

pip freeze > requirements.txt

🚫 .gitignore
Se recomienda agregar:

.venv/
__pycache__/
*.pyc
.env

📄 Licencia
Proyecto personal y educativo.