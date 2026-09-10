const API_URL = "http://127.0.0.1:8000";


export async function predictProject(project) {

  const response = await fetch(
    `${API_URL}/predict`,
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },

      body: JSON.stringify(project)
    }
  );


  if (!response.ok) {

    throw new Error(
      "Error al realizar la predicción"
    );

  }


  return await response.json();
}
