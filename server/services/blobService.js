const { BlobServiceClient } = require('@azure/storage-blob');
const { v4: uuidv4 } = require('uuid');

class BlobService {
  constructor() {
    this.connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING;
    this.containerName = process.env.AZURE_STORAGE_CONTAINER || 'documentos-puc';
    this.blobServiceClient = null;
    this.containerClient = null;
    
    if (this.connectionString) {
      this.initialize();
    }
  }

  initialize() {
    try {
      this.blobServiceClient = BlobServiceClient.fromConnectionString(this.connectionString);
      this.containerClient = this.blobServiceClient.getContainerClient(this.containerName);
    } catch (error) {
      console.error('Erro ao inicializar Azure Blob Storage:', error);
    }
  }

  async uploadDocument(file, matriculaId, tipoDocumento) {
    if (!this.containerClient) {
      throw new Error('Azure Blob Storage não configurado');
    }

    try {
      // Validar arquivo
      if (!file || !file.buffer) {
        throw new Error('Arquivo inválido');
      }

      // Validar tipo de arquivo
      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
      if (!allowedTypes.includes(file.mimetype)) {
        throw new Error('Tipo de arquivo não permitido. Use PDF, JPEG ou PNG.');
      }

      // Validar tamanho (máximo 10MB)
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (file.size > maxSize) {
        throw new Error('Arquivo muito grande. Tamanho máximo: 10MB');
      }

      // Gerar nome único para o arquivo
      const fileExtension = file.originalname.split('.').pop();
      const fileName = `${matriculaId}/${tipoDocumento}/${uuidv4()}.${fileExtension}`;
      
      // Obter cliente do blob
      const blockBlobClient = this.containerClient.getBlockBlobClient(fileName);

      // Upload do arquivo
      await blockBlobClient.upload(file.buffer, file.size, {
        blobHTTPHeaders: {
          blobContentType: file.mimetype
        }
      });

      // Retornar informações do arquivo
      return {
        url: blockBlobClient.url,
        nomeArquivo: fileName,
        tamanho: file.size,
        mimeType: file.mimetype
      };

    } catch (error) {
      console.error('Erro no upload para Azure Blob:', error);
      throw new Error(`Falha no upload: ${error.message}`);
    }
  }

  async deleteDocument(fileName) {
    if (!this.containerClient) {
      throw new Error('Azure Blob Storage não configurado');
    }

    try {
      const blockBlobClient = this.containerClient.getBlockBlobClient(fileName);
      await blockBlobClient.delete();
      return true;
    } catch (error) {
      console.error('Erro ao deletar arquivo do Azure Blob:', error);
      throw new Error(`Falha ao deletar arquivo: ${error.message}`);
    }
  }

  async getDocumentUrl(fileName) {
    if (!this.containerClient) {
      throw new Error('Azure Blob Storage não configurado');
    }

    try {
      const blockBlobClient = this.containerClient.getBlockBlobClient(fileName);
      return blockBlobClient.url;
    } catch (error) {
      console.error('Erro ao obter URL do arquivo:', error);
      throw new Error(`Falha ao obter URL: ${error.message}`);
    }
  }

  // Método para simular upload quando Azure não está configurado
  async uploadDocumentSimulado(file, matriculaId, tipoDocumento) {
    console.log('⚠️ Usando upload simulado - Azure Blob Storage não configurado');
    
    return {
      url: `https://simulado.azure.com/documentos/${matriculaId}/${tipoDocumento}/${file.originalname}`,
      nomeArquivo: `${matriculaId}/${tipoDocumento}/${file.originalname}`,
      tamanho: file.size,
      mimeType: file.mimetype
    };
  }
}

module.exports = new BlobService(); 