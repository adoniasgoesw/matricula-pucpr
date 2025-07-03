const { PrismaClient } = require('../generated/prisma');
const blobService = require('../services/blobService');
const azureFunctionsService = require('../services/azureFunctionsService');
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

    // Rastrear início da criação de matrícula
    if (global.telemetryClient) {
      global.telemetryClient.trackEvent({
        name: "MatriculaCriacaoIniciada",
        properties: {
          cursoId: cursoId,
          campusId: campusId,
          valor: valor,
          ip: req.ip
        }
      });
    }

    // Validações
    if (!nome || !cpf || !rg || !nascimento || !email || !telefone || !endereco || !cidade || !estado || !cursoId || !campusId || !valor) {
      // Rastrear erro de validação
      if (global.telemetryClient) {
        global.telemetryClient.trackEvent({
          name: "MatriculaErroValidacao",
          properties: {
            erro: "Campos obrigatórios faltando",
            ip: req.ip
          }
        });
      }
      
      return res.status(400).json({
        erro: 'Todos os campos são obrigatórios'
      });
    }

    // Validar CPF
    if (!validator.isLength(cpf.replace(/\D/g, ''), { min: 11, max: 11 })) {
      // Rastrear erro de CPF inválido
      if (global.telemetryClient) {
        global.telemetryClient.trackEvent({
          name: "MatriculaErroCPF",
          properties: {
            cpf: cpf.replace(/\D/g, ''),
            ip: req.ip
          }
        });
      }
      
      return res.status(400).json({
        erro: 'CPF inválido'
      });
    }

    // Validar email
    if (!validator.isEmail(email)) {
      // Rastrear erro de email inválido
      if (global.telemetryClient) {
        global.telemetryClient.trackEvent({
          name: "MatriculaErroEmail",
          properties: {
            email: email,
            ip: req.ip
          }
        });
      }
      
      return res.status(400).json({
        erro: 'Email inválido'
      });
    }

    // Verificar se CPF já existe
    const matriculaExistente = await prisma.matricula.findUnique({
      where: { cpf: cpf.replace(/\D/g, '') }
    });

    if (matriculaExistente) {
      // Rastrear tentativa de CPF duplicado
      if (global.telemetryClient) {
        global.telemetryClient.trackEvent({
          name: "MatriculaCPFDuplicado",
          properties: {
            cpf: cpf.replace(/\D/g, ''),
            ip: req.ip
          }
        });
      }
      
      return res.status(409).json({
        erro: 'CPF já cadastrado'
      });
    }

    // Verificar se curso existe
    const curso = await prisma.curso.findUnique({
      where: { id: parseInt(cursoId) }
    });

    if (!curso) {
      // Rastrear erro de curso não encontrado
      if (global.telemetryClient) {
        global.telemetryClient.trackEvent({
          name: "MatriculaCursoNaoEncontrado",
          properties: {
            cursoId: cursoId,
            ip: req.ip
          }
        });
      }
      
      return res.status(400).json({
        erro: 'Curso não encontrado'
      });
    }

    // Verificar se campus existe
    const campus = await prisma.campus.findUnique({
      where: { id: campusId }
    });

    if (!campus) {
      // Rastrear erro de campus não encontrado
      if (global.telemetryClient) {
        global.telemetryClient.trackEvent({
          name: "MatriculaCampusNaoEncontrado",
          properties: {
            campusId: campusId,
            ip: req.ip
          }
        });
      }
      
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

    // Rastrear matrícula criada com sucesso
    if (global.telemetryClient) {
      global.telemetryClient.trackEvent({
        name: "MatriculaCriadaComSucesso",
        properties: {
          matriculaId: matricula.id,
          curso: matricula.curso.nome,
          campus: matricula.campus.nome,
          valor: matricula.valor,
          ip: req.ip
        }
      });
    }

    // Chamar Azure Function para notificar criação da matrícula
    try {
      await azureFunctionsService.notificarEstudante(matricula.id, 'MATRICULA_CRIADA');
      
      // Rastrear notificação enviada
      if (global.telemetryClient) {
        global.telemetryClient.trackEvent({
          name: "NotificacaoMatriculaEnviada",
          properties: {
            matriculaId: matricula.id,
            tipo: 'MATRICULA_CRIADA'
          }
        });
      }
    } catch (error) {
      console.error('Erro ao notificar criação da matrícula:', error);
      
      // Rastrear erro na notificação
      if (global.telemetryClient) {
        global.telemetryClient.trackException({
          exception: error,
          properties: {
            matriculaId: matricula.id,
            operacao: "notificarEstudante"
          }
        });
      }
      // Não falhar a criação da matrícula se a notificação falhar
    }

    res.status(201).json({
      id: matricula.id,
      mensagem: 'Matrícula criada com sucesso',
      matricula
    });

  } catch (error) {
    console.error('Erro ao criar matrícula:', error);
    
    // Rastrear exceção
    if (global.telemetryClient) {
      global.telemetryClient.trackException({
        exception: error,
        properties: {
          operacao: "criarMatricula",
          ip: req.ip
        }
      });
    }
    
    res.status(500).json({
      erro: 'Erro interno do servidor'
    });
  }
};

