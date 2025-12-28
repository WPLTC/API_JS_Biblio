import { db } from "../firebase.js"

const authorsDb = db.collection("authors")

export async function findAllAuthors() {
  try {
    const snapshot = await authorsDb.get()
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
  } catch (error) {
    throw new Error("Erreur lors de la récupération des auteurs")
  }
}

export async function findAuthorById(id) {
  try {
    const doc = await authorsDb.doc(id).get()
    if (!doc.exists) {
      return null
    }
    return { id: doc.id, ...doc.data() }
  } catch (error) {
    throw new Error("Erreur lors de la récupération de l'auteur")
  }
}

export async function create(author) {
  try {
    const createdAt = new Date()
    const updatedAt = new Date()
    await authorsDb.doc(author.id).set({
      ...author,
      created_at: createdAt,
      updated_at: updatedAt
    })
    return { id: author.id, ...author, created_at: createdAt, updated_at: updatedAt }
  } catch (error) {
    throw new Error("Erreur lors de la création de l'auteur")
  }
}

export async function update(id, authorData) {
  try {
    const docRef = authorsDb.doc(id)
    const doc = await docRef.get()
    if (!doc.exists) {
      return null
    }
    const updatedAt = new Date()
    await docRef.update({ ...authorData, updated_at: updatedAt })
    return { id, ...authorData, updated_at: updatedAt }
  } catch (error) {
    throw new Error("Erreur lors de la mise à jour de l'auteur")
  }
}

export async function deleteById(id) {
  try {
    const docRef = authorsDb.doc(id)
    const doc = await docRef.get()
    if (!doc.exists) {
      return null
    }
    await docRef.delete()
    return true
  } catch (error) {
    throw new Error("erreur lors de la suppression de l auteur")
  }
}

