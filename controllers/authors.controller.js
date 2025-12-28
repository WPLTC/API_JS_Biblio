import { v4 as uuidv4 } from "uuid"
import { authorSchema } from "../schemas/authorSchema.js"
import * as authorModel from "../models/author.model.js"

export async function getAllAuthors(req, res) {
  try {
    const { page = 1, limit = 10 } = req.query
    const offset = (page - 1) * limit

    const allAuthors = await authorModel.findAllAuthors()
    const total = allAuthors.length
    const authors = allAuthors.slice(offset, offset + parseInt(limit))

    res.json({ total, page: parseInt(page), limit: parseInt(limit), authors })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export async function getAuthorById(req, res) {
  try {
    const author = await authorModel.findAuthorById(req.params.id)
    if (!author) return res.status(404).json({ message: "Auteur non trouvé" })
    res.json(author)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export async function createAuthor(req, res) {
  try {
    const validatedData = authorSchema.parse(req.body)
    const id = uuidv4()
    const newAuthor = { ...validatedData, id }
    await authorModel.create(newAuthor)
    res.status(201).json({ message: "Auteur créé", id })
  } catch (err) {
    if (err.name === "ZodError") {
      return res.status(400).json({ message: err.errors ? err.errors : err.message })
    }
    res.status(400).json({ message: err.message })
  }
}

export async function updateAuthor(req, res) {
  try {
    const validatedData = authorSchema.parse(req.body)
    const updatedAuthor = await authorModel.update(req.params.id, validatedData)
    if (!updatedAuthor) return res.status(404).json({ message: "Auteur non trouvé" })
    res.json({ message: "Auteur mis à jour" })
  } catch (err) {
    if (err.name === "ZodError") {
      return res.status(400).json({ message: err.errors ? err.errors : err.message })
    }
    res.status(400).json({ message: err.message })
  }
}

export async function deleteAuthor(req, res) {
  try {
    const deleted = await authorModel.deleteById(req.params.id)
    if (!deleted) return res.status(404).json({ message: "Auteur non trouvé" })
    res.json({ message: "Auteur supprimé" })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

