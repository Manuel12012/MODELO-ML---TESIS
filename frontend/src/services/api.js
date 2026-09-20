const API_URL = "http://127.0.0.1:8000";

// ============================================================
// OBTENER TODOS LOS PROYECTOS
// ============================================================

export async function getProjects() {
  const response = await fetch(`${API_URL}/projects/`, {
    method: "GET",

    headers: {
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Error al obtener los proyectos");
  }

  return await response.json();
}

// ============================================================
// OBTENER UN PROYECTO POR ID
// ============================================================

export async function getProjectById(projectId) {
  const response = await fetch(`${API_URL}/projects/${projectId}`, {
    method: "GET",

    headers: {
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Error al obtener el proyecto");
  }

  return await response.json();
}

// ============================================================
// REALIZAR PREDICCIÓN SOBRE UN PROYECTO
// ============================================================

export async function predictProjectById(projectId) {
  const response = await fetch(`${API_URL}/projects/${projectId}/predict`, {
    method: "POST",

    headers: {
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    let errorMessage = "Error al realizar la predicción";

    try {
      const errorData = await response.json();

      if (errorData.detail) {
        errorMessage = errorData.detail;
      }
    } catch (error) {
      console.error("No se pudo leer el error:", error);
    }

    throw new Error(errorMessage);
  }

  return await response.json();
}

// ============================================================
// ENDPOINT ANTIGUO /predict
// ============================================================
// Se mantiene por compatibilidad.
// ============================================================

export async function predictProject(project) {
  const response = await fetch(`${API_URL}/predict`, {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },

    body: JSON.stringify(project),
  });

  if (!response.ok) {
    throw new Error("Error al realizar la predicción");
  }

  return await response.json();
}

// ============================================================
// REGISTRAR RESULTADO REAL DEL PROYECTO
// ============================================================

export async function registerProjectResult(projectId, resultData) {
  const response = await fetch(`${API_URL}/projects/${projectId}/result`, {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },

    body: JSON.stringify(resultData),
  });

  if (!response.ok) {
    let errorMessage = "Error al registrar el resultado del proyecto";

    try {
      const errorData = await response.json();

      if (errorData.detail) {
        errorMessage = errorData.detail;
      }
    } catch (error) {
      console.error("No se pudo leer el error:", error);
    }

    throw new Error(errorMessage);
  }

  return await response.json();
}

export async function getEvaluationComparisons() {
  const response = await fetch(`${API_URL}/evaluations/comparison`, {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    let errorMessage = "Error al obtener las evaluaciones";

    try {
      const errorData = await response.json();

      if (errorData.detail) {
        errorMessage = errorData.detail;
      }
    } catch (error) {
      console.error("No se pudo leer el error:", error);
    }

    throw new Error(errorMessage);
  }

  return await response.json();
}
