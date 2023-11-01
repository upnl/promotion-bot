export interface Mission {
    category: string;
    content: string;
    note: string;
    score: number;
    giverId: string;
    targetId: string;
    completed: string[];
}

export interface MissionMap {
    data: Map<string, string[]>;
}

export interface MissionProgress {
    currentScore: number;
    goalScore: number;
}

export interface MissionUpdateData {
    content?: string;
    note?: string;
    score?: number;
}