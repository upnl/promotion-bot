import { APIActionRowComponent, APIMessageActionRowComponent, ActionRowData, JSONEncodable, MessageActionRowComponent, MessageActionRowComponentData } from "discord.js";

export type ReplyComponents = JSONEncodable<APIActionRowComponent<APIMessageActionRowComponent>>
    | ActionRowData<MessageActionRowComponentData | MessageActionRowComponent>
    | APIActionRowComponent<APIMessageActionRowComponent>
