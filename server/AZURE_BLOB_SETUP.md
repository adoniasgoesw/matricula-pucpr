# Configuração do Azure Blob Storage

Este documento explica como configurar e usar o Azure Blob Storage para upload de documentos no sistema de matrícula PUC.

## 🔧 Configuração

### 1. Variáveis de Ambiente

Crie um arquivo `.env` na pasta `server/` com as seguintes configurações:

```env
# Configurações do Azure Blob Storage (SAS Token)
AZURE_BLOB_SAS_URL=https://arquivosalunos.blob.core.windows.net/?sv=2024-11-04&ss=bfqt&srt=c&sp=rwdlacupiytfx&se=2026-06-28T21:21:06Z&st=2025-06-28T13:21:06Z&spr=https&sig=tgFdtvzm4MOJZIEPl4qpfST79zQpPrXbkaUtnELMWcQ%3D
AZURE_STORAGE_CONTAINER=documentos-matricula
```

### 2. Testar a Conexão

Execute o script de teste para verificar se a configuração está correta:

```bash
npm run test:azure
```

## 📁 Estrutura de Arquivos

Os documentos são organizados no container da seguinte forma:

```
documentos-matricula/
├── {matriculaId}/
│   ├── RG/
│   │   └── {uuid}.pdf
│   ├── CPF/
│   │   └── {uuid}.pdf
│   ├── RESIDENCIA/
│   │   └── {uuid}.pdf
│   ├── HISTORICO/
│   │   └── {uuid}.pdf
│   ├── CERTIFICADO/
│   │   └── {uuid}.pdf
│   └── FOTO/
│       └── {uuid}.jpg
```

## 🚀 Como Usar

### 1. Upload de Documento

**Endpoint:** `POST /api/documento`

**Formato:** `multipart/form-data`

**Campos:**
- `arquivo`: Arquivo (PDF, JPEG, PNG)
- `matriculaId`: ID da matrícula
- `tipo`: Tipo do documento (RG, CPF, RESIDENCIA, HISTORICO, CERTIFICADO, FOTO)

**Exemplo:**
```bash
curl -X POST http://localhost:3000/api/documento \
  -F "arquivo=@documento.pdf" \
  -F "matriculaId=123" \
  -F "tipo=RG"
```

### 2. Teste de Upload

**Endpoint:** `POST /api/test/upload`

**Formato:** `multipart/form-data`

**Campos:**
- `arquivo`: Arquivo para teste

**Exemplo:**
```bash
curl -X POST http://localhost:3000/api/test/upload \
  -F "arquivo=@teste.pdf"
```

### 3. Listar Documentos

**Endpoint:** `GET /api/test/documentos`

**Parâmetros opcionais:**
- `prefix`: Prefixo para filtrar arquivos

**Exemplo:**
```bash
curl http://localhost:3000/api/test/documentos?prefix=123/
```

## 📋 Tipos de Documento Suportados

- **RG**: Documento de identidade
- **CPF**: Cadastro de pessoa física
- **RESIDENCIA**: Comprovante de residência
- **HISTORICO**: Histórico escolar
- **CERTIFICADO**: Certificados diversos
- **FOTO**: Foto do aluno

## 🔒 Validações

### Tipos de Arquivo Permitidos
- `application/pdf`
- `image/jpeg`
- `image/png`
- `image/jpg`

### Tamanho Máximo
- **10MB** por arquivo

### Validações de Negócio
- Apenas um documento por tipo por matrícula
- Matrícula deve existir antes do upload
- Nome do arquivo é gerado automaticamente com UUID

## 🛠️ Serviço BlobService

O serviço principal está em `services/blobService.js` e oferece os seguintes métodos:

### `uploadDocument(file, matriculaId, tipoDocumento)`
Faz upload de um documento para o Azure Blob Storage.

### `deleteDocument(fileName)`
Remove um documento do Azure Blob Storage.

### `getDocumentUrl(fileName)`
Retorna a URL pública de um documento.

### `listDocuments(prefix)`
Lista todos os documentos com um prefixo específico.

## 🔍 Monitoramento

### Logs
O serviço gera logs detalhados para:
- ✅ Uploads bem-sucedidos
- ❌ Erros de upload
- ⚠️ Configurações ausentes

### Métricas
- Tamanho dos arquivos
- Tipos de arquivo
- Taxa de sucesso/erro

## 🚨 Troubleshooting

### Erro 403 - Forbidden
- Verificar se o SAS Token está correto
- Verificar se as permissões estão configuradas
- Verificar se o container existe

### Erro de Upload
- Verificar se o arquivo não excede 10MB
- Verificar se o tipo de arquivo é permitido
- Verificar se a matrícula existe

### Container não encontrado
- O container será criado automaticamente se não existir
- Verificar se o SAS Token tem permissão de criação

## 🔐 Segurança

- SAS Token com prazo de expiração
- Validação de tipos de arquivo
- Limite de tamanho de arquivo
- Nomes de arquivo únicos (UUID)
- Rate limiting nas rotas

## 📚 Recursos Adicionais

- [Azure Blob Storage Documentation](https://docs.microsoft.com/en-us/azure/storage/blobs/)
- [Azure Storage SDK for JavaScript](https://docs.microsoft.com/en-us/javascript/api/overview/azure/storage-blob-readme)
- [SAS Token Best Practices](https://docs.microsoft.com/en-us/azure/storage/common/storage-sas-overview) 