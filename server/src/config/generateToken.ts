import jwt from "jsonwebtoken"

const generateToken = (id: string) => {
    return jwt.sign({ id }, (process.env.JWT_SECRET as string) || "default_secret", { expiresIn: "1h" })
}

export default generateToken