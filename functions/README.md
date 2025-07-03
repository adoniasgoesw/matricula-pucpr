# Azure Functions - Sistema de Matrícula PUC

Este diretório contém as Azure Functions para o sistema de matrícula PUC, implementando funcionalidades serverless para validação de pagamentos, documentos, geração de contratos e notificações.

## 🏗️ Estrutura do Projeto

```
functions/
├── ValidarPagamentoFunction/
│   ├── index.js
│   └── function.json
├── ValidarDocumentoFunction/
│   ├── index.js
│   └── function.json
├── GerarContratoFunction/
│   ├── index.js
│   └── function.json
├── NotificarEstudanteFunction/
│   ├── index.js
│   └── function.json
├── host.json
├── local.settings.json
├── package.json
└── README.md
```

## 🚀 Configuração

### 1. Pré-requisitos

- Node.js 18 ou superior
- Azure Functions Core Tools v4
- Conta Azure ativa
- Banco de dados PostgreSQL configurado

### 2. Instalação Local

```bash
# Instalar dependências
npm install

# Configurar variáveis de ambiente
cp local.settings.json.example local.settings.json
# Editar local.settings.json com suas configurações
```

### 3. Configuração no Azure

1. **Criar Function App:**
   - Nome: `funcoes-matricula`
   - Runtime: Node.js 18
   - OS: Linux
   - Plano: Consumption (Serverless)

2. **Configurar variáveis de ambiente:**
   - `DATABASE_URL`: String de conexão do PostgreSQL
   - `AZURE_BLOB_SAS_URL`: URL do SAS Token do Blob Storage
   - `AZURE_STORAGE_CONTAINER`: Nome do container
   - `EMAIL_USER`: Email para envio de notificações
   - `EMAIL_PASS`: Senha do email

## 📋 Funções Disponíveis

### 1. ValidarPagamentoFunction

**Endpoint:** `POST /api/validar-pagamento`

**Função:** Valida pagamentos de matrículas

**Payload:**
```json
{
  "matriculaId": "uuid",
  "metodo": "CARTAO_CREDITO",
  "valor": 1500.00,
  "dados": {
    "numeroCartao": "****1234",
    "bandeira": "VISA"
  }
}
```

**Resposta:**
```json
{
  "matriculaId": "uuid",
  "status": "APROVADO",
  "transacaoId": "TXN-1234567890",
  "valor": 1500.00,
  "metodo": "CARTAO_CREDITO",
  "processadoAt": "2024-01-01T10:00:00Z"
}
```

### 2. ValidarDocumentoFunction

**Endpoint:** `POST /api/validar-documento`

**Função:** Valida documentos enviados pelos estudantes

**Payload:**
```json
{
  "documentoId": "uuid"
}
```

**Resposta:**
```json
{
  "documentoId": "uuid",
  "matriculaId": "uuid",
  "tipo": "RG",
  "status": "APROVADO",
  "validacoes": {
    "legibilidade": true,
    "autenticidade": true,
    "completude": true,
    "validade": true
  },
  "validadoAt": "2024-01-01T10:00:00Z"
}
```

### 3. GerarContratoFunction

**Endpoint:** `POST /api/gerar-contrato`

**Função:** Gera contratos de matrícula

**Payload:**
```json
{
  "matriculaId": "uuid"
}
```

**Resposta:**
```json
{
  "matriculaId": "uuid",
  "numeroContrato": "CONTRATO-2024-ABC12345",
  "contratoUrl": "https://puc.edu.br/contratos/CONTRATO-2024-ABC12345.pdf",
  "geradoAt": "2024-01-01T10:00:00Z",
  "contrato": {
    "dados": {
      "matricula": { ... },
      "curso": { ... },
      "campus": { ... },
      "pagamento": { ... }
    }
  }
}
```

### 4. NotificarEstudanteFunction

**Endpoint:** `POST /api/notificar-estudante`

**Função:** Envia notificações por email aos estudantes

**Payload:**
```json
{
  "matriculaId": "uuid",
  "tipoNotificacao": "MATRICULA_CRIADA",
  "dadosAdicionais": {
    "dataInicio": "2024-02-01"
  }
}
```

**Tipos de Notificação:**
- `MATRICULA_CRIADA`: Matrícula foi criada
- `DOCUMENTO_ENVIADO`: Documento foi enviado
- `DOCUMENTO_APROVADO`: Documento foi aprovado
- `PAGAMENTO_APROVADO`: Pagamento foi aprovado
- `CONTRATO_GERADO`: Contrato foi gerado
- `MATRICULA_APROVADA`: Matrícula foi aprovada

