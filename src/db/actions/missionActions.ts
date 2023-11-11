import { Mission, MissionMap, MissionUpdateData } from "../../interfaces/models/Mission.js";
import { firebaseDb } from "../firebase.js";
import { ASSOCIATE, MISSION, MISSION_PROGRESS, QUARTER, REGULAR } from "../collectionNames.js";
import { missionConverter, missionMapConverter, missionProgressConverter } from "../converters/missionConverter.js";
import { FieldValue, Transaction } from "firebase-admin/firestore";
import { getQuarterDataString } from "../../commands/utils/quarterData/getQuarterData.js";
import { associateConverter } from "../converters/associateConverter.js";

export const getMissionDocRef = async (giverId: string, targetId: string, category: string, index: number, transaction?: FirebaseFirestore.Transaction) => {
    try {
        const missionMapDocRef = firebaseDb
            .collection(QUARTER).doc(await getQuarterDataString())
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
            .collection(QUARTER).doc(await getQuarterDataString())
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
            .collection(QUARTER).doc(await getQuarterDataString())
            .collection(REGULAR).doc(giverId)
            .collection(MISSION).doc(targetId)
            .withConverter(missionMapConverter)
            .get().then(snapshot => snapshot.data())

        const missionMapUniversal = await firebaseDb
            .collection(QUARTER).doc(await getQuarterDataString())
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
                        .collection(QUARTER).doc(await getQuarterDataString())
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

    const missionDocRef = firebaseDb
        .collection(QUARTER).doc(await getQuarterDataString())
        .collection(MISSION).doc()

    const missionMapDocRef = firebaseDb
        .collection(QUARTER).doc(await getQuarterDataString())
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

export const updateMissionScore = async (mission: Mission, newScore: number, transaction?: Transaction) => {
    if (newScore === mission.score)
        return true;

    try {
        for (const associate of mission.completed) {
            const missionProgressDocRef = firebaseDb
                .collection(QUARTER).doc(await getQuarterDataString())
                .collection(ASSOCIATE).doc(associate)
                .collection(MISSION_PROGRESS).doc(mission.giverId)
                .withConverter(missionProgressConverter)

            if (transaction !== undefined)
                await transaction.update(missionProgressDocRef, { currentScore: FieldValue.increment(newScore - mission.score) })
            else
                await missionProgressDocRef.update({ currentScore: FieldValue.increment(newScore - mission.score) })
        }

        return true
    }
    catch (e) {
        return false
    }
}

export const patchMission = async (giverId: string, targetId: string, category: string, index: number, missionUpdateData: MissionUpdateData) => {
    try {
        const result = await firebaseDb.runTransaction(async transaction => {
            const missionDocRef = await getMissionDocRef(giverId, targetId, category, index, transaction)

            if (missionDocRef === null || missionDocRef === undefined)
                return missionDocRef

            const mission = await transaction.get(missionDocRef).then(snapshot => snapshot.data())
            if (mission === undefined)
                return mission

            if (missionUpdateData.score !== undefined)
                await updateMissionScore(mission, missionUpdateData.score, transaction)
            missionDocRef.update(missionUpdateData)

            return true
        })

        return result
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
                .collection(QUARTER).doc(await getQuarterDataString())
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
                .collection(QUARTER).doc(await getQuarterDataString())
                .collection(MISSION).doc(missionIdsInCategory[index])
                .withConverter(missionConverter)

            const mission = await transaction.get(missionDocRef).then(snapshot => snapshot.data())
            if (mission === undefined)
                return mission

            missionIdsInCategory.splice(index, 1)
            
            await updateMissionScore(mission, 0, transaction)
            transaction.update(missionIdsDocRef, {
                [`data.${category}`]: missionIdsInCategory.length > 0 ? missionIdsInCategory : FieldValue.delete()
            })
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