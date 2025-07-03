const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

// Application Insights Configuration
const appInsights = require("applicationinsights");

appInsights.setup(process.env.APPLICATIONINSIGHTS_CONNECTION_STRING || "<SUA_CONNECTION_STRING_AQUI>")
  .setAutoCollectRequests(true)
  .setAutoCollectPerformance(true)
  .setAutoCollectExceptions(true)
  .setAutoCollectDependencies(true)
  .start();

const telemetryClient = appInsights.defaultClient;

// Tornar telemetryClient disponível globalmente
global.telemetryClient = telemetryClient;

const app = express();

// Middlewares de segurança
app.use(helmet());

// CORS configurado para permitir apenas o frontend
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));

// Rate limiting global
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 1000, // máximo 1000 requests por IP
  message: {
    erro: 'Muitas requisições. Tente novamente em 15 minutos.'
  }
});
app.use(globalLimiter);

// Logging
app.use(morgan('combined'));

// Parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rotas
const matriculaRoutes = require('./routes/matriculaRoutes');
app.use('/api', matriculaRoutes);

// Rota de health check
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Rota raiz
app.get('/', (req, res) => {
  res.json({
    message: 'API do Sistema de Matrícula PUC',
    version: '1.0.0',
    endpoints: {
      matricula: '/api/matricula',
      status: '/api/status/:id',
      documento: '/api/documento',
      pagamento: '/api/pagamento',
      contrato: '/api/contrato/:matriculaId'
    }
  });
});

// Middleware para rotas não encontradas
app.use('*', (req, res) => {
  res.status(404).json({
    erro: 'Rota não encontrada',
    path: req.originalUrl
  });
});

// Middleware de tratamento de erros global
app.use((error, req, res, next) => {
  console.error('Erro não tratado:', error);

  // Rastrear exceção no Application Insights
  if (telemetryClient) {
    telemetryClient.trackException({ 
      exception: error,
      properties: {
        url: req.originalUrl,
        method: req.method,
        userAgent: req.get('User-Agent'),
        ip: req.ip
      }
    });
  }

  // Se for erro de validação do Prisma
  if (error.code === 'P2002') {
    return res.status(409).json({
      erro: 'Dados duplicados. Verifique se o CPF já não foi cadastrado.'
    });
  }

  if (error.code === 'P2025') {
    return res.status(404).json({
      erro: 'Registro não encontrado'
    });
  }

  // Erro padrão
  res.status(500).json({
    erro: 'Erro interno do servidor',
    message: process.env.NODE_ENV === 'development' ? error.message : 'Algo deu errado'
  });
});

module.exports = app;
