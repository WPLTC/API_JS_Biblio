import { db } from "../firebase.js"

const usersDb = db.collection("users")

export async function findUserByEmail(email) {
  try {
    const snapshot = await usersDb.where("email", "==", email).limit(1).get()
    if (snapshot.empty) {
      return null
    }
    const doc = snapshot.docs[0]
    return { id: doc.id, ...doc.data() }
  } catch (error) {
    throw new Error("Erreur lors de la récupération de l'utilisateur par email")
  }
}

export async function create(user) {
  try {
    const createdAt = new Date()
    const userResponse = await usersDb.doc(user.id).set({ ...user, created_at: createdAt })
    return { id: user.id, ...user, created_at: createdAt }
  } catch (error) {
    throw new Error("Erreur lors de la création de l'utilisateur")
  }
}

