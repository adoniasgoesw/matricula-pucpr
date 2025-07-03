# Guia Completo de Integração Azure - Sistema de Matrícula PUC

Este guia explica como configurar e usar todos os serviços Azure integrados ao sistema de matrícula PUC.

## 🏗️ Arquitetura do Sistema

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend        │    │   Azure         │
│   (React)       │◄──►│   (Express)      │◄──►│   Services      │
└─────────────────┘    └──────────────────┘    └─────────────────┘
                              │                        │
                              │                        │
                              ▼                        ▼
                       ┌──────────────┐    ┌─────────────────────┐
                       │ PostgreSQL   │    │ Azure Functions     │
                       │ Database     │    │ - Validar Pagamento │
                       └──────────────┘    │ - Validar Documento │
                                           │ - Gerar Contrato    │
                                           │ - Notificar Email   │
                                           └─────────────────────┘
                                                       │
                                                       ▼
                                           ┌─────────────────────┐
                                           │ Azure Blob Storage  │
                                           │ - Documentos        │
                                           │ - Contratos         │
                                           └─────────────────────┘
```

## 📋 Serviços Azure Utilizados

### 1. Azure Blob Storage
- **Função:** Armazenamento de documentos e contratos
- **Configuração:** SAS Token para acesso seguro
- **Container:** `documentos-matricula`

### 2. Azure Functions
- **Função:** Processamento serverless
- **Funções:**
  - `ValidarPagamentoFunction`
  - `ValidarDocumentoFunction`
  - `GerarContratoFunction`
  - `NotificarEstudanteFunction`

### 3. PostgreSQL Database
- **Função:** Armazenamento de dados da aplicação
- **Tabelas:** Matrículas, Documentos, Pagamentos, Contratos

## 🚀 Configuração Passo a Passo

### Passo 1: Azure Blob Storage

#### 1.1 Criar Storage Account
1. Portal Azure → "Criar recurso" → "Storage account"
2. Nome: `armazenaarquivosmatricula`
3. Região: Escolher região próxima
4. Performance: Standard
5. Redundância: LRS (para desenvolvimento)

#### 1.2 Criar Container
1. Storage Account → "Containers"
2. "Adicionar container"
3. Nome: `documentos-matricula`
4. Nível de acesso público: Private

#### 1.3 Gerar SAS Token
1. Storage Account → "Assinaturas de acesso compartilhado"
2. Permissões: Leitura, Gravação, Criação, Listagem
3. Validade: 1 ano
4. Copiar URL completa

#### 1.4 Configurar no Backend
```env
AZURE_BLOB_SAS_URL=https://armazenaarquivosmatricula.blob.core.windows.net/?sv=2024-11-04&ss=bfqt&srt=c&sp=rwdlacupiytfx&se=2026-06-28T21:21:06Z&st=2025-06-28T13:21:06Z&spr=https&sig=tgFdtvzm4MOJZIEPl4qpfST79zQpPrXbkaUtnELMWcQ%3D
AZURE_STORAGE_CONTAINER=documentos-matricula
```

### Passo 2: Azure Functions

#### 2.1 Criar Function App
1. Portal Azure → "Criar recurso" → "Function App"
2. Nome: `funcoes-matricula`
3. Publicar: Código
4. Pilha: Node.js 18
5. OS: Linux
6. Plano: Consumption (Serverless)

#### 2.2 Configurar Variáveis de Ambiente
1. Function App → "Configuration" → "Application settings"
2. Adicionar:
   ```
   DATABASE_URL=postgresql://username:password@host:5432/database
   AZURE_BLOB_SAS_URL=sua-sas-url-aqui
   AZURE_STORAGE_CONTAINER=documentos-matricula
   EMAIL_USER=noreply@puc.edu.br
   EMAIL_PASS=sua-senha-email
   ```

#### 2.3 Deploy das Funções
```bash
cd functions
func azure functionapp publish funcoes-matricula
```

#### 2.4 Obter Function Keys
1. Function App → "App keys"
2. Copiar a chave mestra ou criar chaves específicas

#### 2.5 Configurar no Backend
```env
AZURE_FUNCTIONS_URL=https://funcoes-matricula.azurewebsites.net/api
AZURE_FUNCTIONS_KEY=sua-function-key-aqui
```

### Passo 3: Banco de Dados PostgreSQL

#### 3.1 Criar Database
1. Portal Azure → "Criar recurso" → "Azure Database for PostgreSQL"
2. Nome: `matricula-puc-db`
3. Versão: PostgreSQL 13
4. Configurar usuário e senha

#### 3.2 Configurar Firewall
1. Database → "Connection security"
2. Adicionar IP do servidor de desenvolvimento
3. Habilitar "Allow Azure services and resources"

#### 3.3 Configurar no Backend
```env
DATABASE_URL=postgresql://username:password@host:5432/matricula_puc?sslmode=require
```

## 🧪 Testes e Validação

### 1. Testar Azure Blob Storage

```bash
# No diretório server
npm run test:azure
```

**Resultado esperado:**
```
✅ Azure Blob Storage inicializado com SAS Token
✅ Container existe
✅ Arquivo de teste enviado: test-1234567890.txt
✅ Arquivo de teste confirmado no container
🎉 Teste concluído com sucesso!
```

### 2. Testar Azure Functions

```bash
# Testar conectividade
curl -X GET http://localhost:3000/api/test/azure-functions/conectividade

