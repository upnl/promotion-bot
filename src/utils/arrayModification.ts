export const applyArrayOperation = <ItemType>(itemArray: ItemType[] | null, arrayOperations: ((itemArr: ItemType[]) => ItemType[])[]) =>
    arrayOperations.reduce((prev, operation) => operation(prev), itemArray !== null ? itemArray : [])

export const insertItem = <ItemType>(index: number, item: ItemType) =>
    (missionIds: ItemType[]) => {
        missionIds.splice(index, 0, item)

        return missionIds
    }

export const removeItem = <ItemType>(index: number) =>
    (missionIds: ItemType[]) => {
        missionIds.splice(index, 1)
        return missionIds
    }