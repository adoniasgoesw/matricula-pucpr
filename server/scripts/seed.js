const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const cursos = [
  {
    nome: 'Administração',
    tipo: 'BACHARELADO',
    duracao: '8 semestres',
    turno: 'Noturno',
    mensalidade: 1250.00,
    descricao: 'Forma profissionais capacitados para gerir organizações e recursos.'
  },
  {
    nome: 'Direito',
    tipo: 'BACHARELADO',
    duracao: '10 semestres',
    turno: 'Matutino/Noturno',
    mensalidade: 1850.00,
    descricao: 'Forma profissionais para atuar nas diversas áreas jurídicas.'
  },
  {
    nome: 'Engenharia de Software',
    tipo: 'BACHARELADO',
    duracao: '8 semestres',
    turno: 'Integral',
    mensalidade: 1650.00,
    descricao: 'Forma profissionais para desenvolvimento e gestão de sistemas.'
  },
  {
    nome: 'Medicina',
    tipo: 'BACHARELADO',
    duracao: '12 semestres',
    turno: 'Integral',
    mensalidade: 9800.00,
    descricao: 'Forma médicos com visão humanista e excelência técnica.'
  },
  {
    nome: 'Análise e Desenvolvimento de Sistemas',
    tipo: 'TECNOLOGO',
    duracao: '6 semestres',
    turno: 'Noturno',
    mensalidade: 1150.00,
    descricao: 'Forma profissionais para análise, desenvolvimento e manutenção de sistemas.'
  },
  {
    nome: 'Ciência da Computação',
    tipo: 'BACHARELADO',
    duracao: '8 semestres',
    turno: 'Integral',
    mensalidade: 1750.00,
    descricao: 'Forma profissionais para pesquisa e desenvolvimento em computação.'
  },
  {
    nome: 'Sistemas de Informação',
    tipo: 'BACHARELADO',
    duracao: '8 semestres',
    turno: 'Noturno',
    mensalidade: 1450.00,
    descricao: 'Forma profissionais para gestão de sistemas de informação empresariais.'
  },
  {
    nome: 'Engenharia Civil',
    tipo: 'BACHARELADO',
    duracao: '10 semestres',
    turno: 'Matutino',
    mensalidade: 1950.00,
    descricao: 'Forma engenheiros para planejamento e execução de obras civis.'
  },
  {
    nome: 'Engenharia Elétrica',
    tipo: 'BACHARELADO',
    duracao: '10 semestres',
    turno: 'Noturno',
    mensalidade: 1850.00,
    descricao: 'Forma engenheiros para sistemas elétricos e eletrônicos.'
  },
  {
    nome: 'Engenharia Mecânica',
    tipo: 'BACHARELADO',
    duracao: '10 semestres',
    turno: 'Noturno',
    mensalidade: 1800.00,
    descricao: 'Forma engenheiros para projetos e manutenção de sistemas mecânicos.'
  },
  {
    nome: 'Psicologia',
    tipo: 'BACHARELADO',
    duracao: '10 semestres',
    turno: 'Matutino/Noturno',
    mensalidade: 1650.00,
    descricao: 'Forma psicólogos para atuação em diversas áreas da psicologia.'
  },
  {
    nome: 'Pedagogia',
    tipo: 'LICENCIATURA',
    duracao: '8 semestres',
    turno: 'Noturno',
    mensalidade: 950.00,
    descricao: 'Forma pedagogos para atuação na educação básica e gestão escolar.'
  },
  {
    nome: 'Letras - Português/Inglês',
    tipo: 'LICENCIATURA',
    duracao: '8 semestres',
    turno: 'Noturno',
    mensalidade: 1050.00,
    descricao: 'Forma professores de língua portuguesa e inglesa.'
  },
  {
    nome: 'História',
    tipo: 'LICENCIATURA',
    duracao: '8 semestres',
    turno: 'Noturno',
    mensalidade: 1000.00,
    descricao: 'Forma professores de história para educação básica.'
  },
  {
    nome: 'Geografia',
    tipo: 'LICENCIATURA',
    duracao: '8 semestres',
    turno: 'Noturno',
    mensalidade: 1000.00,
    descricao: 'Forma professores de geografia para educação básica.'
  },
  {
    nome: 'Matemática',
    tipo: 'LICENCIATURA',
    duracao: '8 semestres',
    turno: 'Noturno',
    mensalidade: 1100.00,
    descricao: 'Forma professores de matemática para educação básica.'
  },
  {
    nome: 'Física',
    tipo: 'LICENCIATURA',
    duracao: '8 semestres',
    turno: 'Noturno',
    mensalidade: 1100.00,
    descricao: 'Forma professores de física para educação básica.'
  },
  {
    nome: 'Química',
    tipo: 'LICENCIATURA',
    duracao: '8 semestres',
    turno: 'Noturno',
    mensalidade: 1100.00,
    descricao: 'Forma professores de química para educação básica.'
  },
  {
    nome: 'Biologia',
    tipo: 'LICENCIATURA',
    duracao: '8 semestres',
    turno: 'Noturno',
    mensalidade: 1100.00,
    descricao: 'Forma professores de biologia para educação básica.'
  },
  {
    nome: 'Filosofia',
    tipo: 'LICENCIATURA',
    duracao: '8 semestres',
    turno: 'Noturno',
    mensalidade: 1000.00,
    descricao: 'Forma professores de filosofia para educação básica.'
  },
  {
    nome: 'Teologia',
    tipo: 'BACHARELADO',
    duracao: '8 semestres',
    turno: 'Noturno',
    mensalidade: 1200.00,
    descricao: 'Forma teólogos para atuação pastoral e acadêmica.'
  },
  {
    nome: 'Jornalismo',
    tipo: 'BACHARELADO',
    duracao: '8 semestres',
    turno: 'Noturno',
    mensalidade: 1350.00,
    descricao: 'Forma jornalistas para atuação em diversos meios de comunicação.'
  },
  {
    nome: 'Publicidade e Propaganda',
    tipo: 'BACHARELADO',
    duracao: '8 semestres',
    turno: 'Noturno',
    mensalidade: 1400.00,
    descricao: 'Forma publicitários para criação e gestão de campanhas publicitárias.'
  },
  {
    nome: 'Arquitetura e Urbanismo',
    tipo: 'BACHARELADO',
    duracao: '10 semestres',
    turno: 'Matutino',
    mensalidade: 2100.00,
    descricao: 'Forma arquitetos para projetos arquitetônicos e urbanísticos.'
  },
  {
    nome: 'Design',
    tipo: 'BACHARELADO',
    duracao: '8 semestres',
    turno: 'Matutino',
    mensalidade: 1500.00,
    descricao: 'Forma designers para criação de produtos e comunicação visual.'
  }
];

