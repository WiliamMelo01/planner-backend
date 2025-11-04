import { verifyAccessToken } from '../services/jwt-service.js'

export function checkAuthMiddleware(req, res, next) {

    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ mensagem: 'Token de autenticação não fornecido', status: 401 });
    }

    const token = authHeader.split(' ')[1];

    let userId = verifyAccessToken(token);

    if(userId === null){
        return res.status(401).json({ mensagem: 'Token de autenticação inválido ou expirado', status: 401 });
    }   

    req.user = userId;
    next();
}