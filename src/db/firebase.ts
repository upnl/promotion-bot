import { initializeApp, cert } from "firebase-admin/app"
import { getFirestore } from "firebase-admin/firestore"

initializeApp({
    credential: cert({
        projectId: process.env.PROJECT_ID,
        clientEmail: process.env.CLIENT_EMAIL,
        privateKey: process.env.PRIVATE_KEY
    })
})

export const firebaseDb = getFirestore()