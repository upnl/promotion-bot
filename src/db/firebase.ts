import { initializeApp, cert } from "firebase-admin/app"
import serviceAccount from "./serviceAccountKey.json" assert { type: "json" }
import { getFirestore } from "firebase-admin/firestore"

initializeApp({
    credential: cert({
        projectId: serviceAccount.project_id,
        clientEmail: serviceAccount.client_email,
        privateKey: serviceAccount.private_key
    })
})

export const firebaseDb = getFirestore()