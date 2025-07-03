const API_URL = "https://matricula-api-h7ejhmdqfggkf3ev.canadacentral-01.azurewebsites.net"; // sem / no final

export async function criarMatricula(dadosDaMatricula) {
  const response = await fetch(`${API_URL}/matricula`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dadosDaMatricula),
  });
  return response.json();
}
