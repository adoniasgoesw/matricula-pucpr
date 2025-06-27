const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  // Método genérico para fazer requisições
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    
    const defaultOptions = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    };

    const config = { ...defaultOptions, ...options };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.erro || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // Criar nova matrícula
  async criarMatricula(dadosMatricula) {
    return this.request('/matricula', {
      method: 'POST',
      body: JSON.stringify(dadosMatricula),
    });
  }

  // Obter status da matrícula
  async getStatusMatricula(matriculaId) {
    return this.request(`/status/${matriculaId}`);
  }

  // Upload de documento
  async uploadDocumento(matriculaId, tipoDocumento, arquivo) {
    const formData = new FormData();
    formData.append('arquivo', arquivo);
    formData.append('matriculaId', matriculaId);
    formData.append('tipo', tipoDocumento);

    return this.request('/documento', {
      method: 'POST',
      headers: {}, // Remover Content-Type para FormData
      body: formData,
    });
  }

  // Processar pagamento
  async processarPagamento(matriculaId, metodo, dados = {}) {
    return this.request('/pagamento', {
      method: 'POST',
      body: JSON.stringify({
        matriculaId,
        metodo,
        dados,
      }),
    });
  }

  // Gerar contrato
  async gerarContrato(matriculaId) {
    return this.request(`/contrato/${matriculaId}`);
  }

  // Listar matrículas (admin)
  async listarMatriculas(page = 1, limit = 10, status = null) {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });
    
    if (status) {
      params.append('status', status);
    }

    return this.request(`/admin/matriculas?${params}`);
  }

  // Atualizar status da matrícula (admin)
  async atualizarStatusMatricula(matriculaId, status) {
    return this.request(`/admin/matricula/${matriculaId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  }

  // Health check
  async healthCheck() {
    return this.request('/health');
  }
}

// Instância singleton do serviço
const apiService = new ApiService();

export default apiService; 