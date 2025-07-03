const API_URL = import.meta.env.VITE_API_URL;

export async function criarMatricula(dadosDaMatricula) {
  const response = await fetch(`${API_URL}/matricula`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dadosDaMatricula),
  });
  return response.json();
}