// Obter status da matrícula
exports.getStatus = async (req, res) => {
  try {
    const { id } = req.params;

    // Rastrear consulta de status
    if (global.telemetryClient) {
      global.telemetryClient.trackEvent({
        name: "StatusMatriculaConsultado",
        properties: {
          matriculaId: id,
          ip: req.ip
        }
      });
    }

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
      // Rastrear matrícula não encontrada
      if (global.telemetryClient) {
        global.telemetryClient.trackEvent({
          name: "StatusMatriculaNaoEncontrada",
          properties: {
            matriculaId: id,
            ip: req.ip
          }
        });
      }
      
      return res.status(404).json({
        erro: 'Matrícula não encontrada'
      });
    }

    // Rastrear status consultado com sucesso
    if (global.telemetryClient) {
      global.telemetryClient.trackEvent({
        name: "StatusMatriculaRetornado",
        properties: {
          matriculaId: id,
          status: matricula.status,
          quantidadeDocumentos: matricula.documentos.length,
          temPagamento: matricula.pagamentos.length > 0,
          ip: req.ip
        }
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
    
    // Rastrear exceção
    if (global.telemetryClient) {
      global.telemetryClient.trackException({
        exception: error,
        properties: {
          operacao: "getStatus",
          matriculaId: req.params.id,
          ip: req.ip
        }
      });
    }
    
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

    // Rastrear início do upload de documento
    if (global.telemetryClient) {
      global.telemetryClient.trackEvent({
        name: "DocumentoUploadIniciado",
        properties: {
          matriculaId: matriculaId,
          tipo: tipo,
          tamanhoArquivo: file ? file.size : 0,
          mimeType: file ? file.mimetype : 'N/A',
          ip: req.ip
        }
      });
    }

    if (!matriculaId || !tipo || !file) {
      // Rastrear erro de validação
      if (global.telemetryClient) {
        global.telemetryClient.trackEvent({
          name: "DocumentoUploadErroValidacao",
          properties: {
            erro: "Campos obrigatórios faltando",
            matriculaId: matriculaId,
            tipo: tipo,
            ip: req.ip
          }
        });
      }
      
      return res.status(400).json({
        erro: 'Matrícula ID, tipo de documento e arquivo são obrigatórios'
      });
    }

    // Verificar se matrícula existe
    const matricula = await prisma.matricula.findUnique({
      where: { id: matriculaId }
    });

    if (!matricula) {
      // Rastrear matrícula não encontrada
      if (global.telemetryClient) {
        global.telemetryClient.trackEvent({
          name: "DocumentoUploadMatriculaNaoEncontrada",
          properties: {
            matriculaId: matriculaId,
            ip: req.ip
          }
        });
      }
      
      return res.status(404).json({
        erro: 'Matrícula não encontrada'
      });
    }

    // Tipos de documento permitidos
    const tiposPermitidos = ['RG', 'CPF', 'RESIDENCIA', 'HISTORICO', 'CERTIFICADO', 'FOTO'];
    if (!tiposPermitidos.includes(tipo.toUpperCase())) {
      // Rastrear tipo de documento inválido
      if (global.telemetryClient) {
        global.telemetryClient.trackEvent({
          name: "DocumentoUploadTipoInvalido",
          properties: {
            tipo: tipo,
            tiposPermitidos: tiposPermitidos.join(','),
            ip: req.ip
          }
        });
      }
      
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
      // Rastrear documento duplicado
      if (global.telemetryClient) {
        global.telemetryClient.trackEvent({
          name: "DocumentoUploadDuplicado",
          properties: {
            matriculaId: matriculaId,
            tipo: tipo.toUpperCase(),
            ip: req.ip
          }
        });
      }
      
      return res.status(409).json({
        erro: 'Documento deste tipo já foi enviado'
      });
    }

    // Upload para Azure Blob Storage
    let uploadResult;
    try {
      uploadResult = await blobService.uploadDocument(file, matriculaId, tipo.toUpperCase());
      
      // Rastrear upload bem-sucedido
      if (global.telemetryClient) {
        global.telemetryClient.trackEvent({
          name: "DocumentoUploadSucesso",
          properties: {
            matriculaId: matriculaId,
            tipo: tipo.toUpperCase(),
            tamanho: uploadResult.tamanho,
            url: uploadResult.url,
            ip: req.ip
          }
        });
      }
    } catch (error) {
      // Se Azure não estiver configurado, usar upload simulado
      uploadResult = await blobService.uploadDocumentSimulado(file, matriculaId, tipo.toUpperCase());
      
      // Rastrear uso de upload simulado
      if (global.telemetryClient) {
        global.telemetryClient.trackEvent({
          name: "DocumentoUploadSimulado",
          properties: {
            matriculaId: matriculaId,
            tipo: tipo.toUpperCase(),
            erro: error.message,
            ip: req.ip
          }
        });
      }
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

    // Chamar Azure Function para validar documento
    try {
      await azureFunctionsService.validarDocumento(documento.id);
      
      // Rastrear validação iniciada
      if (global.telemetryClient) {
        global.telemetryClient.trackEvent({
          name: "DocumentoValidacaoIniciada",
          properties: {
            documentoId: documento.id,
            matriculaId: matriculaId,
            tipo: tipo.toUpperCase()
          }
        });
      }
    } catch (error) {
      console.error('Erro ao validar documento via Azure Function:', error);
      
      // Rastrear erro na validação
      if (global.telemetryClient) {
        global.telemetryClient.trackException({
          exception: error,
          properties: {
            documentoId: documento.id,
            operacao: "validarDocumento"
          }
        });
      }
    }

    // Notificar envio do documento
    try {
      await azureFunctionsService.notificarEstudante(matriculaId, 'DOCUMENTO_ENVIADO');
      
      // Rastrear notificação enviada
      if (global.telemetryClient) {
        global.telemetryClient.trackEvent({
          name: "NotificacaoDocumentoEnviada",
          properties: {
            matriculaId: matriculaId,
            tipo: 'DOCUMENTO_ENVIADO'
          }
        });
      }
    } catch (error) {
      console.error('Erro ao notificar envio do documento:', error);
      
      // Rastrear erro na notificação
      if (global.telemetryClient) {
        global.telemetryClient.trackException({
          exception: error,
          properties: {
            matriculaId: matriculaId,
            operacao: "notificarEstudante"
          }
        });
      }
    }

    res.json({
      mensagem: 'Documento enviado com sucesso',
      documento
    });

  } catch (error) {
    console.error('Erro no upload de documento:', error);
    
    // Rastrear exceção
    if (global.telemetryClient) {
      global.telemetryClient.trackException({
        exception: error,
        properties: {
          operacao: "uploadDocumento",
          matriculaId: req.body.matriculaId,
          ip: req.ip
        }
      });
    }
    
    res.status(500).json({
      erro: 'Erro interno do servidor'
    });
  }
};

// Processar pagamento
exports.processarPagamento = async (req, res) => {
  try {
    const { matriculaId, metodo, dados } = req.body;

    // Rastrear início do processamento de pagamento
    if (global.telemetryClient) {
      global.telemetryClient.trackEvent({
        name: "PagamentoProcessamentoIniciado",
        properties: {
          matriculaId: matriculaId,
          metodo: metodo,
          ip: req.ip
        }
      });
    }

    if (!matriculaId || !metodo) {
      // Rastrear erro de validação
      if (global.telemetryClient) {
        global.telemetryClient.trackEvent({
          name: "PagamentoErroValidacao",
          properties: {
            erro: "Matrícula ID ou método de pagamento faltando",
            matriculaId: matriculaId,
            metodo: metodo,
            ip: req.ip
          }
        });
      }
      
      return res.status(400).json({
        erro: 'Matrícula ID e método de pagamento são obrigatórios'
      });
    }

    // Verificar se matrícula existe
    const matricula = await prisma.matricula.findUnique({
      where: { id: matriculaId }
    });

    if (!matricula) {
      // Rastrear matrícula não encontrada
      if (global.telemetryClient) {
        global.telemetryClient.trackEvent({
          name: "PagamentoMatriculaNaoEncontrada",
          properties: {
            matriculaId: matriculaId,
            ip: req.ip
          }
        });
      }
      
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
      // Rastrear pagamento duplicado
      if (global.telemetryClient) {
        global.telemetryClient.trackEvent({
          name: "PagamentoJaProcessado",
          properties: {
            matriculaId: matriculaId,
            ip: req.ip
          }
        });
      }
      
      return res.status(409).json({
        erro: 'Pagamento já foi processado'
      });
    }

    // Chamar Azure Function para validar pagamento
    const resultadoValidacao = await azureFunctionsService.validarPagamento(
      matriculaId, 
      metodo, 
      matricula.valor, 
      dados
    );

    // Rastrear resultado da validação
    if (global.telemetryClient) {
      global.telemetryClient.trackEvent({
        name: "PagamentoValidacaoConcluida",
        properties: {
          matriculaId: matriculaId,
          metodo: metodo,
          status: resultadoValidacao.status,
          valor: matricula.valor,
          ip: req.ip
        }
      });
    }

    // Se a validação foi bem-sucedida, atualizar o banco
    if (resultadoValidacao.status === 'APROVADO') {
      // Atualizar status da matrícula
      await prisma.matricula.update({
        where: { id: matriculaId },
        data: { status: 'PAGAMENTO_CONFIRMADO' }
      });

      // Rastrear pagamento aprovado
      if (global.telemetryClient) {
        global.telemetryClient.trackEvent({
          name: "PagamentoAprovado",
          properties: {
            matriculaId: matriculaId,
            metodo: metodo,
            valor: matricula.valor,
            ip: req.ip
          }
        });
      }

      // Notificar aprovação do pagamento
      try {
        await azureFunctionsService.notificarEstudante(matriculaId, 'PAGAMENTO_APROVADO');
        
        // Rastrear notificação enviada
        if (global.telemetryClient) {
          global.telemetryClient.trackEvent({
            name: "NotificacaoPagamentoEnviada",
            properties: {
              matriculaId: matriculaId,
              tipo: 'PAGAMENTO_APROVADO'
            }
          });
        }
      } catch (error) {
        console.error('Erro ao notificar aprovação do pagamento:', error);
        
        // Rastrear erro na notificação
        if (global.telemetryClient) {
          global.telemetryClient.trackException({
            exception: error,
            properties: {
              matriculaId: matriculaId,
              operacao: "notificarEstudante"
            }
          });
        }
      }
    } else {
      // Rastrear pagamento rejeitado
      if (global.telemetryClient) {
        global.telemetryClient.trackEvent({
          name: "PagamentoRejeitado",
          properties: {
            matriculaId: matriculaId,
            metodo: metodo,
            motivo: resultadoValidacao.motivo || 'Não especificado',
            ip: req.ip
          }
        });
      }
    }

    res.json({
      mensagem: 'Pagamento processado com sucesso',
      resultado: resultadoValidacao
    });

  } catch (error) {
    console.error('Erro ao processar pagamento:', error);
    
    // Rastrear exceção
    if (global.telemetryClient) {
      global.telemetryClient.trackException({
        exception: error,
        properties: {
          operacao: "processarPagamento",
          matriculaId: req.body.matriculaId,
          ip: req.ip
        }
      });
    }
    
    res.status(500).json({
      erro: 'Erro interno do servidor'
    });
  }
};

// Gerar contrato
exports.gerarContrato = async (req, res) => {
  try {
    const { matriculaId } = req.params;

    // Rastrear início da geração de contrato
    if (global.telemetryClient) {
      global.telemetryClient.trackEvent({
        name: "ContratoGeracaoIniciada",
        properties: {
          matriculaId: matriculaId,
          ip: req.ip
        }
      });
    }

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
      // Rastrear matrícula não encontrada
      if (global.telemetryClient) {
        global.telemetryClient.trackEvent({
          name: "ContratoMatriculaNaoEncontrada",
          properties: {
            matriculaId: matriculaId,
            ip: req.ip
          }
        });
      }
      
      return res.status(404).json({
        erro: 'Matrícula não encontrada'
      });
    }

    // Verificar se pagamento foi aprovado
    if (matricula.pagamentos.length === 0) {
      // Rastrear pagamento não aprovado
      if (global.telemetryClient) {
        global.telemetryClient.trackEvent({
          name: "ContratoPagamentoNaoAprovado",
          properties: {
            matriculaId: matriculaId,
            statusMatricula: matricula.status,
            ip: req.ip
          }
        });
      }
      
      return res.status(400).json({
        erro: 'Pagamento não foi aprovado'
      });
    }

    // Verificar se contrato já existe
    const contratoExistente = await prisma.contrato.findUnique({
      where: { matriculaId }
    });

    if (contratoExistente) {
      // Rastrear contrato já existente
      if (global.telemetryClient) {
        global.telemetryClient.trackEvent({
          name: "ContratoJaExiste",
          properties: {
            matriculaId: matriculaId,
            contratoId: contratoExistente.id,
            ip: req.ip
          }
        });
      }
      
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

    // Rastrear contrato gerado com sucesso
    if (global.telemetryClient) {
      global.telemetryClient.trackEvent({
        name: "ContratoGeradoComSucesso",
        properties: {
          matriculaId: matriculaId,
          contratoId: contrato.id,
          numeroContrato: numeroContrato,
          curso: matricula.curso.nome,
          campus: matricula.campus.nome,
          ip: req.ip
        }
      });
    }

    // Chamar Azure Function para gerar contrato
    try {
      await azureFunctionsService.gerarContrato(contrato.id, matriculaId);
      
      // Rastrear geração via Azure Function
      if (global.telemetryClient) {
        global.telemetryClient.trackEvent({
          name: "ContratoAzureFunctionChamada",
          properties: {
            contratoId: contrato.id,
            matriculaId: matriculaId
          }
        });
      }
    } catch (error) {
      console.error('Erro ao gerar contrato via Azure Function:', error);
      
      // Rastrear erro na Azure Function
      if (global.telemetryClient) {
        global.telemetryClient.trackException({
          exception: error,
          properties: {
            contratoId: contrato.id,
            operacao: "gerarContrato"
          }
        });
      }
    }

    // Notificar geração do contrato
    try {
      await azureFunctionsService.notificarEstudante(matriculaId, 'CONTRATO_GERADO');
      
      // Rastrear notificação enviada
      if (global.telemetryClient) {
        global.telemetryClient.trackEvent({
          name: "NotificacaoContratoEnviada",
          properties: {
            matriculaId: matriculaId,
            tipo: 'CONTRATO_GERADO'
          }
        });
      }
    } catch (error) {
      console.error('Erro ao notificar geração do contrato:', error);
      
      // Rastrear erro na notificação
      if (global.telemetryClient) {
        global.telemetryClient.trackException({
          exception: error,
          properties: {
            matriculaId: matriculaId,
            operacao: "notificarEstudante"
          }
        });
      }
    }

    res.json({
      mensagem: 'Contrato gerado com sucesso',
      contrato
    });

  } catch (error) {
    console.error('Erro ao gerar contrato:', error);
    
    // Rastrear exceção
    if (global.telemetryClient) {
      global.telemetryClient.trackException({
        exception: error,
        properties: {
          operacao: "gerarContrato",
          matriculaId: req.params.matriculaId,
          ip: req.ip
        }
      });
    }
    
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

// Teste de upload de documento (para desenvolvimento)
exports.testUploadDocumento = async (req, res) => {
  try {
    const file = req.file;

    if (!file) {
      return res.status(400).json({
        erro: 'Arquivo é obrigatório'
      });
    }

    // Gerar ID de teste
    const testId = 'test-' + Date.now();
    const testTipo = 'TESTE';

    // Upload para Azure Blob Storage
    let uploadResult;
    try {
      uploadResult = await blobService.uploadDocument(file, testId, testTipo);
      
      res.json({
        mensagem: 'Upload de teste realizado com sucesso',
        arquivo: {
          nomeOriginal: file.originalname,
          nomeArquivo: uploadResult.nomeArquivo,
          url: uploadResult.url,
          tamanho: uploadResult.tamanho,
          mimeType: uploadResult.mimeType
        },
        teste: {
          id: testId,
          tipo: testTipo
        }
      });

    } catch (error) {
      console.error('Erro no upload de teste:', error);
      res.status(500).json({
        erro: 'Falha no upload de teste',
        detalhes: error.message
      });
    }

  } catch (error) {
    console.error('Erro no teste de upload:', error);
    res.status(500).json({
      erro: 'Erro interno do servidor'
    });
  }
};

// Listar documentos no container (para desenvolvimento)
exports.listarDocumentos = async (req, res) => {
  try {
    const { prefix } = req.query;
    
    const documentos = await blobService.listDocuments(prefix);
    
    res.json({
      mensagem: 'Documentos listados com sucesso',
      total: documentos.length,
      documentos
    });

  } catch (error) {
    console.error('Erro ao listar documentos:', error);
    res.status(500).json({
      erro: 'Erro interno do servidor',
      detalhes: error.message
    });
  }
};

// Teste de conectividade com Azure Functions
exports.testConectividadeAzureFunctions = async (req, res) => {
  try {
    const resultado = await azureFunctionsService.testarConectividade();
    
    res.json({
      mensagem: 'Teste de conectividade com Azure Functions',
      resultado
    });

  } catch (error) {
    console.error('Erro no teste de conectividade:', error);
    res.status(500).json({
      erro: 'Erro interno do servidor',
      detalhes: error.message
    });
  }
};

// Teste de validação de pagamento via Azure Functions
exports.testValidarPagamento = async (req, res) => {
  try {
    const { matriculaId, metodo, valor, dados } = req.body;

    if (!matriculaId || !metodo || !valor) {
      return res.status(400).json({
        erro: 'Matrícula ID, método e valor são obrigatórios'
      });
    }

    const resultado = await azureFunctionsService.validarPagamento(matriculaId, metodo, valor, dados);
    
    res.json({
      mensagem: 'Teste de validação de pagamento via Azure Functions',
      resultado
    });

  } catch (error) {
    console.error('Erro no teste de validação de pagamento:', error);
    res.status(500).json({
      erro: 'Erro interno do servidor',
      detalhes: error.message
    });
  }
};

// Teste de validação de documento via Azure Functions
exports.testValidarDocumento = async (req, res) => {
  try {
    const { documentoId } = req.body;

    if (!documentoId) {
      return res.status(400).json({
        erro: 'Documento ID é obrigatório'
      });
    }

    const resultado = await azureFunctionsService.validarDocumento(documentoId);
    
    res.json({
      mensagem: 'Teste de validação de documento via Azure Functions',
      resultado
    });

  } catch (error) {
    console.error('Erro no teste de validação de documento:', error);
    res.status(500).json({
      erro: 'Erro interno do servidor',
      detalhes: error.message
    });
  }
};

// Teste de geração de contrato via Azure Functions
exports.testGerarContrato = async (req, res) => {
  try {
    const { matriculaId } = req.body;

    if (!matriculaId) {
      return res.status(400).json({
        erro: 'Matrícula ID é obrigatório'
      });
    }

    const resultado = await azureFunctionsService.gerarContrato(matriculaId);
    
    res.json({
      mensagem: 'Teste de geração de contrato via Azure Functions',
      resultado
    });

  } catch (error) {
    console.error('Erro no teste de geração de contrato:', error);
    res.status(500).json({
      erro: 'Erro interno do servidor',
      detalhes: error.message
    });
  }
};

// Teste de notificação de estudante via Azure Functions
exports.testNotificarEstudante = async (req, res) => {
  try {
    const { matriculaId, tipoNotificacao, dadosAdicionais } = req.body;

    if (!matriculaId || !tipoNotificacao) {
      return res.status(400).json({
        erro: 'Matrícula ID e tipo de notificação são obrigatórios'
      });
    }

    const resultado = await azureFunctionsService.notificarEstudante(matriculaId, tipoNotificacao, dadosAdicionais);
    
    res.json({
      mensagem: 'Teste de notificação de estudante via Azure Functions',
      resultado
    });

  } catch (error) {
    console.error('Erro no teste de notificação:', error);
    res.status(500).json({
      erro: 'Erro interno do servidor',
      detalhes: error.message
    });
  }
};
