const { BlobServiceClient } = require('@azure/storage-blob');
const { v4: uuidv4 } = require('uuid');

class BlobService {
  constructor() {
    // Usar SAS URL em vez de connection string
    this.blobSasUrl = process.env.AZURE_BLOB_SAS_URL || 'https://arquivosalunos.blob.core.windows.net/?sv=2024-11-04&ss=bfqt&srt=c&sp=rwdlacupiytfx&se=2026-06-28T21:21:06Z&st=2025-06-28T13:21:06Z&spr=https&sig=tgFdtvzm4MOJZIEPl4qpfST79zQpPrXbkaUtnELMWcQ%3D';
    this.containerName = process.env.AZURE_STORAGE_CONTAINER || 'documentos-matricula';
    this.blobServiceClient = null;
    this.containerClient = null;
    
    this.initialize();
  }

  initialize() {
    try {
      // Usar SAS URL para criar o cliente
      this.blobServiceClient = new BlobServiceClient(this.blobSasUrl);
      this.containerClient = this.blobServiceClient.getContainerClient(this.containerName);
      console.log('✅ Azure Blob Storage inicializado com SAS Token');
    } catch (error) {
      console.error('❌ Erro ao inicializar Azure Blob Storage:', error);
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

      // Upload do arquivo usando uploadData para buffer
      await blockBlobClient.uploadData(file.buffer, {
        blobHTTPHeaders: {
          blobContentType: file.mimetype
        }
      });

      console.log(`✅ Arquivo enviado com sucesso: ${fileName}`);

      // Retornar informações do arquivo
      return {
        url: blockBlobClient.url,
        nomeArquivo: fileName,
        tamanho: file.size,
        mimeType: file.mimetype
      };

    } catch (error) {
      console.error('❌ Erro no upload para Azure Blob:', error);
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
      console.log(`✅ Arquivo deletado com sucesso: ${fileName}`);
      return true;
    } catch (error) {
      console.error('❌ Erro ao deletar arquivo do Azure Blob:', error);
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
      console.error('❌ Erro ao obter URL do arquivo:', error);
      throw new Error(`Falha ao obter URL: ${error.message}`);
    }
  }

  // Método para listar arquivos no container
  async listDocuments(prefix = '') {
    if (!this.containerClient) {
      throw new Error('Azure Blob Storage não configurado');
    }

    try {
      const blobs = [];
      for await (const blob of this.containerClient.listBlobsFlat({ prefix })) {
        blobs.push({
          name: blob.name,
          size: blob.properties.contentLength,
          lastModified: blob.properties.lastModified,
          url: `${this.containerClient.url}/${blob.name}`
        });
      }
      return blobs;
    } catch (error) {
      console.error('❌ Erro ao listar arquivos:', error);
      throw new Error(`Falha ao listar arquivos: ${error.message}`);
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