import jwt from "jsonwebtoken"
import createHttpError from "http-errors"
import { Request, Response, NextFunction } from "express"

interface AuthUser{
    id: string
}

declare global {
    namespace Express {
        interface Request {
            user?: AuthUser
        }
    }
}

const verifyToken = (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(' ')[1]
    console.log (token)
    if (!token) {
        return next(createHttpError(401, "Access denied. No token provided."))
    }

    jwt.verify(token, process.env.JWT_SECRET as string, (err, decoded) => {
        if (err) {
            return next(createHttpError(403, "Invalid token."))
        }
        req.user = decoded as AuthUser
        next()
    })
}

export default verifyToken