import { db } from "../firebase.js"

const booksDb = db.collection("books")

export async function findAllBooks() {
  try {
    const snapshot = await booksDb.get()
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
  } catch (error) {
    throw new Error("eerreur lors de la récupération des livres")
  }
}

export async function findBookById(id) {
  try {
    const doc = await booksDb.doc(id).get()
    if (!doc.exists) {
      return null
    }
    return { id: doc.id, ...doc.data() }
  } catch (error) {
    throw new Error("erreur lors de la récupération du livre")
  }
}

export async function create(book) {
  try {
    const createdAt = new Date()
    const updatedAt = new Date()
    await booksDb.doc(book.id).set({
      ...book,
      created_at: createdAt,
      updated_at: updatedAt
    })
    return { id: book.id, ...book, created_at: createdAt, updated_at: updatedAt }
  } catch (error) {
    throw new Error("erreur lors de la creation du livre")
  }
}

export async function update(id, bookData) {
  try {
    const docRef = booksDb.doc(id)
    const doc = await docRef.get()
    if (!doc.exists) {
      return null
    }
    const updatedAt = new Date()
    await docRef.update({ ...bookData, updated_at: updatedAt })
    return { id, ...bookData, updated_at: updatedAt }
  } catch (error) {
    throw new Error("erreur lors de la mise a jour du livre")
  }
}

export async function deleteById(id) {
  try {
    const docRef = booksDb.doc(id)
    const doc = await docRef.get()
    if (!doc.exists) {
      return null
    }
    await docRef.delete()
    return true
  } catch (error) {
    throw new Error("erreur lors de la suppression du livre")
  }
}

