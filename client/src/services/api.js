export async function enviarMatricula(dados) {
  const response = await fetch('/api/matricula', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dados),
  });
  return await response.json();
} 