const API_URL = "https://minha-api-node.azurewebsites.net"; // sem / no final

export async function criarMatricula(dadosDaMatricula) {
  const response = await fetch(`${API_URL}/matricula`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dadosDaMatricula),
  });
  return response.json();
}