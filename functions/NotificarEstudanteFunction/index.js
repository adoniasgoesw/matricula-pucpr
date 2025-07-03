const { PrismaClient } = require('@prisma/client');
const nodemailer = require('nodemailer');

const prisma = new PrismaClient();

// Configurar transportador de email (em produção, usar serviço real como SendGrid)
const transporter = nodemailer.createTransporter({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER || 'teste@puc.edu.br',
    pass: process.env.EMAIL_PASS || 'senha-teste'
  }
});

module.exports = async function (context, req) {
  context.log('NotificarEstudanteFunction executada');

  try {
    const { matriculaId, tipoNotificacao, dadosAdicionais } = req.body;

    if (!matriculaId || !tipoNotificacao) {
      context.res = {
        status: 400,
        body: {
          erro: 'Matrícula ID e tipo de notificação são obrigatórios'
        }
      };
      return;
    }

    // Buscar matrícula
    const matricula = await prisma.matricula.findUnique({
      where: { id: matriculaId },
      include: {
        curso: true,
        campus: true,
        documentos: true,
        pagamentos: {
          orderBy: { createdAt: 'desc' },
          take: 1
        },
        contrato: true
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

    // Definir templates de notificação
    const templates = {
      MATRICULA_CRIADA: {
        assunto: 'Matrícula Criada - PUC',
        template: `
          <h2>Olá ${matricula.nome}!</h2>
          <p>Sua matrícula foi criada com sucesso.</p>
          <h3>Detalhes da Matrícula:</h3>
          <ul>
            <li><strong>Curso:</strong> ${matricula.curso.nome}</li>
            <li><strong>Campus:</strong> ${matricula.campus.nome}</li>
            <li><strong>Valor:</strong> R$ ${matricula.valor.toFixed(2)}</li>
            <li><strong>Status:</strong> ${matricula.status}</li>
          </ul>
          <p>Próximos passos:</p>
          <ol>
            <li>Envie os documentos necessários</li>
            <li>Realize o pagamento</li>
            <li>Aguarde a aprovação</li>
          </ol>
          <p>Acompanhe o status em: <a href="http://localhost:5173/status/${matricula.id}">Portal do Estudante</a></p>
        `
      },
      DOCUMENTO_ENVIADO: {
        assunto: 'Documento Recebido - PUC',
        template: `
          <h2>Olá ${matricula.nome}!</h2>
          <p>Recebemos seu documento e ele está sendo analisado.</p>
          <h3>Documentos Enviados:</h3>
          <ul>
            ${matricula.documentos.map(doc => `<li>${doc.tipo}: ${doc.status || 'Em análise'}</li>`).join('')}
          </ul>
          <p>Acompanhe o status em: <a href="http://localhost:5173/status/${matricula.id}">Portal do Estudante</a></p>
        `
      },
      DOCUMENTO_APROVADO: {
        assunto: 'Documento Aprovado - PUC',
        template: `
          <h2>Olá ${matricula.nome}!</h2>
          <p>Seu documento foi aprovado!</p>
          <h3>Detalhes:</h3>
          <ul>
            <li><strong>Tipo:</strong> ${dadosAdicionais?.tipoDocumento || 'Documento'}</li>
            <li><strong>Status:</strong> Aprovado</li>
          </ul>
          <p>Acompanhe o status em: <a href="http://localhost:5173/status/${matricula.id}">Portal do Estudante</a></p>
        `
      },
      PAGAMENTO_APROVADO: {
        assunto: 'Pagamento Aprovado - PUC',
        template: `
          <h2>Olá ${matricula.nome}!</h2>
          <p>Seu pagamento foi aprovado!</p>
          <h3>Detalhes do Pagamento:</h3>
          <ul>
            <li><strong>Valor:</strong> R$ ${matricula.pagamentos[0]?.valor.toFixed(2) || matricula.valor.toFixed(2)}</li>
            <li><strong>Método:</strong> ${matricula.pagamentos[0]?.metodo || 'Não informado'}</li>
            <li><strong>Data:</strong> ${matricula.pagamentos[0]?.processadoAt || new Date().toLocaleDateString()}</li>
          </ul>
          <p>Acompanhe o status em: <a href="http://localhost:5173/status/${matricula.id}">Portal do Estudante</a></p>
        `
      },
      CONTRATO_GERADO: {
        assunto: 'Contrato Gerado - PUC',
        template: `
          <h2>Olá ${matricula.nome}!</h2>
          <p>Seu contrato foi gerado com sucesso!</p>
          <h3>Detalhes do Contrato:</h3>
          <ul>
            <li><strong>Número:</strong> ${matricula.contrato?.numero || 'N/A'}</li>
            <li><strong>Curso:</strong> ${matricula.curso.nome}</li>
            <li><strong>Campus:</strong> ${matricula.campus.nome}</li>
          </ul>
          <p><a href="${matricula.contrato?.url || '#'}" target="_blank">Baixar Contrato</a></p>
          <p>Acompanhe o status em: <a href="http://localhost:5173/status/${matricula.id}">Portal do Estudante</a></p>
        `
      },
      MATRICULA_APROVADA: {
        assunto: 'Matrícula Aprovada - PUC',
        template: `
          <h2>Parabéns ${matricula.nome}!</h2>
          <p>Sua matrícula foi aprovada!</p>
          <h3>Detalhes:</h3>
          <ul>
            <li><strong>Curso:</strong> ${matricula.curso.nome}</li>
            <li><strong>Campus:</strong> ${matricula.campus.nome}</li>
            <li><strong>Início:</strong> ${dadosAdicionais?.dataInicio || 'A ser definido'}</li>
          </ul>
          <p>Bem-vindo à PUC!</p>
          <p>Acompanhe o status em: <a href="http://localhost:5173/status/${matricula.id}">Portal do Estudante</a></p>
        `
      }
    };

    const template = templates[tipoNotificacao];
    if (!template) {
      context.res = {
        status: 400,
        body: {
          erro: 'Tipo de notificação inválido'
        }
      };
      return;
    }

    // Enviar email (simulado em desenvolvimento)
    let emailEnviado = false;
    try {
      const mailOptions = {
        from: process.env.EMAIL_USER || 'noreply@puc.edu.br',
        to: matricula.email,
        subject: template.assunto,
        html: template.template
      };

      // Em desenvolvimento, apenas simular o envio
      if (process.env.NODE_ENV === 'production') {
        await transporter.sendMail(mailOptions);
        emailEnviado = true;
      } else {
        context.log('📧 Email simulado enviado para:', matricula.email);
        context.log('📧 Assunto:', template.assunto);
        emailEnviado = true;
      }
    } catch (emailError) {
      context.log.error('Erro ao enviar email:', emailError);
      emailEnviado = false;
    }

    // Registrar notificação no banco
    const notificacao = await prisma.notificacao.create({
      data: {
        matriculaId,
        tipo: tipoNotificacao,
        destinatario: matricula.email,
        assunto: template.assunto,
        conteudo: template.template,
        enviado: emailEnviado,
        dadosAdicionais: dadosAdicionais || {},
        enviadoAt: new Date()
      }
    });

    context.log(`Notificação ${tipoNotificacao} enviada para matrícula ${matriculaId}`);

    context.res = {
      status: 200,
      body: {
        matriculaId,
        tipoNotificacao,
        destinatario: matricula.email,
        enviado: emailEnviado,
        enviadoAt: new Date().toISOString(),
        mensagem: `Notificação ${tipoNotificacao} enviada com sucesso`,
        notificacao
      }
    };

  } catch (error) {
    context.log.error('Erro na notificação:', error);
    
    context.res = {
      status: 500,
      body: {
        erro: 'Erro interno na notificação',
        detalhes: error.message
      }
    };
  } finally {
    await prisma.$disconnect();
  }
}; 