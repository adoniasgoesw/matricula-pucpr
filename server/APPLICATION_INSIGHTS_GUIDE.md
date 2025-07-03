# 📊 Application Insights - Guia de Monitoramento

Este guia explica como o Application Insights está configurado no sistema de matrícula da PUC e como visualizar os dados de monitoramento.

## 🚀 Configuração

### 1. Instalação do SDK
O pacote `applicationinsights` já está instalado no projeto:
```bash
npm install applicationinsights
```

### 2. Configuração no Código
O Application Insights está configurado no arquivo `app.js`:

```javascript
const appInsights = require("applicationinsights");

appInsights.setup(process.env.APPLICATIONINSIGHTS_CONNECTION_STRING)
  .setAutoCollectRequests(true)
  .setAutoCollectPerformance(true)
  .setAutoCollectExceptions(true)
  .setAutoCollectDependencies(true)
  .start();

const telemetryClient = appInsights.defaultClient;
global.telemetryClient = telemetryClient;
```

### 3. Variável de Ambiente
Adicione a connection string no seu arquivo `.env`:

```env
APPLICATIONINSIGHTS_CONNECTION_STRING="InstrumentationKey=your-key;IngestionEndpoint=https://your-region.in.applicationinsights.azure.com/;LiveEndpoint=https://your-region.livediagnostics.monitor.azure.com/"
```

## 📈 Eventos Rastreados

### 🎯 Matrícula
- **`MatriculaCriacaoIniciada`** - Início da criação de matrícula
- **`MatriculaCriadaComSucesso`** - Matrícula criada com sucesso
- **`MatriculaErroValidacao`** - Erro de validação nos dados
- **`MatriculaErroCPF`** - CPF inválido
- **`MatriculaErroEmail`** - Email inválido
- **`MatriculaCPFDuplicado`** - Tentativa de CPF duplicado
- **`MatriculaCursoNaoEncontrado`** - Curso não encontrado
- **`MatriculaCampusNaoEncontrado`** - Campus não encontrado

### 📄 Documentos
- **`DocumentoUploadIniciado`** - Início do upload de documento
- **`DocumentoUploadSucesso`** - Upload realizado com sucesso
- **`DocumentoUploadSimulado`** - Upload simulado (Azure não configurado)
- **`DocumentoUploadErroValidacao`** - Erro de validação no upload
- **`DocumentoUploadMatriculaNaoEncontrada`** - Matrícula não encontrada
- **`DocumentoUploadTipoInvalido`** - Tipo de documento inválido
- **`DocumentoUploadDuplicado`** - Documento duplicado
- **`DocumentoValidacaoIniciada`** - Validação de documento iniciada

### 💳 Pagamentos
- **`PagamentoProcessamentoIniciado`** - Início do processamento
- **`PagamentoValidacaoConcluida`** - Validação concluída
- **`PagamentoAprovado`** - Pagamento aprovado
- **`PagamentoRejeitado`** - Pagamento rejeitado
- **`PagamentoErroValidacao`** - Erro de validação
- **`PagamentoMatriculaNaoEncontrada`** - Matrícula não encontrada
- **`PagamentoJaProcessado`** - Pagamento já processado

### 📋 Contratos
- **`ContratoGeracaoIniciada`** - Início da geração
- **`ContratoGeradoComSucesso`** - Contrato gerado com sucesso
- **`ContratoAzureFunctionChamada`** - Azure Function chamada
- **`ContratoMatriculaNaoEncontrada`** - Matrícula não encontrada
- **`ContratoPagamentoNaoAprovado`** - Pagamento não aprovado
- **`ContratoJaExiste`** - Contrato já existe

### 📊 Status
- **`StatusMatriculaConsultado`** - Consulta de status
- **`StatusMatriculaRetornado`** - Status retornado
- **`StatusMatriculaNaoEncontrada`** - Matrícula não encontrada

### 🔔 Notificações
- **`NotificacaoMatriculaEnviada`** - Notificação de matrícula
- **`NotificacaoDocumentoEnviada`** - Notificação de documento
- **`NotificacaoPagamentoEnviada`** - Notificação de pagamento
- **`NotificacaoContratoEnviada`** - Notificação de contrato

## 🔍 Como Visualizar no Portal Azure

