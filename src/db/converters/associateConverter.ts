import { FirestoreDataConverter } from "firebase-admin/firestore";
import { Associate } from "../../interfaces/models/Member.js";

export const associateConverter: FirestoreDataConverter<Associate> = {
    toFirestore(associate) {
        return {
        };
    },
    fromFirestore: function (snapshot) {
        const data = snapshot.data();

        return {
        }
    }
}