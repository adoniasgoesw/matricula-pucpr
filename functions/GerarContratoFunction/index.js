const { PrismaClient } = require('@prisma/client');
const { v4: uuidv4 } = require('uuid');

const prisma = new PrismaClient();

module.exports = async function (context, req) {
  context.log('GerarContratoFunction executada');

  try {
    const { matriculaId } = req.body;

    if (!matriculaId) {
      context.res = {
        status: 400,
        body: {
          erro: 'Matrícula ID é obrigatório'
        }
      };
      return;
    }

    // Buscar matrícula com todos os dados necessários
    const matricula = await prisma.matricula.findUnique({
      where: { id: matriculaId },
      include: {
        curso: true,
        campus: true,
        documentos: {
          where: { status: 'APROVADO' }
        },
        pagamentos: {
          where: { status: 'APROVADO' },
          orderBy: { createdAt: 'desc' },
          take: 1
        }
      }
    });

    if (!matricula) {
      context.res = {
        status: 404,
        body: {
          erro: 'Matrícula não encontrada'
        }
      };
      return;
    }

    // Verificar se já existe contrato
    const contratoExistente = await prisma.contrato.findUnique({
      where: { matriculaId }
    });

    if (contratoExistente) {
      context.res = {
        status: 409,
        body: {
          erro: 'Contrato já existe para esta matrícula',
          contrato: contratoExistente
        }
      };
      return;
    }

    // Verificar se pagamento foi aprovado
    if (matricula.pagamentos.length === 0) {
      context.res = {
        status: 400,
        body: {
          erro: 'Pagamento não foi aprovado'
        }
      };
      return;
    }

    // Verificar se documentos foram aprovados
    if (matricula.documentos.length < 3) {
      context.res = {
        status: 400,
        body: {
          erro: 'Mínimo de 3 documentos aprovados é necessário'
        }
      };
      return;
    }

    // Gerar número do contrato
    const numeroContrato = `CONTRATO-${new Date().getFullYear()}-${matriculaId.substring(0, 8).toUpperCase()}`;
    const geradoAt = new Date();

    // Simular geração do PDF do contrato (em produção, usar biblioteca como PDFKit)
    const contratoData = {
      numero: numeroContrato,
      dataGeracao: geradoAt.toISOString(),
      matricula: {
        id: matricula.id,
        nome: matricula.nome,
        cpf: matricula.cpf,
        email: matricula.email,
        telefone: matricula.telefone,
        endereco: matricula.endereco,
        cidade: matricula.cidade,
        estado: matricula.estado
      },
      curso: {
        nome: matricula.curso.nome,
        duracao: matricula.curso.duracao,
        modalidade: matricula.curso.modalidade
      },
      campus: {
        nome: matricula.campus.nome,
        endereco: matricula.campus.endereco
      },
      pagamento: {
        valor: matricula.pagamentos[0].valor,
        metodo: matricula.pagamentos[0].metodo,
        dataPagamento: matricula.pagamentos[0].processadoAt
      },
      documentos: matricula.documentos.map(doc => ({
        tipo: doc.tipo,
        nomeArquivo: doc.nomeArquivo,
        aprovadoEm: doc.validadoAt
      }))
    };

    // URL simulada do contrato (em produção, gerar PDF real e fazer upload)
    const contratoUrl = `https://puc.edu.br/contratos/${numeroContrato}.pdf`;

    // Criar contrato no banco
    const contrato = await prisma.contrato.create({
      data: {
        matriculaId,
        numero: numeroContrato,
        url: contratoUrl,
        dados: contratoData,
        geradoAt
      }
    });

    // Atualizar status da matrícula
    await prisma.matricula.update({
      where: { id: matriculaId },
      data: { status: 'CONTRATO_GERADO' }
    });

    context.log(`Contrato gerado para matrícula ${matriculaId}: ${numeroContrato}`);

    context.res = {
      status: 200,
      body: {
        matriculaId,
        numeroContrato,
        contratoUrl,
        geradoAt: geradoAt.toISOString(),
        mensagem: 'Contrato gerado com sucesso',
        contrato: {
          ...contrato,
          dados: contratoData
        }
      }
    };

  } catch (error) {
    context.log.error('Erro na geração de contrato:', error);
    
    context.res = {
      status: 500,
      body: {
        erro: 'Erro interno na geração de contrato',
        detalhes: error.message
      }
    };
  } finally {
    await prisma.$disconnect();
  }
}; 