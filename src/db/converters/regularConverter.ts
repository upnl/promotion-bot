import { FirestoreDataConverter } from "firebase-admin/firestore";
import { Regular } from "../../interfaces/models/Member.js";

export const regularConverter: FirestoreDataConverter<Regular> = {
    toFirestore(regular) {
        return {
            config: regular.config
        };
    },
    fromFirestore: function (snapshot) {
        const data = snapshot.data();

        return {
            config: data.config
        }
    }
}