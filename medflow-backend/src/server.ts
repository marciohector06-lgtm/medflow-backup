import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

app.post('/usuarios', async (req, res) => {
  const { nome, email, senha, cargo } = req.body;
  try {
    const usuario = await prisma.usuario.create({
      data: { nome, email, senha, cargo }
    });
    res.status(201).json(usuario);
  } catch (e) {
    res.status(400).json({ erro: "E-mail já cadastrado." });
  }
});

app.post('/login', async (req, res) => {
  const { email, senha } = req.body;
  const usuario = await prisma.usuario.findUnique({ where: { email } });
  if (!usuario || usuario.senha !== senha) {
    return res.status(401).json({ erro: "E-mail ou senha inválidos." });
  }
  res.json({ id: usuario.id, nome: usuario.nome, cargo: usuario.cargo });
});

app.post('/pacientes', async (req, res) => {
  const { nome, cpf, whatsapp, cep } = req.body;
  try {
    const paciente = await prisma.paciente.create({
      data: { nome, cpf, whatsapp, cep }
    });
    res.status(201).json(paciente);
  } catch (e) {
    res.status(400).json({ erro: "Paciente já existe." });
  }
});

app.post('/procedimentos', async (req, res) => {
  const { nome, tempo_estimado, preco } = req.body;
  const proc = await prisma.procedimento.create({
    data: { nome, tempo_estimado, preco: parseFloat(preco) }
  });
  res.status(201).json(proc);
});

app.post('/atendimentos', async (req, res) => {
  const { tipo, prioridade, paciente_id, procedimento_id } = req.body;
  try {
    const procedimento = await prisma.procedimento.findUnique({
      where: { id: procedimento_id }
    });

    const atendimento = await prisma.atendimento.create({
      data: { 
        tipo, 
        prioridade, 
        pacienteId: paciente_id, 
        procedimentoId: procedimento_id,
        financeiro: {
          create: { valor: procedimento?.preco || 0 }
        }
      }
    });
    res.status(201).json(atendimento);
  } catch (e) {
    res.status(400).json({ erro: "Erro ao abrir atendimento." });
  }
});

app.post('/triagens', async (req, res) => {
  const { atendimentoId, pressao, peso, temperatura, saturacao, queixa_principal } = req.body;
  const triagem = await prisma.triagem.create({
    data: { atendimentoId, pressao, peso, temperatura, saturacao, queixa_principal }
  });
  await prisma.atendimento.update({
    where: { id: atendimentoId },
    data: { status: 'AGUARDANDO_MEDICO' }
  });
  res.status(201).json(triagem);
});

app.get('/atendimentos/:id', async (req, res) => {
  const atendimento = await prisma.atendimento.findUnique({
    where: { id: req.params.id },
    include: { paciente: true, triagem: true, exames: true, procedimento: true, financeiro: true }
  });
  res.json(atendimento);
});


app.patch('/financeiro/:atendimentoId/pagar', async (req, res) => {
  const { atendimentoId } = req.params;
  const { forma_pagamento } = req.body;

  try {
    const pagamento = await prisma.financeiro.update({
      where: { atendimentoId }, // Busca direto pelo ID do atendimento
      data: { 
        status_pagamento: 'PAGO',
        forma_pagamento 
      }
    });
    res.json({ message: "Pagamento confirmado!", pagamento });
  } catch (e) {
    res.status(400).json({ erro: "Erro ao processar pagamento. Verifique o ID." });
  }
});
app.get('/admin/dashboard', async (req, res) => {
  const pacientes = await prisma.paciente.count();
  const atendimentos = await prisma.atendimento.count();
  const faturamento = await prisma.financeiro.aggregate({
    _sum: { valor: true },
    where: { status_pagamento: 'PAGO' }
  });
  res.json({
    total_pacientes: pacientes,
    total_atendimentos: atendimentos,
    caixa: faturamento._sum.valor || 0
  });
});
// --- ROTA DE AGENDAMENTO (RECEPÇÃO) ---
app.post('/agenda', async (req, res) => {
  const { pacienteId, data_hora } = req.body;
  const agendamento = await prisma.agenda.create({
    data: { pacienteId, data_hora: new Date(data_hora) }
  });
  res.status(201).json(agendamento);
});

// --- ROTA DE EVOLUÇÃO CLÍNICA (MÉDICO) ---
app.post('/prontuarios', async (req, res) => {
  const { atendimentoId, anamnese, exame_fisico, hipotese_diag, conduta, usuarioId } = req.body;
  
  try {
    const prontuario = await prisma.prontuario.create({
      data: { atendimentoId, anamnese, exame_fisico, hipotese_diag, conduta }
    });

    // Auditoria: Registra quem finalizou o atendimento
    await prisma.log.create({
      data: {
        acao: "FINALIZOU_ATENDIMENTO",
        detalhes: `Atendimento ${atendimentoId} finalizado pelo médico.`,
        usuarioId
      }
    });

    // Atualiza o status do atendimento para FINALIZADO
    await prisma.atendimento.update({
      where: { id: atendimentoId },
      data: { status: 'FINALIZADO' }
    });

    res.status(201).json(prontuario);
  } catch (e) {
    res.status(400).json({ erro: "Erro ao salvar prontuário." });
  }
});

// --- ROTA DE AUDITORIA (ADMIN) ---
app.get('/admin/logs', async (req, res) => {
  const logs = await prisma.log.findMany({
    include: { usuario: { select: { nome: true, cargo: true } } },
    orderBy: { createdAt: 'desc' }
  });
  res.json(logs);
});

app.listen(3333, () => console.log('MedFlow System Online 🚀'));