import express from "express"
import { authMiddleware } from "../middlewares/auth.middleware.js"
import * as booksController from "../controllers/books.controller.js"

const router = express.Router()

router.get("/", booksController.getAllBooks)
router.get("/:id", booksController.getBookById)
router.post("/", authMiddleware, booksController.createBook)
router.put("/:id", authMiddleware, booksController.updateBook)
router.delete("/:id", authMiddleware, booksController.deleteBook)

export default router
