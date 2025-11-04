import { Router } from 'express';
import { PrismaClient } from '../generated/prisma/client.js';
import { checkAuthMiddleware } from '../middlewares/check-auth.js';

const columnRoutes = Router();
const prisma = new PrismaClient();

columnRoutes.post('/', checkAuthMiddleware, async (req, res) => {
  try {
    const { titulo, posicao } = req.body;

    if (!titulo) {
      return res.status(400).json({ mensagem: 'O título é obrigatório', status: 400});
    }

    const newColumn = await prisma.coluna.create({
      data: {
        titulo,
        posicao: posicao || 0,
        id_usuario: req.user,
      },
    });

    res.status(201).json({mensagem: 'Coluna criada com sucesso', coluna: newColumn, status: 201});
  } catch (err) {
    console.error(err);
    res.status(500).json({ mensagem: 'Erro ao criar coluna', status: 500 });
  }
});

columnRoutes.get('/', checkAuthMiddleware, async (req, res) => {
  try {
    const colunas = await prisma.coluna.findMany({
      where: { id_usuario: req.user },
      include: { tarefas: true },
      orderBy: { posicao: 'asc' },
    });

    res.json({ mensagem: 'Colunas buscadas com sucesso', colunas: colunas, status: 200 });
  } catch (err) {
    console.error(err);
    res.status(500).json({ mensagem: 'Erro ao buscar colunas', status: 500 });
  }
});

columnRoutes.patch('/:id/title', checkAuthMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { titulo } = req.body;

    if (!titulo) {
      return res.status(400).json({ mensagem: 'O título é obrigatório', status: 400 });
    }

    const column = await prisma.coluna.findFirst({
      where: { id: Number(id), id_usuario: req.user },
    });

    if (!column) {
      return res.status(404).json({ mensagem: 'Coluna não encontrada', status: 404 });
    }

    const updatedColumn = await prisma.coluna.update({
      where: { id: column.id },
      data: {
        titulo: titulo ?? column.titulo
    },
    });

    res.json({ mensagem: 'Titulo da coluna atualizada com sucesso', coluna: updatedColumn, status: 200 });
  } catch (err) {
    console.error(err);
    res.status(500).json({ mensagem: 'Erro ao atualizar coluna', status: 500 });
  }
});

columnRoutes.patch('/:id/position', checkAuthMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { posicao } = req.body;

    if (posicao === undefined) {
      return res.status(400).json({ mensagem: 'A posição é obrigatória', status: 400 });
    }

    const column = await prisma.coluna.findFirst({
      where: { id: Number(id), id_usuario: req.user },
    });

    if (!column) {
      return res.status(404).json({ mensagem: 'Coluna não encontrada', status: 404 });
    }

    const updatedColumn = await prisma.coluna.update({
      where: { id: column.id },
      data: {
        posicao,
      },
    });

    res.json({ mensagem: 'Posição da coluna atualizada com sucesso', coluna: updatedColumn, status: 200 });
  } catch (err) {
    console.error(err);
    res.status(500).json({ mensagem: 'Erro ao atualizar posição da coluna', status: 500 });
  }
});

columnRoutes.delete('/:id', checkAuthMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    const coluna = await prisma.coluna.findFirst({
      where: { id: Number(id), id_usuario: req.user },
    });

    if (!coluna) {
      return res.status(404).json({ mensagem: 'Coluna não encontrada', status: 404 });
    }

    await prisma.coluna.delete({ where: { id: coluna.id } });

    res.json({ mensagem: 'Coluna excluída com sucesso', status: 200 });
  } catch (err) {
    console.error(err);
    res.status(500).json({ mensagem: 'Erro ao excluir coluna', status: 500 });
  }
});

export default columnRoutes;
