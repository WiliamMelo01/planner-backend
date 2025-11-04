import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in environment variables");
}

export function generateAccessToken(usuario){
    return jwt.sign({ id: usuario.id, email: usuario.email }, JWT_SECRET, { expiresIn: '1h', algorithm: 'HS256' ,  issuer: 'planner-app', });
}

export function verifyAccessToken(token){
    try {
        return jwt.verify(token, JWT_SECRET, { algorithms: ['HS256'], issuer: 'planner-app' }).id;
    } catch (err) {
        return null;
    }
}