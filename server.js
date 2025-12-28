import dotenv from 'dotenv'
dotenv.config()

import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import cookieParser from "cookie-parser"


import authRoutes from './routes/auth.routes.js'
import booksRoutes from './routes/books.routes.js'
import authorsRoutes from './routes/authors.routes.js'
import { db } from './firebase.js'

const app = express()


app.use(express.json())
app.use(cors())
app.use(helmet())
app.use(morgan('dev'))
app.use(cookieParser())


app.set('view engine', 'ejs')
app.set('views', './views')


app.use('/api/auth', authRoutes)
app.use('/api/books', booksRoutes)
app.use('/api/authors', authorsRoutes)


app.get('/', async (req, res) => {
  try {
    // Récupérer tous les livres
    const booksSnapshot = await db.collection("books").get()
    const books = booksSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))

    // Récupérer tous les auteurs pour les joindre aux livres
    const authorsSnapshot = await db.collection("authors").get()
    const authorsMap = {}
    authorsSnapshot.docs.forEach(doc => {
      authorsMap[doc.id] = {
        id: doc.id,
        ...doc.data()
      }
    })

    // Joindre les informations des auteurs aux livres
    const booksWithAuthors = books.map(book => ({
      ...book,
      author: authorsMap[book.author_id] || { name: "Auteur inconnu" }
    }))

    res.render('index', { 
      books: booksWithAuthors,
      totalBooks: booksWithAuthors.length
    })
  } catch (error) {
    console.error('Error fetching books:', error)
    res.render('index', { 
      books: [],
      totalBooks: 0,
      error: 'Erreur lors du chargement des livres'
    })
  }
})


const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
