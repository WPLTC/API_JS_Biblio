import { v4 as uuidv4 } from "uuid"
import { bookSchema } from "../schemas/book.schema.js"
import * as bookModel from "../models/book.model.js"

export async function getAllBooks(req, res) {
  try {
    const { page = 1, limit = 10 } = req.query
    const offset = (page - 1) * limit

    const allBooks = await bookModel.findAllBooks()
    const total = allBooks.length
    const books = allBooks.slice(offset, offset + parseInt(limit))

    res.json({ total, page: parseInt(page), limit: parseInt(limit), books })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export async function getBookById(req, res) {
  try {
    const book = await bookModel.findBookById(req.params.id)
    if (!book) return res.status(404).json({ message: "Livre non trouvé" })
    res.json(book)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export async function createBook(req, res) {
  try {
    const validatedData = bookSchema.parse(req.body)
    const id = uuidv4()
    const newBook = { ...validatedData, id }
    await bookModel.create(newBook)
    res.status(201).json({ message: "Livre créé", id })
  } catch (err) {
    if (err.name === "ZodError") {
      return res.status(400).json({ message: err.errors ? err.errors : err.message })
    }
    res.status(400).json({ message: err.message })
  }
}

export async function updateBook(req, res) {
  try {
    const validatedData = bookSchema.parse(req.body)
    const updatedBook = await bookModel.update(req.params.id, validatedData)
    if (!updatedBook) return res.status(404).json({ message: "Livre non trouvé" })
    res.json({ message: "Livre mis à jour" })
  } catch (err) {
    if (err.name === "ZodError") {
      return res.status(400).json({ message: err.errors ? err.errors : err.message })
    }
    res.status(400).json({ message: err.message })
  }
}

export async function deleteBook(req, res) {
  try {
    const deleted = await bookModel.deleteById(req.params.id)
    if (!deleted) return res.status(404).json({ message: "livre non trouvé" })
    res.json({ message: "livre supprimé" })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

