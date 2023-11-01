import { FirestoreDataConverter } from "firebase-admin/firestore";
import { Mission, MissionMap, MissionProgress } from "../../interfaces/models/Mission.js";

export const missionConverter: FirestoreDataConverter<Mission> = {
    toFirestore(mission) {
        return {
            category: mission.category,
            content: mission.content,
            note: mission.note,
            score: mission.score,
            giverId: mission.giverId,
            targetId: mission.targetId ?? "universal",
            completed: [],
        };
    },
    fromFirestore: function (snapshot) {
        const data = snapshot.data();

        return {
            category: data.category,
            content: data.content,
            note: data.note,
            score: data.score,
            giverId: data.giverId,
            targetId: data.targetId !== "universal" ? data.targetId : null,
            completed: data.completed
        }
    }
}

export const missionMapConverter: FirestoreDataConverter<MissionMap> = {
    toFirestore(missionMap: MissionMap) {
        return {
            data: Object.fromEntries(missionMap.data)
        }
    },
    fromFirestore: function (snapshot) {
        const data = snapshot.data();

        return {
            data: new Map<string, string[]>(Object.entries(data.data))
        }
    }
}

export const missionProgressConverter: FirestoreDataConverter<MissionProgress> = {
    toFirestore(missionProgress) {
        return {
            currentScore: missionProgress.currentScore,
            goalScore: missionProgress.goalScore
        }
    },
    fromFirestore: function (snapshot) {
        const data = snapshot.data();

        return {
            currentScore: data.currentScore,
            goalScore: data.goalScore
        }
    }
}