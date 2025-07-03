const axios = require('axios');

class AzureFunctionsService {
  constructor() {
    // URL base das Azure Functions (será configurada via variável de ambiente)
    this.baseUrl = process.env.AZURE_FUNCTIONS_URL || 'https://funcoes-matricula.azurewebsites.net/api';
    this.functionKey = process.env.AZURE_FUNCTIONS_KEY || '';
  }

  // Configurar headers para autenticação
  getHeaders() {
    const headers = {
      'Content-Type': 'application/json'
    };

    if (this.functionKey) {
      headers['x-functions-key'] = this.functionKey;
    }

    return headers;
  }

  // Validar pagamento
  async validarPagamento(matriculaId, metodo, valor, dados = {}) {
    try {
      console.log(`🔄 Chamando Azure Function: validarPagamento para matrícula ${matriculaId}`);
      
      const response = await axios.post(
        `${this.baseUrl}/validar-pagamento`,
        {
          matriculaId,
          metodo,
          valor,
          dados
        },
        {
          headers: this.getHeaders(),
          timeout: 30000 // 30 segundos
        }
      );

      console.log(`✅ Pagamento validado via Azure Function: ${response.data.status}`);
      return response.data;

    } catch (error) {
      console.error('❌ Erro ao validar pagamento via Azure Function:', error.message);
      
      // Em caso de erro, retornar resposta simulada
      return {
        matriculaId,
        status: 'ERRO',
        mensagem: 'Erro na validação de pagamento',
        erro: error.message
      };
    }
  }

  // Validar documento
  async validarDocumento(documentoId) {
    try {
      console.log(`🔄 Chamando Azure Function: validarDocumento para documento ${documentoId}`);
      
      const response = await axios.post(
        `${this.baseUrl}/validar-documento`,
        { documentoId },
        {
          headers: this.getHeaders(),
          timeout: 30000
        }
      );

      console.log(`✅ Documento validado via Azure Function: ${response.data.status}`);
      return response.data;

    } catch (error) {
      console.error('❌ Erro ao validar documento via Azure Function:', error.message);
      
      return {
        documentoId,
        status: 'ERRO',
        mensagem: 'Erro na validação de documento',
        erro: error.message
      };
    }
  }

  // Gerar contrato
  async gerarContrato(matriculaId) {
    try {
      console.log(`🔄 Chamando Azure Function: gerarContrato para matrícula ${matriculaId}`);
      
      const response = await axios.post(
        `${this.baseUrl}/gerar-contrato`,
        { matriculaId },
        {
          headers: this.getHeaders(),
          timeout: 60000 // 60 segundos para geração de contrato
        }
      );

      console.log(`✅ Contrato gerado via Azure Function: ${response.data.numeroContrato}`);
      return response.data;

    } catch (error) {
      console.error('❌ Erro ao gerar contrato via Azure Function:', error.message);
      
      return {
        matriculaId,
        status: 'ERRO',
        mensagem: 'Erro na geração de contrato',
        erro: error.message
      };
    }
  }

  // Notificar estudante
  async notificarEstudante(matriculaId, tipoNotificacao, dadosAdicionais = {}) {
    try {
      console.log(`🔄 Chamando Azure Function: notificarEstudante para matrícula ${matriculaId}`);
      
      const response = await axios.post(
        `${this.baseUrl}/notificar-estudante`,
        {
          matriculaId,
          tipoNotificacao,
          dadosAdicionais
        },
        {
          headers: this.getHeaders(),
          timeout: 30000
        }
      );

      console.log(`✅ Notificação enviada via Azure Function: ${response.data.tipoNotificacao}`);
      return response.data;

    } catch (error) {
      console.error('❌ Erro ao notificar estudante via Azure Function:', error.message);
      
      return {
        matriculaId,
        tipoNotificacao,
        enviado: false,
        mensagem: 'Erro no envio de notificação',
        erro: error.message
      };
    }
  }

  // Testar conectividade com Azure Functions
  async testarConectividade() {
    try {
      console.log('🧪 Testando conectividade com Azure Functions...');
      
      // Tentar uma chamada simples para verificar se está funcionando
      const response = await axios.get(
        `${this.baseUrl}/validar-pagamento`,
        {
          headers: this.getHeaders(),
          timeout: 10000
        }
      );

      console.log('✅ Azure Functions está acessível');
      return {
        status: 'OK',
        mensagem: 'Azure Functions está funcionando',
        url: this.baseUrl
      };

    } catch (error) {
      console.error('❌ Azure Functions não está acessível:', error.message);
      
      return {
        status: 'ERRO',
        mensagem: 'Azure Functions não está acessível',
        erro: error.message,
        url: this.baseUrl
      };
    }
  }

  // Executar workflow completo de matrícula
  async executarWorkflowMatricula(matriculaId) {
    try {
      console.log(`🚀 Executando workflow completo para matrícula ${matriculaId}`);
      
      const resultados = {
        matriculaId,
        etapas: [],
        sucesso: true
      };

      // 1. Notificar criação da matrícula
      const notificacao1 = await this.notificarEstudante(matriculaId, 'MATRICULA_CRIADA');
      resultados.etapas.push({
        etapa: 'Notificação de Criação',
        sucesso: notificacao1.enviado !== false,
        resultado: notificacao1
      });

      // 2. Validar documentos (se existirem)
      // Esta etapa seria chamada quando documentos fossem enviados
      resultados.etapas.push({
        etapa: 'Validação de Documentos',
        sucesso: true,
        resultado: { mensagem: 'Aguardando envio de documentos' }
      });

      // 3. Validar pagamento (se existir)
      // Esta etapa seria chamada quando pagamento fosse processado
      resultados.etapas.push({
        etapa: 'Validação de Pagamento',
        sucesso: true,
        resultado: { mensagem: 'Aguardando processamento de pagamento' }
      });

      // 4. Gerar contrato (quando todas as condições forem atendidas)
      // Esta etapa seria chamada automaticamente
      resultados.etapas.push({
        etapa: 'Geração de Contrato',
        sucesso: true,
        resultado: { mensagem: 'Aguardando aprovação de documentos e pagamento' }
      });

      console.log(`✅ Workflow executado com sucesso para matrícula ${matriculaId}`);
      return resultados;

    } catch (error) {
      console.error('❌ Erro no workflow de matrícula:', error.message);
      
      return {
        matriculaId,
        etapas: [],
        sucesso: false,
        erro: error.message
      };
    }
  }
}

module.exports = new AzureFunctionsService(); 