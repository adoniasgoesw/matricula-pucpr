const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

module.exports = async function (context, req) {
  context.log('ValidarPagamentoFunction executada');

  try {
    const { matriculaId, metodo, valor, dados } = req.body;

    // Validações básicas
    if (!matriculaId || !metodo || !valor) {
      context.res = {
        status: 400,
        body: {
          erro: 'Matrícula ID, método e valor são obrigatórios'
        }
      };
      return;
    }

    // Verificar se matrícula existe
    const matricula = await prisma.matricula.findUnique({
      where: { id: matriculaId },
      include: {
        curso: true,
        campus: true
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

    // Verificar se já existe pagamento aprovado
    const pagamentoExistente = await prisma.pagamento.findFirst({
      where: {
        matriculaId,
        status: 'APROVADO'
      }
    });

    if (pagamentoExistente) {
      context.res = {
        status: 409,
        body: {
          erro: 'Pagamento já foi processado para esta matrícula'
        }
      };
      return;
    }

    // Simular validação de pagamento (em produção, integrar com gateway real)
    const status = Math.random() > 0.1 ? 'APROVADO' : 'REJEITADO';
    const processadoAt = new Date();
    const transacaoId = `TXN-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    // Criar registro de pagamento
    const pagamento = await prisma.pagamento.create({
      data: {
        matriculaId,
        metodo: metodo.toUpperCase(),
        valor: parseFloat(valor),
        status,
        dados: {
          ...dados,
          transacaoId,
          processadoAt: processadoAt.toISOString()
        },
        processadoAt
      }
    });

    // Atualizar status da matrícula se pagamento aprovado
    if (status === 'APROVADO') {
      await prisma.matricula.update({
        where: { id: matriculaId },
        data: { status: 'PAGAMENTO_CONFIRMADO' }
      });

      context.log(`Pagamento aprovado para matrícula ${matriculaId}`);
    } else {
      context.log(`Pagamento rejeitado para matrícula ${matriculaId}`);
    }

    context.res = {
      status: 200,
      body: {
        matriculaId,
        status,
        transacaoId,
        valor: parseFloat(valor),
        metodo: metodo.toUpperCase(),
        processadoAt: processadoAt.toISOString(),
        mensagem: `Pagamento ${status.toLowerCase()}`,
        pagamento
      }
    };

  } catch (error) {
    context.log.error('Erro na validação de pagamento:', error);
    
    context.res = {
      status: 500,
      body: {
        erro: 'Erro interno na validação de pagamento',
        detalhes: error.message
      }
    };
  } finally {
    await prisma.$disconnect();
  }
}; 