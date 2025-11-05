import { Router } from 'express';
import { PrismaClient } from '../generated/prisma/client.js';
import { checkAuthMiddleware } from '../middlewares/check-auth.js';

const taskRoutes = Router();
const prisma = new PrismaClient();

taskRoutes.post('/', checkAuthMiddleware, async (req, res) => {

  try {
    const { titulo, descricao, prioridade, data_limite } = req.body;

    if (!titulo || !data_limite) {
      return res.status(400).json({ mensagem: 'Campos obrigatórios ausentes' , status: 400});
    }

    let column = await prisma.coluna.findFirst({
      where: {
        titulo: 'todo',
        id_usuario: req.user,
      }
    });

    console.log(req.user);
    
    let user = await prisma.usuario.findUnique({
      where: { id: req.user },
    });

    const newTask = await prisma.tarefa.create({
      data: {
        titulo,
        descricao,
        prioridade: prioridade || 'BAIXA',
        data_limite: new Date(data_limite),
        id_usuario: req.user,
        id_coluna : column.id
      },
    });

    res.status(201).json({mensagem: 'Tarefa criada com sucesso', tarefa: newTask, status: 201});
  } catch (err) {
    console.error(err);
    res.status(500).json({ mensagem: 'Erro ao criar tarefa', status: 500 });
  }
});

taskRoutes.get('/', checkAuthMiddleware, async (req, res) => {
  try {
    const tasks = await prisma.tarefa.findMany({
      where: { id_usuario: req.user },
      orderBy: { data_criacao: 'desc' },
    });

    res.json({mensagem: 'Tarefas buscadas com sucesso', tarefas: tasks, status: 200});
  } catch (err) {
    res.status(500).json({ mensagem: 'Erro ao buscar tarefas', status: 500 });
  }
});

taskRoutes.get('/:id', checkAuthMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    const task = await prisma.tarefa.findFirst({
      where: {
        id: Number(id),
        id_usuario: req.user,
      },
    });

    if (!task) {
      return res.status(404).json({ mensagem: 'Tarefa não encontrada', status: 404 });
    }

    res.json({mensagem: 'Tarefa buscada com sucesso', tarefa: task, status: 200});
  } catch (err) {
    res.status(500).json({ mensagem: 'Erro ao buscar tarefa' });
  }
});

taskRoutes.put('/:id', checkAuthMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { titulo, descricao, status, prioridade, data_limite } = req.body;

    const task = await prisma.tarefa.findFirst({
      where: { id: Number(id), id_usuario: req.user },
    });

    if (!task) {
      return res.status(404).json({ mensagem: 'Tarefa não encontrada' });
    }

    const updatedTask = await prisma.tarefa.update({
      where: { id: task.id },
      data: {
        titulo: titulo ?? task.titulo,
        descricao: descricao ?? task.descricao,
        status: status ?? task.status,
        prioridade: prioridade ?? task.prioridade,
        data_limite: data_limite ? new Date(data_limite) : task.data_limite,
      },
    });

    res.json({ mensagem: 'Tarefa atualizada com sucesso', tarefa: updatedTask, status: 200 });
  } catch (err) {
    res.status(500).json({ mensagem: 'Erro ao atualizar tarefa', status: 500 });
  }
});

taskRoutes.patch('/:id/move', checkAuthMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { id_coluna } = req.body;

    if (!id_coluna) {
      return res.status(400).json({ mensagem: 'ID da coluna é obrigatório', status: 400 });
    }

    const task = await prisma.tarefa.findFirst({
      where: { id: Number(id), id_usuario: req.user },
    });

    if (!task) {
      return res.status(404).json({ mensagem: 'Tarefa não encontrada', status: 404 });
    }

    const column = await prisma.coluna.findFirst({
      where: {
        id: id_coluna
      }
    });

    if(!column){
      return res.status(404).json({ mensagem: 'Coluna não encontrada', status: 404 });
    }

    const movedTask = await prisma.tarefa.update({
      where: { id: task.id },
      data: { id_coluna, status: column.titulo },
    });

    res.json({ mensagem: 'Tarefa movida com sucesso', tarefa: movedTask, status: 200 });
  } catch (err) {
    res.status(500).json({ mensagem: 'Erro ao mover tarefa', status: 500 });
  }
});

taskRoutes.delete('/:id', checkAuthMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    const task = await prisma.tarefa.findFirst({
      where: { id: Number(id), id_usuario: req.user },
    });

    if (!task) {
      return res.status(404).json({ mensagem: 'Tarefa não encontrada', status: 404 });
    }

    await prisma.tarefa.delete({ where: { id: task.id }});

    res.json({ mensagem: 'Tarefa excluída com sucesso', status: 200 });
  } catch (err) {
    res.status(500).json({ mensagem: 'Erro ao excluir tarefa', status: 500 });
  }
});

export default taskRoutes;
