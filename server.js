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
  
    let { search, available, page } = req.query
    
   
    const limit = 6
    page = parseInt(page) || 1

    
    const booksSnapshot = await db.collection("books").get()
    const books = booksSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))

    const authorsSnapshot = await db.collection("authors").get()
    const authorsMap = {}
    authorsSnapshot.docs.forEach(doc => {
      authorsMap[doc.id] = {
        id: doc.id,
        ...doc.data()
      }
    })

   
    let booksWithAuthors = books.map(book => ({
      ...book,
      author: authorsMap[book.author_id] || { name: "Auteur inconnu" }
    }))

    
    if (search) {
      const term = search.toLowerCase()
      booksWithAuthors = booksWithAuthors.filter(book => 
        (book.title && book.title.toLowerCase().includes(term)) || 
        (book.author.name && book.author.name.toLowerCase().includes(term))
      )
    }

   
    if (available === 'true') {
      booksWithAuthors = booksWithAuthors.filter(book => book.available !== false)
    } else if (available === 'false') {
      booksWithAuthors = booksWithAuthors.filter(book => book.available === false)
    }

    
    const totalBooks = booksWithAuthors.length
    const totalPages = Math.ceil(totalBooks / limit)

 
    if (page < 1) page = 1
    if (page > totalPages && totalPages > 0) page = totalPages

    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    
   
    const paginatedBooks = booksWithAuthors.slice(startIndex, endIndex)

    
    res.render('index', { 
      books: paginatedBooks,    
      totalBooks: totalBooks,   
      currentPage: page,
      totalPages: totalPages,
      searchParams: { search, available } 
    })

  } catch (error) {
    console.error('Error fetching books:', error)
    res.render('index', { 
      books: [],
      totalBooks: 0,
      currentPage: 1,
      totalPages: 0,
      searchParams: {},
      error: 'Erreur lors du chargement des livres'
    })
  }
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})