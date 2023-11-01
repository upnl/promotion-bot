import { Mission, MissionMap, MissionUpdateData } from "../../interfaces/models/Mission.js";
import { firebaseDb } from "../firebase.js";
import { MISSION, REGULAR } from "../collectionNames.js";
import { missionConverter, missionMapConverter } from "../converters/missionConverter.js";
import { FieldValue } from "firebase-admin/firestore";

export const getMissionDocRef = async (giverId: string, targetId: string, category: string, index: number, transaction?: FirebaseFirestore.Transaction) => {
    try {
        const missionMapDocRef = firebaseDb
            .collection(REGULAR).doc(giverId)
            .collection(MISSION).doc(targetId)

        const missionMap = transaction === undefined ?
            await missionMapDocRef.withConverter(missionMapConverter).get().then(snapshot => snapshot.data()) :
            await transaction.get(missionMapDocRef.withConverter(missionMapConverter)).then(snapshot => snapshot.data())

        if (missionMap === undefined)
            return null

        const missionIdsInCategory = missionMap.data.get(category)

        if (missionIdsInCategory === undefined || missionIdsInCategory.length <= index)
            return null

        return firebaseDb
            .collection(MISSION).doc(missionIdsInCategory[index])
            .withConverter(missionConverter)
    }
    catch (e) {
        console.error("Error reading document: ", e);

        return
    }
}

export const getMission = async (giverId: string, targetId: string, category: string, index: number) => {
    const missionDocRef = await getMissionDocRef(giverId, targetId, category, index)

    if (missionDocRef === null || missionDocRef === undefined)
        return missionDocRef

    try {
        const mission = await missionDocRef.withConverter(missionConverter)
            .get().then(snapshot => snapshot.data())

        return mission
    }
    catch (e) {
        console.error(e)

        return
    }
}

export const getMissionAll = async (giverId: string, targetId: string): Promise<[Map<string, Mission[]>, Map<string, Mission[]>] | undefined> => {
    try {
        const missionMapSpecific = await firebaseDb
            .collection(REGULAR).doc(giverId)
            .collection(MISSION).doc(targetId)
            .withConverter(missionMapConverter)
            .get().then(snapshot => snapshot.data())

        const missionMapUniversal = await firebaseDb
            .collection(REGULAR).doc(giverId)
            .collection(MISSION).doc(giverId)
            .withConverter(missionMapConverter)
            .get().then(snapshot => snapshot.data())

        const missionMapToMissions = async (missionMap: MissionMap | undefined) => {
            const missions = new Map<string, Mission[]>()

            if (missionMap === undefined)
                return missions

            for (const [category, missionIds] of missionMap.data) {
                const missionsInCategory: Mission[] = []
                missions.set(category, missionsInCategory)

                for (const missionId of missionIds) {
                    const mission = await firebaseDb
                        .collection(MISSION).doc(missionId)
                        .withConverter(missionConverter)
                        .get().then(snapshot => snapshot.data())

                    if (mission === undefined)
                        continue
                    missionsInCategory.push(mission)
                }
            }

            return missions
        }

        return [await missionMapToMissions(missionMapUniversal), await missionMapToMissions(missionMapSpecific)]
    }
    catch (e) {
        console.error(e)

        return
    }
}


export const postMission = async (mission: Mission): Promise<boolean> => {
    const giverId = mission.giverId
    const targetId = mission.targetId

    const missionDocRef = firebaseDb.collection(MISSION).doc()

    const missionMapDocRef = firebaseDb
        .collection(REGULAR).doc(giverId)
        .collection(MISSION).doc(targetId)

    try {
        await firebaseDb.runTransaction(async transaction => {
            const missionMap = await transaction.get(missionMapDocRef.withConverter(missionMapConverter)).then(snapshot => snapshot.data())
            let newData: Map<string, string[]>

            if (missionMap === undefined)
                newData = new Map<string, string[]>([[mission.category, [missionDocRef.id]]])
            else {
                newData = missionMap.data
                const missionsInCategory = newData.get(mission.category)
                if (missionsInCategory === undefined)
                    newData.set(mission.category, [missionDocRef.id])
                else
                    missionsInCategory.push(missionDocRef.id)
            }

            await transaction.set(missionMapDocRef.withConverter(missionMapConverter), {
                data: newData
            })

            await transaction.set(missionDocRef, mission)
        })

        return true;
    } catch (e) {
        console.error("Error adding document: ", e);

        return false;
    }
}

export const patchMission = async (giverId: string, targetId: string, category: string, index: number, missionUpdateData: MissionUpdateData) => {
    const missionDocRef = await getMissionDocRef(giverId, targetId, category, index)

    if (missionDocRef === null || missionDocRef === undefined)
        return missionDocRef

    try {
        missionDocRef.update(missionUpdateData)
        return true
    }
    catch (e) {
        console.error("Error updating document: ", e)

        return
    }
}

export const deleteMission = async (giverId: string, targetId: string, category: string, index: number) => {
    try {
        const result = await firebaseDb.runTransaction(async transaction => {
            const missionIdsDocRef = firebaseDb
                .collection(REGULAR).doc(giverId)
                .collection(MISSION).doc(targetId)
                .withConverter(missionMapConverter)

            const missionMap = await transaction.get(missionIdsDocRef).then(snapshot => snapshot.data())
            if (missionMap === undefined)
                return null

            const missionIdsInCategory = missionMap.data.get(category)
            if (missionIdsInCategory === undefined || missionIdsInCategory.length <= index)
                return null

            const missionDocRef = firebaseDb
                .collection(MISSION).doc(missionIdsInCategory[index])
                .withConverter(missionConverter)

            const newMissionIdsInCategory = missionIdsInCategory.splice(index - 1, 1)
            transaction.update(missionIdsDocRef, { [`data.${category}`]: newMissionIdsInCategory.length > 0 ? newMissionIdsInCategory : FieldValue.delete })
            transaction.delete(missionDocRef)

            return true
        })

        return result
    }
    catch (e) {
        console.error("Error deleting document: ", e);

        return false
    }
}