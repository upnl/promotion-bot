import { FieldValue, Transaction } from "firebase-admin/firestore";
import { getQuarterDataString } from "../../commands/utils/quarterData/getQuarterData.js";
import { Mission, MissionMap } from "../../interfaces/models/Mission.js";
import { ASSOCIATE, MISSION, MISSION_PROGRESS, QUARTER, REGULAR } from "../collectionNames.js";
import { missionConverter, missionMapConverter, missionProgressConverter } from "../converters/missionConverter.js";
import { firebaseDb } from "../firebase.js";
import { applyArrayOperation, insertItem, removeItem } from "../../utils/arrayModification.js";

const getMissionIdsInCategory = (missionMap: MissionMap | undefined, category: string) => {
    if (missionMap === undefined)
        return null

    const missionIdsInCategory = missionMap.data.get(category)
    if (missionIdsInCategory === undefined)
        return null

    return missionIdsInCategory
}

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

        const missionDocRef = firebaseDb
            .collection(QUARTER).doc(await getQuarterDataString())
            .collection(MISSION).doc(missionIdsInCategory[index])
            .withConverter(missionConverter)

        return { missionMapDocRef, missionMap, missionIdsInCategory, missionDocRef }
    }
    catch (e) {
        console.error("Error reading document: ", e);

        return
    }
}

export const getMission = async (giverId: string, targetId: string, category: string, index: number, transaction?: FirebaseFirestore.Transaction) => {
    try {
        const getMissionDocRefResult = await getMissionDocRef(giverId, targetId, category, index, transaction)
        if (getMissionDocRefResult === undefined || getMissionDocRefResult === null)
            return getMissionDocRefResult

        const { missionMapDocRef, missionMap, missionIdsInCategory, missionDocRef } = getMissionDocRefResult

        const mission = transaction === undefined ?
            await missionDocRef.withConverter(missionConverter).get().then(snapshot => snapshot.data()) :
            await transaction.get(missionDocRef.withConverter(missionConverter)).then(snapshot => snapshot.data())
        if (mission === undefined)
            return null

        return { missionMapDocRef, missionMap, missionIdsInCategory, missionDocRef, mission }
    }
    catch (e) {
        console.error("Error reading document: ", e);

        return
    }
}

export const getMissionCount = async (giverId: string, targetId: string) => {
    try {
        const missionMap = await firebaseDb
            .collection(QUARTER).doc(await getQuarterDataString())
            .collection(REGULAR).doc(giverId)
            .collection(MISSION).doc(targetId)
            .withConverter(missionMapConverter)
            .get().then(snapshot => snapshot.data())

        if (missionMap === undefined)
            return 0
        else
            return [...missionMap.data.values()].reduce((prev, curr) => prev + curr.length, 0)
    }
    catch (e) {
        console.error(e)

        return
    }
}

export const getMissionAll = async (giverId: string, targetId: string) => {
    try {
        const missionMap = await firebaseDb
            .collection(QUARTER).doc(await getQuarterDataString())
            .collection(REGULAR).doc(giverId)
            .collection(MISSION).doc(targetId)
            .withConverter(missionMapConverter)
            .get().then(snapshot => snapshot.data())

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
    catch (e) {
        console.error(e)

        return
    }
}

export const postMission = async (index: number, mission: Mission): Promise<boolean> => {
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
        const result = await firebaseDb.runTransaction(async transaction => {
            const missionMap = await transaction.get(missionMapDocRef.withConverter(missionMapConverter)).then(snapshot => snapshot.data())
            const missionIdsInCategory = getMissionIdsInCategory(missionMap, mission.category)
            const newMissionIdsInCategory = applyArrayOperation(missionIdsInCategory, [insertItem(index, missionDocRef.id)])

            if (missionMap === undefined)
                transaction.set(missionMapDocRef, { data: { [`${mission.category}`]: newMissionIdsInCategory } })
            else
                transaction.update(missionMapDocRef, { [`data.${mission.category}`]: newMissionIdsInCategory })
            transaction.set(missionDocRef, mission)

            return true
        })

        return result;
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
                transaction.update(missionProgressDocRef, { currentScore: FieldValue.increment(newScore - mission.score) })
            else
                missionProgressDocRef.update({ currentScore: FieldValue.increment(newScore - mission.score) })
        }

        return true
    }
    catch (e) {
        return false
    }
}

export const patchMission = async (giverId: string, targetId: string, category: string, index: number, indexNew: number, missionNew: Mission) => {
    try {
        const result = await firebaseDb.runTransaction(async transaction => {
            const getMissionResult = await getMission(giverId, targetId, category, index, transaction)
            if (getMissionResult === null || getMissionResult === undefined)
                return getMissionResult

            const { missionMapDocRef, missionMap, missionDocRef, mission, missionIdsInCategory: missionIdsInOldCategory } = getMissionResult

            if (mission.category !== missionNew.category) {
                const missionIdsInNewCategory = getMissionIdsInCategory(missionMap, missionNew.category)

                transaction.update(missionMapDocRef, {
                    [`data.${missionNew.category}`]: applyArrayOperation(missionIdsInNewCategory, [insertItem(indexNew, missionDocRef.id)]),
                    [`data.${mission.category}`]: applyArrayOperation(missionIdsInOldCategory, [removeItem(index)])
                })
            }
            else if (indexNew !== index)
                transaction.update(missionMapDocRef, {
                    [`data.${mission.category}`]: applyArrayOperation(missionIdsInOldCategory, [
                        removeItem(index), insertItem(indexNew, missionDocRef.id)
                    ])
                })

            if (missionNew.score !== mission.score)
                await updateMissionScore(mission, missionNew.score, transaction)
            transaction.update(missionDocRef, missionNew)

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
            const getMissionResult = await getMission(giverId, targetId, category, index, transaction)
            if (getMissionResult === null || getMissionResult === undefined)
                return getMissionResult

            const { missionMapDocRef, missionIdsInCategory, missionDocRef, mission } = getMissionResult

            const newMissionIdsInCategory = applyArrayOperation(missionIdsInCategory, [removeItem(index)])

            await updateMissionScore(mission, 0, transaction)
            transaction.update(missionMapDocRef, {
                [`data.${category}`]: newMissionIdsInCategory.length > 0 ? newMissionIdsInCategory : FieldValue.delete()
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