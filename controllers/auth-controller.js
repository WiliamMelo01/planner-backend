import {  Router } from "express";
import { PrismaClient } from "../generated/prisma/client.js";
import bcrypt from 'bcrypt';
import { generateAccessToken } from "../services/jwt-service.js";

const prisma = new PrismaClient();

const SALT_ROUNDS = 10;

let authRoutes = Router();

authRoutes.post("/signin", async (req, res) => {

    const { email, senha, nome } = req.body;

    if (!email || !senha || !nome) {
        return res.status(400).json({ mensagem: "Email, nome, e senha são obrigatorios", status: 400 });
    }

    const userAlreadyExists = await prisma.usuario.findUnique({
        where: { email }
    });

    if (userAlreadyExists) {
        return res.status(409).json({ mensagem: "Email já cadastrado", status: 409 });
    }

    let hashedPassword = await bcrypt.hash(senha, SALT_ROUNDS);

    const newUser = await prisma.usuario.create({
        data: {
            email,
            nome,
            senha: hashedPassword,
            data_criacao: new Date(),
        },
    });

    await prisma.coluna.createMany({
        data: [
            { titulo: "todo", posicao: 0, id_usuario: newUser.id },
            { titulo: "progress", posicao: 1, id_usuario: newUser.id },
            { titulo: "completed", posicao: 2, id_usuario: newUser.id },
        ],
    });

    let jwt = generateAccessToken(newUser);

    return res.status(201).json({ mensagem: "Usuário registrado com sucesso", token: jwt , status: 201});

});

authRoutes.post("/login", async (req, res) => {

    const { email, senha } = req.body;

    if (!email || !senha) {
        return res.status(400).json({ mensagem: "Email e senha são obrigatorios", status: 400 });
    }

    const user = await prisma.usuario.findUnique({
        where: { email }
    });

    if (!user) {
        return res.status(404).json({ mensagem: "Usuário não encontrado", status: 404 });
    }   

    const passwordMatch = await bcrypt.compare(senha, user.senha);

    if (!passwordMatch) {
        return res.status(401).json({ mensagem: "Senha incorreta", status: 401 });
    }

    let jwt = generateAccessToken(user);
    
    return res.status(200).json({ mensagem: "Login realizado com sucesso", token: jwt , status: 200});
});

export default authRoutes;