### 1. Acesse o Application Insights
1. Vá para o [Portal Azure](https://portal.azure.com)
2. Navegue até o recurso Application Insights (`backend-matricula`)
3. No menu lateral, clique em **"Logs"**

### 2. Consultas Úteis

#### 📊 Eventos Personalizados
```kusto
customEvents
| where timestamp > ago(24h)
| summarize count() by name
| order by count_ desc
```

#### 🎯 Eventos de Matrícula
```kusto
customEvents
| where name contains "Matricula"
| where timestamp > ago(24h)
| project timestamp, name, customDimensions
```

#### 📄 Eventos de Documentos
```kusto
customEvents
| where name contains "Documento"
| where timestamp > ago(24h)
| project timestamp, name, customDimensions
```

#### 💳 Eventos de Pagamento
```kusto
customEvents
| where name contains "Pagamento"
| where timestamp > ago(24h)
| project timestamp, name, customDimensions
```

#### 📋 Eventos de Contrato
```kusto
customEvents
| where name contains "Contrato"
| where timestamp > ago(24h)
| project timestamp, name, customDimensions
```

#### ❌ Exceções
```kusto
exceptions
| where timestamp > ago(24h)
| project timestamp, type, message, operation_Name
| order by timestamp desc
```

#### 📈 Requisições
```kusto
requests
| where timestamp > ago(24h)
| summarize count(), avg(duration) by operation_Name
| order by count_ desc
```

### 3. Dashboards Personalizados

#### Dashboard de Matrículas
```kusto
// Matrículas criadas por hora
customEvents
| where name == "MatriculaCriadaComSucesso"
| where timestamp > ago(24h)
| summarize count() by bin(timestamp, 1h)
| render timechart
```

#### Dashboard de Erros
```kusto
// Top 10 erros mais comuns
customEvents
| where name contains "Erro"
| where timestamp > ago(24h)
| summarize count() by name
| order by count_ desc
| take 10
```

## 🛠️ Como Adicionar Novos Eventos

### 1. Evento Simples
```javascript
if (global.telemetryClient) {
  global.telemetryClient.trackEvent({
    name: "MeuEvento",
    properties: {
      valor: "dados",
      timestamp: new Date().toISOString()
    }
  });
}
```

### 2. Rastrear Exceção
```javascript
try {
  // código que pode falhar
} catch (error) {
  if (global.telemetryClient) {
    global.telemetryClient.trackException({
      exception: error,
      properties: {
        operacao: "nomeDaOperacao",
        contexto: "informações adicionais"
      }
    });
  }
}
```

### 3. Rastrear Métrica
```javascript
if (global.telemetryClient) {
  global.telemetryClient.trackMetric({
    name: "TempoProcessamento",
    value: tempoEmMilissegundos
  });
}
```

## 📊 Métricas Importantes

### Performance
- Tempo de resposta das APIs
- Taxa de sucesso das operações
- Uso de recursos do servidor

### Negócio
- Número de matrículas criadas
- Taxa de conversão (matrícula → pagamento → contrato)
- Documentos enviados por tipo
- Pagamentos aprovados vs rejeitados

### Erros
- Exceções não tratadas
- Validações que falharam
- Problemas de conectividade com Azure Functions

## 🔧 Troubleshooting

### Problema: Eventos não aparecem
1. Verifique se a connection string está correta
2. Confirme se o Application Insights está ativo
3. Aguarde alguns minutos (pode haver delay)

### Problema: Erro de configuração
```javascript
// Verifique se o telemetryClient está disponível
console.log('Telemetry Client:', global.telemetryClient);
```

### Problema: Performance degradada
- O Application Insights tem impacto mínimo
- Se necessário, desabilite coleta automática:
```javascript
appInsights.setup(connectionString)
  .setAutoCollectRequests(false)  // Desabilitar se necessário
  .start();
```

## 📚 Recursos Adicionais

- [Documentação oficial do Application Insights](https://docs.microsoft.com/en-us/azure/azure-monitor/app/app-insights-overview)
- [SDK Node.js](https://docs.microsoft.com/en-us/azure/azure-monitor/app/nodejs)
- [Consultas KQL](https://docs.microsoft.com/en-us/azure/data-explorer/kusto/query/)

---

**🎯 Dica:** Use o Application Insights para identificar gargalos, monitorar o comportamento dos usuários e melhorar a experiência do sistema de matrícula! 