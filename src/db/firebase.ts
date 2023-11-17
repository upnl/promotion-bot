import { initializeApp, cert } from "firebase-admin/app"
import { getFirestore } from "firebase-admin/firestore"

initializeApp({
    credential: cert({
        projectId: process.env.PROMOTIONBOT_PROJECT_ID,
        clientEmail: process.env.PROMOTIONBOT_TOKEN,
        privateKey: process.env.PROMOTIONBOT_PRIVATE_KEY
    })
})

export const firebaseDb = getFirestore()