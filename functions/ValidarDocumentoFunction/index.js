const { PrismaClient } = require('@prisma/client');
const { BlobServiceClient } = require('@azure/storage-blob');

const prisma = new PrismaClient();

module.exports = async function (context, req) {
  context.log('ValidarDocumentoFunction executada');

  try {
    const { documentoId } = req.body;

    if (!documentoId) {
      context.res = {
        status: 400,
        body: {
          erro: 'Documento ID é obrigatório'
        }
      };
      return;
    }

    // Buscar documento no banco
    const documento = await prisma.documento.findUnique({
      where: { id: documentoId },
      include: {
        matricula: {
          include: {
            curso: true,
            campus: true
          }
        }
      }
    });

    if (!documento) {
      context.res = {
        status: 404,
        body: {
          erro: 'Documento não encontrado'
        }
      };
      return;
    }

    // Simular validação do documento (em produção, usar IA ou validação manual)
    const validacoes = {
      legibilidade: Math.random() > 0.05, // 95% de chance de ser legível
      autenticidade: Math.random() > 0.1, // 90% de chance de ser autêntico
      completude: Math.random() > 0.02, // 98% de chance de estar completo
      validade: Math.random() > 0.03 // 97% de chance de ser válido
    };

    const todasValidas = Object.values(validacoes).every(v => v);
    const status = todasValidas ? 'APROVADO' : 'REJEITADO';
    const validadoAt = new Date();

    // Atualizar documento com resultado da validação
    const documentoAtualizado = await prisma.documento.update({
      where: { id: documentoId },
      data: {
        status,
        validadoAt,
        dadosValidacao: {
          validacoes,
          observacoes: todasValidas ? 'Documento aprovado' : 'Documento rejeitado - verificar qualidade',
          validadoPor: 'Sistema Automático',
          validadoAt: validadoAt.toISOString()
        }
      }
    });

    // Verificar se todos os documentos da matrícula foram aprovados
    const todosDocumentos = await prisma.documento.findMany({
      where: { matriculaId: documento.matriculaId }
    });

    const todosAprovados = todosDocumentos.every(doc => doc.status === 'APROVADO');
    
    if (todosAprovados && todosDocumentos.length >= 3) { // Mínimo de 3 documentos
      await prisma.matricula.update({
        where: { id: documento.matriculaId },
        data: { status: 'DOCUMENTOS_APROVADOS' }
      });

      context.log(`Todos os documentos aprovados para matrícula ${documento.matriculaId}`);
    }

    context.res = {
      status: 200,
      body: {
        documentoId,
        matriculaId: documento.matriculaId,
        tipo: documento.tipo,
        status,
        validacoes,
        validadoAt: validadoAt.toISOString(),
        mensagem: `Documento ${status.toLowerCase()}`,
        todosDocumentosAprovados: todosAprovados,
        documento: documentoAtualizado
      }
    };

  } catch (error) {
    context.log.error('Erro na validação de documento:', error);
    
    context.res = {
      status: 500,
      body: {
        erro: 'Erro interno na validação de documento',
        detalhes: error.message
      }
    };
  } finally {
    await prisma.$disconnect();
  }
}; 