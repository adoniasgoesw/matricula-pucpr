const { PrismaClient } = require('@prisma/client');
const blobService = require('../services/blobService');
const { v4: uuidv4 } = require('uuid');
const validator = require('validator');

const prisma = new PrismaClient();

// Simulação sem banco ainda:
const matriculas = [];

// Criar nova matrícula
exports.criarMatricula = async (req, res) => {
  try {
    const {
      nome,
      cpf,
      rg,
      nascimento,
      email,
      telefone,
      endereco,
      cidade,
      estado,
      cursoId,
      campusId,
      valor
    } = req.body;

    // Validações
    if (!nome || !cpf || !rg || !nascimento || !email || !telefone || !endereco || !cidade || !estado || !cursoId || !campusId || !valor) {
      return res.status(400).json({
        erro: 'Todos os campos são obrigatórios'
      });
    }

    // Validar CPF
    if (!validator.isLength(cpf.replace(/\D/g, ''), { min: 11, max: 11 })) {
      return res.status(400).json({
        erro: 'CPF inválido'
      });
    }

    // Validar email
    if (!validator.isEmail(email)) {
      return res.status(400).json({
        erro: 'Email inválido'
      });
    }

    // Verificar se CPF já existe
    const matriculaExistente = await prisma.matricula.findUnique({
      where: { cpf: cpf.replace(/\D/g, '') }
    });

    if (matriculaExistente) {
      return res.status(409).json({
        erro: 'CPF já cadastrado'
      });
    }

    // Verificar se curso existe
    const curso = await prisma.curso.findUnique({
      where: { id: parseInt(cursoId) }
    });

    if (!curso) {
      return res.status(400).json({
        erro: 'Curso não encontrado'
      });
    }

    // Verificar se campus existe
    const campus = await prisma.campus.findUnique({
      where: { id: campusId }
    });

    if (!campus) {
      return res.status(400).json({
        erro: 'Campus não encontrado'
      });
    }

    // Criar matrícula
    const matricula = await prisma.matricula.create({
      data: {
        nome,
        cpf: cpf.replace(/\D/g, ''),
        rg,
        nascimento: new Date(nascimento),
        email,
        telefone,
        endereco,
        cidade,
        estado,
        cursoId: parseInt(cursoId),
        campusId,
        valor: parseFloat(valor),
        status: 'PENDENTE'
      },
      include: {
        curso: true,
        campus: true
      }
    });

    res.status(201).json({
      id: matricula.id,
      mensagem: 'Matrícula criada com sucesso',
      matricula
    });

  } catch (error) {
    console.error('Erro ao criar matrícula:', error);
    res.status(500).json({
      erro: 'Erro interno do servidor'
    });
  }
};

// Obter status da matrícula
exports.getStatus = async (req, res) => {
  try {
    const { id } = req.params;

    const matricula = await prisma.matricula.findUnique({
      where: { id },
      include: {
        curso: true,
        campus: true,
        documentos: true,
        pagamentos: {
          orderBy: { createdAt: 'desc' },
          take: 1
        }
      }
    });

    if (!matricula) {
      return res.status(404).json({
        erro: 'Matrícula não encontrada'
      });
    }

    res.json({
      id: matricula.id,
      status: matricula.status,
      curso: matricula.curso,
      campus: matricula.campus,
      documentos: matricula.documentos.length,
      pagamento: matricula.pagamentos[0] || null,
      createdAt: matricula.createdAt
    });

  } catch (error) {
    console.error('Erro ao buscar status da matrícula:', error);
    res.status(500).json({
      erro: 'Erro interno do servidor'
    });
  }
};

// Upload de documento
exports.uploadDocumento = async (req, res) => {
  try {
    const { matriculaId, tipo } = req.body;
    const file = req.file;

    if (!matriculaId || !tipo || !file) {
      return res.status(400).json({
        erro: 'Matrícula ID, tipo de documento e arquivo são obrigatórios'
      });
    }

    // Verificar se matrícula existe
    const matricula = await prisma.matricula.findUnique({
      where: { id: matriculaId }
    });

    if (!matricula) {
      return res.status(404).json({
        erro: 'Matrícula não encontrada'
      });
    }

    // Tipos de documento permitidos
    const tiposPermitidos = ['RG', 'CPF', 'RESIDENCIA', 'HISTORICO', 'CERTIFICADO', 'FOTO'];
    if (!tiposPermitidos.includes(tipo.toUpperCase())) {
      return res.status(400).json({
        erro: 'Tipo de documento inválido'
      });
    }

    // Verificar se já existe documento deste tipo
    const documentoExistente = await prisma.documento.findFirst({
      where: {
        matriculaId,
        tipo: tipo.toUpperCase()
      }
    });

    if (documentoExistente) {
      return res.status(409).json({
        erro: 'Documento deste tipo já foi enviado'
      });
    }

    // Upload para Azure Blob Storage
    let uploadResult;
    try {
      uploadResult = await blobService.uploadDocument(file, matriculaId, tipo.toUpperCase());
    } catch (error) {
      // Se Azure não estiver configurado, usar upload simulado
      uploadResult = await blobService.uploadDocumentSimulado(file, matriculaId, tipo.toUpperCase());
    }

    // Salvar documento no banco
    const documento = await prisma.documento.create({
      data: {
        matriculaId,
        tipo: tipo.toUpperCase(),
        nomeArquivo: uploadResult.nomeArquivo,
        url: uploadResult.url,
        tamanho: uploadResult.tamanho,
        mimeType: uploadResult.mimeType
      }
    });

    res.json({
      mensagem: 'Documento enviado com sucesso',
      documento
    });

  } catch (error) {
    console.error('Erro no upload de documento:', error);
    res.status(500).json({
      erro: 'Erro interno do servidor'
    });
  }
};

