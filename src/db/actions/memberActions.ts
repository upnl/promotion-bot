import { getQuarterDataString } from "../../commands/utils/getQuarterDataString.js"
import { Regular } from "../../interfaces/models/Member.js"
import { ASSOCIATE, QUARTER, REGULAR } from "../collectionNames.js"
import { associateConverter } from "../converters/associateConverter.js"
import { regularConverter } from "../converters/regularConverter.js"
import { firebaseDb } from "../firebase.js"

export const getRegular = async (id: string) => {
    return await firebaseDb
        .collection(QUARTER).doc(getQuarterDataString())
        .collection(REGULAR).doc(id)
        .withConverter(regularConverter)
        .get().then(snapshot => snapshot.data())
}

export const getAllRegular = async () => {
    return await firebaseDb
        .collection(QUARTER).doc(getQuarterDataString())
        .collection(REGULAR)
        .get().then(snapshot => snapshot.docs.map(s => s.data() as Regular))
}

export const getAssociate = async (id: string) => {
    return await firebaseDb
        .collection(QUARTER).doc(getQuarterDataString())
        .collection(ASSOCIATE).doc(id)
        .withConverter(associateConverter)
        .get().then(snapshot => snapshot.data())
}

export const getAllAssociateIds = async () => {
    return await firebaseDb
        .collection(QUARTER).doc(getQuarterDataString())
        .collection(ASSOCIATE)
        .get().then(snapshot => snapshot.docs.map(s => s.id))
}