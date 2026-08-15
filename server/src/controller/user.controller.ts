import {Request, Response, NextFunction} from "express"
import User from "../model/user.model.js"
import createHttpError from "http-errors"
import bcrypt from "bcrypt"
import generateToken from "../config/generateToken.js"


export const RegisterUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        console.log('Register request body:', req.body)
        const {username, email, password} = req.body
        if (!username || !email || !password) {
            return next(createHttpError(400, "Please provide username, email, and password"))
        }
        const [emailExists, usernameExists] = await Promise.all([
      User.findOne({ email }).lean(),
      User.findOne({ username }).lean(),
    ])

    if (emailExists) {
      return next(createHttpError(400, "Email already exists"))
    }

    if (usernameExists) {
      return next(createHttpError(400, "Username already exists"))
    }

    const salt = await bcrypt.genSalt(10)
    const hashedPasswordWithSalt = await bcrypt.hash(password, salt)

    const user = await User.create({ username, email, password: hashedPasswordWithSalt })
   

    const accessToken = generateToken(user._id.toString())
    return res.status(201).json({ user, accessToken, message: "User registered successfully",success: true })
  } catch (error) {
    return next(createHttpError(500, "Error occurred while checking user existence"))
  }
}
export const LoginUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, password } = req.body
        if (!email || !password) {
            return next(createHttpError(400, "Please provide email and password"))
        }
        const user = await User.findOne({ email }).select("+password")
        if (!user) {
            return next(createHttpError(404, "Invalid email or password"))
        }
        const isPasswordValid = await bcrypt.compare(password, user.password)
        if (!isPasswordValid) {
            return next(createHttpError(404, "Invalid email or password"))
        }
        const accessToken = generateToken(user._id.toString())
        res.status(200).json({ user, accessToken, message: "User logged in successfully", success: true })
    } catch (error) {
        return next(createHttpError(500, "Error occurred while logging in"))
    }
}

export const GetUserProfile = async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id
    console.log("User ID from token:", userId)

    try {
        const user = await User.findById(userId).lean()
        if (!user) {
            return next(createHttpError(404, "User not found"))
        }
        res.status(200).json({ user, message: "User profile fetched successfully", success: true })
    } catch (error) {
        return next(createHttpError(500, "Error occurred while fetching user profile"))
    }
}