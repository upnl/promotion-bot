import { makeItalic } from "./markdown.js"

export const createNoteString = (note: string, italic: boolean = false) => {
    if (note === "")
        return ""

    return note.split("\n").map(partialNote => `\n  - ${makeItalic(partialNote, italic)}`).join("")
}