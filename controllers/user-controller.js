import { Router } from 'express';
import { PrismaClient } from '../generated/prisma/client.js';
import { checkAuthMiddleware } from '../middlewares/check-auth.js';

const userRoutes = Router();
const prisma = new PrismaClient();

userRoutes.get('/', async (req, res) => {
  try {
    const users = await prisma.usuario.findMany({
      select: {
        id: true,
        nome: true,
        email: true,
        data_criacao: true,
      },
    });
    res.status(200).json({ mensagem: 'Usuários buscados com sucesso', usuarios: users, status: 200 });
  } catch (err) {
    console.error(err);
    res.status(500).json({ mensagem: 'Erro ao buscar usuários', status: 500 });
  }
});

userRoutes.get('/me', checkAuthMiddleware, async (req, res) => {
  let id = req.user;
  console.log(id);
  
  try {
    const user = await prisma.usuario.findUnique({
      where: { id: Number(id) },
      select: {
        id: true,
        nome: true,
        email: true,
        data_criacao: true,
      }
    });

    if (!user)
      return res.status(404).json({ mensagem: 'Usuário não encontrado', status: 404 });

    return res.status(200).json({ mensagem: 'Usuário buscado com sucesso', usuario: user, status: 200 });
  } catch (err) {
    console.error(err);
    res.status(500).json({ mensagem: 'Erro ao buscar usuário', status: 500 });
  }
});

userRoutes.put('/', checkAuthMiddleware, async (req, res) => {
  let id = req.user;
  const data = req.body;

  try {
    const user = await prisma.usuario.update({
      where: { id: Number(id) },
      data,
      select: {
        id: true,
        nome: true,
        email: true,
        data_criacao: true,
      }
    });
    res.status(200).json({ mensagem: 'Usuário atualizado com sucesso', usuario: user, status: 200 });
  } catch (err) {
    console.error(err);
    if (err.code === 'P2025') {
      return res.status(404).json({ mensagem: 'Usuário não encontrado', status: 404 });
    }
    res.status(500).json({ mensagem: 'Erro ao atualizar usuário', status: 500 });
  }
});

userRoutes.delete('/', checkAuthMiddleware, async (req, res) => {
  let id = req.user;

  try {
    await prisma.usuario.delete({
      where: { id: Number(id) },
    });
    res.status(200).json({ mensagem: 'Usuário deletado com sucesso', status: 200 });
  } catch (err) {
    console.error(err);
    if (err.code === 'P2025') {
      return res.status(404).json({ mensagem: 'Usuário não encontrado', status: 404 });
    }
    res.status(500).json({ mensagem: 'Erro ao deletar usuário', status: 500 });
  }
});

export default userRoutes;
