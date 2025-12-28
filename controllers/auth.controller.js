import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import dotenv from "dotenv"
import { v4 as uuidv4 } from "uuid"
import { registerSchema, loginSchema } from "../schemas/user.schema.js"
import * as userModel from "../models/user.model.js"

dotenv.config()

export async function register(req, res) {
  try {
    
    const validatedData = registerSchema.parse(req.body)
    const { email, password } = validatedData

   
    const existingUser = await userModel.findUserByEmail(email)
    if (existingUser) return res.status(400).json({ error: "Email déjà utilisé" })

    const hashedPassword = await bcrypt.hash(password, 10)
    const newUser = { id: uuidv4(), email, password: hashedPassword }
    const createdUser = await userModel.create(newUser)

    res.status(201).json({ message: "Utilisateur créé", userId: createdUser.id })
  } catch (error) {
    if (error.name === "ZodError") {
      return res.status(400).json({ 
        error: "donnée invalide", 
        details: error.issues.map(err => ({
          field: err.path.join('.'),
          message: err.message
        }))
      })
    }
    res.status(500).json({ error: error.message })
  }
}

export async function login(req, res) {
  try {
   
    const validatedData = loginSchema.parse(req.body)
    const { email, password } = validatedData

    const user = await userModel.findUserByEmail(email)
    if (!user) return res.status(404).json({ error: "utilisateur not found" })

    const passwordIsOk = await bcrypt.compare(password, user.password)
    if (!passwordIsOk) return res.status(401).json({ message: "invalid credentials" })

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.SECRET_ACCESS_TOKEN,
      { expiresIn: "1m" }
    )

    const refreshToken = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.SECRET_REFRESH_TOKEN,
      { expiresIn: "30m" }
    )

    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      secure: false, 
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000
    })

    res.json({ token })
  } catch (error) {
    if (error.name === "ZodError") {
      return res.status(400).json({ 
        error: "données invalide", 
        details: error.errors.map(err => ({ field: err.path.join('.'), message: err.message }))
      })
    }
    res.status(500).json({ error: error.message })
  }
}

export function refresh(req, res) {
  const refreshToken = req.cookies?.jwt
  if (!refreshToken) return res.sendStatus(401)

  jwt.verify(refreshToken, process.env.SECRET_REFRESH_TOKEN, (err, decoded) => {
    if (err) return res.sendStatus(401)

    const newToken = jwt.sign(
      { userId: decoded.userId, email: decoded.email },
      process.env.SECRET_ACCESS_TOKEN,
      { expiresIn: "1m" }
    )

    const newRefreshToken = jwt.sign(
      { userId: decoded.userId, email: decoded.email },
      process.env.SECRET_REFRESH_TOKEN,
      { expiresIn: "30m" }
    )

    res.cookie("jwt", newRefreshToken, {
      httpOnly: true,
      secure: false, 
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000
    })

    res.json({ token: newToken })
  })
}