// Processar pagamento
exports.processarPagamento = async (req, res) => {
  try {
    const { matriculaId, metodo, dados } = req.body;

    if (!matriculaId || !metodo) {
      return res.status(400).json({
        erro: 'Matrícula ID e método de pagamento são obrigatórios'
      });
    }

    // Verificar se matrícula existe
    const matricula = await prisma.matricula.findUnique({
      where: { id: matriculaId }
    });

    if (!matricula) {
      return res.status(404).json({
        erro: 'Matrícula não encontrada'
      });
    }

    // Verificar se já existe pagamento aprovado
    const pagamentoExistente = await prisma.pagamento.findFirst({
      where: {
        matriculaId,
        status: 'APROVADO'
      }
    });

    if (pagamentoExistente) {
      return res.status(409).json({
        erro: 'Pagamento já foi processado'
      });
    }

    // Simular processamento de pagamento
    const status = 'APROVADO'; // Em produção, integrar com gateway de pagamento
    const processadoAt = new Date();

    // Criar registro de pagamento
    const pagamento = await prisma.pagamento.create({
      data: {
        matriculaId,
        metodo: metodo.toUpperCase(),
        valor: matricula.valor,
        status,
        dados: dados || {},
        processadoAt
      }
    });

    // Atualizar status da matrícula se pagamento aprovado
    if (status === 'APROVADO') {
      await prisma.matricula.update({
        where: { id: matriculaId },
        data: { status: 'PAGAMENTO_CONFIRMADO' }
      });
    }

    res.json({
      mensagem: 'Pagamento processado com sucesso',
      pagamento
    });

  } catch (error) {
    console.error('Erro ao processar pagamento:', error);
    res.status(500).json({
      erro: 'Erro interno do servidor'
    });
  }
};

// Gerar contrato
exports.gerarContrato = async (req, res) => {
  try {
    const { matriculaId } = req.params;

    // Verificar se matrícula existe
    const matricula = await prisma.matricula.findUnique({
      where: { id: matriculaId },
      include: {
        curso: true,
        campus: true,
        pagamentos: {
          where: { status: 'APROVADO' }
        }
      }
    });

    if (!matricula) {
      return res.status(404).json({
        erro: 'Matrícula não encontrada'
      });
    }

    // Verificar se pagamento foi aprovado
    if (matricula.pagamentos.length === 0) {
      return res.status(400).json({
        erro: 'Pagamento não foi aprovado'
      });
    }

    // Verificar se contrato já existe
    const contratoExistente = await prisma.contrato.findUnique({
      where: { matriculaId }
    });

    if (contratoExistente) {
      return res.json({
        mensagem: 'Contrato já existe',
        contrato: contratoExistente
      });
    }

    // Gerar número do contrato
    const numeroContrato = `CONTRATO-${new Date().getFullYear()}-${matriculaId.substring(0, 8).toUpperCase()}`;

    // URL simulada do contrato (em produção, gerar PDF real)
    const contratoUrl = `https://puc.edu.br/contratos/${numeroContrato}.pdf`;

    // Criar contrato
    const contrato = await prisma.contrato.create({
      data: {
        matriculaId,
        numero: numeroContrato,
        url: contratoUrl
      }
    });

    res.json({
      mensagem: 'Contrato gerado com sucesso',
      contrato
    });

  } catch (error) {
    console.error('Erro ao gerar contrato:', error);
    res.status(500).json({
      erro: 'Erro interno do servidor'
    });
  }
};

// Listar matrículas (para admin)
exports.listarMatriculas = async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const skip = (page - 1) * limit;

    const where = {};
    if (status) {
      where.status = status;
    }

    const matriculas = await prisma.matricula.findMany({
      where,
      include: {
        curso: true,
        campus: true,
        documentos: true,
        pagamentos: {
          orderBy: { createdAt: 'desc' },
          take: 1
        }
      },
      skip: parseInt(skip),
      take: parseInt(limit),
      orderBy: { createdAt: 'desc' }
    });

    const total = await prisma.matricula.count({ where });

    res.json({
      matriculas,
      paginacao: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Erro ao listar matrículas:', error);
    res.status(500).json({
      erro: 'Erro interno do servidor'
    });
  }
};

// Atualizar status da matrícula (para admin)
exports.atualizarStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const statusPermitidos = ['PENDENTE', 'APROVADA', 'REJEITADA', 'CANCELADA'];
    if (!statusPermitidos.includes(status)) {
      return res.status(400).json({
        erro: 'Status inválido'
      });
    }

    const matricula = await prisma.matricula.update({
      where: { id },
      data: { status }
    });

    res.json({
      mensagem: 'Status atualizado com sucesso',
      matricula
    });

  } catch (error) {
    console.error('Erro ao atualizar status:', error);
    res.status(500).json({
      erro: 'Erro interno do servidor'
    });
  }
};
