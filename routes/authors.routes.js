import express from "express"
import { authMiddleware } from "../middlewares/auth.middleware.js"
import * as authorsController from "../controllers/authors.controller.js"

const router = express.Router()

router.get("/", authorsController.getAllAuthors)
router.get("/:id", authorsController.getAuthorById)
router.post("/", authMiddleware, authorsController.createAuthor)
router.put("/:id", authMiddleware, authorsController.updateAuthor)
router.delete("/:id", authMiddleware, authorsController.deleteAuthor)

export default router