## 🧪 Testes Locais

### 1. Executar Localmente

```bash
# Iniciar Azure Functions localmente
func start

# As funções estarão disponíveis em:
# http://localhost:7071/api/validar-pagamento
# http://localhost:7071/api/validar-documento
# http://localhost:7071/api/gerar-contrato
# http://localhost:7071/api/notificar-estudante
```

### 2. Testar com curl

```bash
# Testar validação de pagamento
curl -X POST http://localhost:7071/api/validar-pagamento \
  -H "Content-Type: application/json" \
  -d '{
    "matriculaId": "test-uuid",
    "metodo": "CARTAO_CREDITO",
    "valor": 1500.00
  }'

# Testar validação de documento
curl -X POST http://localhost:7071/api/validar-documento \
  -H "Content-Type: application/json" \
  -d '{
    "documentoId": "test-uuid"
  }'
```

## 🚀 Deploy para Azure

### 1. Publicar via Azure CLI

```bash
# Fazer login no Azure
az login

# Publicar Function App
func azure functionapp publish funcoes-matricula
```

### 2. Configurar no Portal Azure

1. Acessar o Function App no Portal Azure
2. Ir em "Configuration" → "Application settings"
3. Adicionar as variáveis de ambiente necessárias
4. Salvar as configurações

### 3. Obter URLs das Funções

Após o deploy, as URLs estarão disponíveis em:
- `https://funcoes-matricula.azurewebsites.net/api/validar-pagamento`
- `https://funcoes-matricula.azurewebsites.net/api/validar-documento`
- `https://funcoes-matricula.azurewebsites.net/api/gerar-contrato`
- `https://funcoes-matricula.azurewebsites.net/api/notificar-estudante`

## 🔗 Integração com Backend

O backend (Express) integra com as Azure Functions através do serviço `azureFunctionsService.js`:

```javascript
const azureFunctionsService = require('./services/azureFunctionsService');

// Validar pagamento
const resultado = await azureFunctionsService.validarPagamento(
  matriculaId, 
  metodo, 
  valor, 
  dados
);

// Validar documento
const resultado = await azureFunctionsService.validarDocumento(documentoId);

// Gerar contrato
const resultado = await azureFunctionsService.gerarContrato(matriculaId);

// Notificar estudante
const resultado = await azureFunctionsService.notificarEstudante(
  matriculaId, 
  'PAGAMENTO_APROVADO'
);
```

## 📊 Monitoramento

### 1. Logs

As funções geram logs detalhados que podem ser visualizados:
- **Localmente:** No terminal onde `func start` foi executado
- **Azure:** No Portal Azure → Function App → Monitor

### 2. Métricas

No Portal Azure, você pode monitorar:
- Execuções por função
- Duração média
- Taxa de erro
- Uso de memória

### 3. Application Insights

Para monitoramento avançado, configure Application Insights:
1. Criar recurso Application Insights no Azure
2. Configurar no Function App
3. Visualizar métricas e logs detalhados

## 🔒 Segurança

### 1. Autenticação

As funções usam autenticação por chave de função:
- Configurar `authLevel: "function"` no `function.json`
- Usar chave de função nas requisições

### 2. Validação de Entrada

Todas as funções validam:
- Campos obrigatórios
- Tipos de dados
- Existência de registros no banco

### 3. Tratamento de Erros

- Logs detalhados de erros
- Respostas de erro padronizadas
- Fallbacks para cenários de falha

## 🚨 Troubleshooting

### Erro de Conexão com Banco

1. Verificar `DATABASE_URL` nas configurações
2. Verificar se o banco está acessível
3. Verificar se as tabelas existem

### Erro de Email

1. Verificar configurações de SMTP
2. Verificar credenciais de email
3. Em desenvolvimento, emails são simulados

### Erro de Blob Storage

1. Verificar `AZURE_BLOB_SAS_URL`
2. Verificar permissões do SAS Token
3. Verificar se o container existe

## 📚 Recursos Adicionais

- [Azure Functions Documentation](https://docs.microsoft.com/en-us/azure/azure-functions/)
- [Node.js Azure Functions](https://docs.microsoft.com/en-us/azure/azure-functions/functions-reference-node)
- [Azure Functions Core Tools](https://docs.microsoft.com/en-us/azure/azure-functions/functions-run-local)
- [Serverless Architecture](https://docs.microsoft.com/en-us/azure/azure-functions/functions-overview) 