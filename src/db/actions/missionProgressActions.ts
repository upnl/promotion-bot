import { Client } from "discord.js"
import { ASSOCIATE, MISSION_PROGRESS } from "../collectionNames.js"
import { firebaseDb } from "../firebase.js"
import { missionProgressConverter } from "../converters/missionConverter.js"
import assert from "assert"

export const getMissionProgress = async (giverId: string, targetId: string) => {
    try {
        const missionProgress = await firebaseDb
            .collection(ASSOCIATE).doc(targetId)
            .collection(MISSION_PROGRESS).doc(giverId)
            .withConverter(missionProgressConverter)
            .get().then(doc => doc.data())

        assert(missionProgress !== undefined)

        return {
            giverId,
            currentScore: missionProgress.currentScore,
            goalScore: missionProgress.goalScore
        }
    }
    catch (e) {
        console.error(e)

        return
    }
}

export const getMissionProgressAll = async (client: Client, targetId: string) => {
    try {
        const progressDocs = await firebaseDb
            .collection(ASSOCIATE).doc(targetId)
            .collection(MISSION_PROGRESS)
            .withConverter(missionProgressConverter)
            .get().then(qsnapshot => qsnapshot.docs)

        assert(progressDocs !== undefined)

        const progresses = []

        for (const progressDoc of progressDocs) {
            const giverName = await client.users.fetch(progressDoc.id).then(user => user.displayName)
            const { currentScore, goalScore } = progressDoc.data()
            progresses.push({ giverName, currentScore, goalScore })
        }

        return progresses
    }
    catch (e) {
        console.error(e)

        return
    }
}