const campus = [
  { id: 'curitiba', nome: 'Curitiba - Campus Central', cidade: 'Curitiba', estado: 'PR' },
  { id: 'londrina', nome: 'Londrina', cidade: 'Londrina', estado: 'PR' },
  { id: 'maringa', nome: 'Maringá', cidade: 'Maringá', estado: 'PR' },
  { id: 'toledo', nome: 'Toledo', cidade: 'Toledo', estado: 'PR' },
  { id: 'cascavel', nome: 'Cascavel', cidade: 'Cascavel', estado: 'PR' },
  { id: 'ponta-grossa', nome: 'Ponta Grossa', cidade: 'Ponta Grossa', estado: 'PR' },
  { id: 'guarapuava', nome: 'Guarapuava', cidade: 'Guarapuava', estado: 'PR' },
  { id: 'pato-branco', nome: 'Pato Branco', cidade: 'Pato Branco', estado: 'PR' },
  { id: 'francisco-beltrao', nome: 'Francisco Beltrão', cidade: 'Francisco Beltrão', estado: 'PR' },
  { id: 'uniao-da-vitoria', nome: 'União da Vitória', cidade: 'União da Vitória', estado: 'PR' },
  { id: 'paranagua', nome: 'Paranaguá', cidade: 'Paranaguá', estado: 'PR' },
  { id: 'campo-mourao', nome: 'Campo Mourão', cidade: 'Campo Mourão', estado: 'PR' },
  { id: 'apucarana', nome: 'Apucarana', cidade: 'Apucarana', estado: 'PR' },
  { id: 'cornelio-procopio', nome: 'Cornélio Procópio', cidade: 'Cornélio Procópio', estado: 'PR' },
  { id: 'jacarezinho', nome: 'Jacaerzinho', cidade: 'Jacaerzinho', estado: 'PR' }
];

async function main() {
  console.log('🌱 Iniciando seed do banco de dados...');

  try {
    // Limpar dados existentes
    console.log('🗑️ Limpando dados existentes...');
    await prisma.documento.deleteMany();
    await prisma.pagamento.deleteMany();
    await prisma.contrato.deleteMany();
    await prisma.matricula.deleteMany();
    await prisma.curso.deleteMany();
    await prisma.campus.deleteMany();

    // Inserir campus
    console.log('🏫 Inserindo campus...');
    for (const campusData of campus) {
      await prisma.campus.create({
        data: campusData
      });
    }
    console.log(`✅ ${campus.length} campus inseridos`);

    // Inserir cursos
    console.log('📚 Inserindo cursos...');
    for (const cursoData of cursos) {
      await prisma.curso.create({
        data: cursoData
      });
    }
    console.log(`✅ ${cursos.length} cursos inseridos`);

    console.log('🎉 Seed concluído com sucesso!');

  } catch (error) {
    console.error('❌ Erro durante o seed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

if (require.main === module) {
  main()
    .then(() => {
      console.log('✅ Seed executado com sucesso');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Erro no seed:', error);
      process.exit(1);
    });
}

module.exports = { main }; 