# Testar validação de pagamento
curl -X POST http://localhost:3000/api/test/azure-functions/validar-pagamento \
  -H "Content-Type: application/json" \
  -d '{
    "matriculaId": "test-uuid",
    "metodo": "CARTAO_CREDITO",
    "valor": 1500.00
  }'
```

### 3. Testar Upload de Documentos

```bash
# Testar upload
curl -X POST http://localhost:3000/api/test/upload \
  -F "arquivo=@documento.pdf"

# Listar documentos
curl -X GET http://localhost:3000/api/test/documentos
```

## 📊 Monitoramento e Logs

### 1. Azure Blob Storage
- **Métricas:** Portal Azure → Storage Account → Insights
- **Logs:** Storage Account → Monitoring → Logs

### 2. Azure Functions
- **Métricas:** Function App → Monitor
- **Logs:** Function App → Functions → [Função] → Monitor

### 3. Backend (Express)
- **Logs:** Console do servidor
- **Métricas:** Endpoints de teste

## 🔒 Segurança

### 1. Azure Blob Storage
- ✅ SAS Token com prazo de expiração
- ✅ Permissões mínimas necessárias
- ✅ Container privado

### 2. Azure Functions
- ✅ Autenticação por chave de função
- ✅ Validação de entrada
- ✅ Tratamento de erros

### 3. Banco de Dados
- ✅ SSL/TLS obrigatório
- ✅ Firewall configurado
- ✅ Usuário com privilégios mínimos

## 🚨 Troubleshooting

### Problema: Erro 403 no Blob Storage
**Solução:**
1. Verificar se SAS Token está correto
2. Verificar se permissões estão configuradas
3. Verificar se container existe

### Problema: Azure Functions não responde
**Solução:**
1. Verificar se Function App está ativo
2. Verificar variáveis de ambiente
3. Verificar logs da função

### Problema: Erro de conexão com banco
**Solução:**
1. Verificar DATABASE_URL
2. Verificar firewall do banco
3. Verificar se banco está ativo

## 📈 Próximos Passos

### 1. Produção
- [ ] Configurar Application Insights
- [ ] Implementar autenticação JWT
- [ ] Configurar CDN para arquivos
- [ ] Implementar backup automático

### 2. Escalabilidade
- [ ] Configurar auto-scaling
- [ ] Implementar cache Redis
- [ ] Configurar load balancer
- [ ] Implementar filas de processamento

### 3. Monitoramento
- [ ] Configurar alertas
- [ ] Implementar dashboards
- [ ] Configurar logs centralizados
- [ ] Implementar métricas customizadas

## 📚 Recursos Adicionais

### Documentação Oficial
- [Azure Blob Storage](https://docs.microsoft.com/en-us/azure/storage/blobs/)
- [Azure Functions](https://docs.microsoft.com/en-us/azure/azure-functions/)
- [Azure Database for PostgreSQL](https://docs.microsoft.com/en-us/azure/postgresql/)

### SDKs e Bibliotecas
- [@azure/storage-blob](https://www.npmjs.com/package/@azure/storage-blob)
- [@azure/functions](https://www.npmjs.com/package/@azure/functions)
- [@prisma/client](https://www.npmjs.com/package/@prisma/client)

### Ferramentas
- [Azure CLI](https://docs.microsoft.com/en-us/cli/azure/)
- [Azure Functions Core Tools](https://docs.microsoft.com/en-us/azure/azure-functions/functions-run-local)
- [Azure Storage Explorer](https://azure.microsoft.com/en-us/features/storage-explorer/)

## 🎯 Resumo da Implementação

✅ **Azure Blob Storage configurado** com SAS Token
✅ **4 Azure Functions criadas** para processamento serverless
✅ **Backend integrado** com todos os serviços Azure
✅ **Sistema de upload** de documentos funcionando
✅ **Validação de pagamentos** via Azure Functions
✅ **Geração de contratos** automatizada
✅ **Sistema de notificações** por email
✅ **Testes e validação** implementados
✅ **Documentação completa** criada

O sistema está pronto para uso em desenvolvimento e pode ser facilmente escalado para produção! 