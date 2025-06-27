const express = require('express');
const multer = require('multer');
const rateLimit = require('express-rate-limit');
const matriculaController = require('../controllers/matriculaController');

const router = express.Router();

// Rate limiting para prevenir spam
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // máximo 100 requests por IP
  message: {
    erro: 'Muitas requisições. Tente novamente em 15 minutos.'
  }
});

// Configuração do Multer para upload de arquivos
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
  fileFilter: (req, file, cb) => {
    // Permitir apenas PDF e imagens
    if (file.mimetype === 'application/pdf' || 
        file.mimetype === 'image/jpeg' || 
        file.mimetype === 'image/png' || 
        file.mimetype === 'image/jpg') {
      cb(null, true);
    } else {
      cb(new Error('Tipo de arquivo não permitido. Use PDF, JPEG ou PNG.'), false);
    }
  }
});

// Aplicar rate limiting em todas as rotas
router.use(limiter);

// Rotas públicas
router.post('/matricula', matriculaController.criarMatricula);
router.get('/status/:id', matriculaController.getStatus);
router.post('/documento', upload.single('arquivo'), matriculaController.uploadDocumento);
router.post('/pagamento', matriculaController.processarPagamento);
router.get('/contrato/:matriculaId', matriculaController.gerarContrato);

// Rotas administrativas (em produção, adicionar autenticação)
router.get('/admin/matriculas', matriculaController.listarMatriculas);
router.put('/admin/matricula/:id/status', matriculaController.atualizarStatus);

// Middleware para tratamento de erros do Multer
router.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        erro: 'Arquivo muito grande. Tamanho máximo: 10MB'
      });
    }
  }
  
  if (error.message.includes('Tipo de arquivo não permitido')) {
    return res.status(400).json({
      erro: error.message
    });
  }
  
  next(error);
});

module.exports = router;
