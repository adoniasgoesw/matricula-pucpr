import { sql, poolConnect } from '../db.js';

export const cadastrarAluno = async (req, res) => {
  try {
    const {
      nomeCompleto,
      cpf,
      rg,
      dataNascimento,
      email,
      telefone,
      endereco,
      cidade,
      estado,
      campus,
      curso,
      formaPagamento,
      valor
    } = req.body;

    await poolConnect;
    const request = new sql.Request();

    // 1. Verifica se o aluno já existe (pelo CPF)
    const checkResult = await request
      .input('cpf', sql.Char(11), cpf)
      .query('SELECT Id FROM Alunos WHERE CPF = @cpf');

    let alunoId;

    if (checkResult.recordset.length > 0) {
      alunoId = checkResult.recordset[0].Id;
    } else {
      // 2. Inserir novo aluno
      const insertAluno = await request
        .input('nomeCompleto', sql.NVarChar(150), nomeCompleto)
        .input('cpf', sql.Char(11), cpf)
        .input('rg', sql.NVarChar(20), rg)
        .input('dataNascimento', sql.Date, dataNascimento)
        .input('email', sql.NVarChar(100), email)
        .input('telefone', sql.NVarChar(20), telefone)
        .input('endereco', sql.NVarChar(200), endereco)
        .input('cidade', sql.NVarChar(100), cidade)
        .input('estado', sql.Char(2), estado)
        .input('campus', sql.NVarChar(100), campus)
        .input('curso', sql.NVarChar(100), curso)
        .query(`
          INSERT INTO Alunos (
            NomeCompleto, CPF, RG, DataNascimento, Email, Telefone,
            Endereco, Cidade, Estado, Campus, Curso
          )
          OUTPUT INSERTED.Id
          VALUES (
            @nomeCompleto, @cpf, @rg, @dataNascimento, @email, @telefone,
            @endereco, @cidade, @estado, @campus, @curso
          )
        `);

      alunoId = insertAluno.recordset[0].Id;
    }

    // 3. Inserir matrícula
    const insertMatricula = await request
      .input('alunoId', sql.Int, alunoId)
      .query(`
        INSERT INTO Matriculas (AlunoId)
        OUTPUT INSERTED.Id
        VALUES (@alunoId)
      `);

    const matriculaId = insertMatricula.recordset[0].Id;

    // 4. Inserir pagamento
    await request
      .input('matriculaId', sql.Int, matriculaId)
      .input('formaPagamento', sql.NVarChar(50), formaPagamento)
      .input('valor', sql.Decimal(10, 2), valor)
      .input('status', sql.NVarChar(50), 'Pendente')
      .query(`
        INSERT INTO Pagamentos (MatriculaId, FormaPagamento, Valor, Status)
        VALUES (@matriculaId, @formaPagamento, @valor, @status)
      `);

    return res.status(201).json({
      mensagem: 'Matrícula criada com sucesso',
      alunoId,
      matriculaId
    });

  } catch (error) {
    console.error('Erro ao cadastrar aluno:', error);
    res.status(500).json({
      erro: 'Erro interno do servidor'
    });
  }
};
