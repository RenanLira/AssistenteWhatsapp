import makeWASocket, { MessageUpsertType, proto } from "@adiwajshing/baileys";


export type socket = ReturnType<typeof makeWASocket>

export interface MessageArg {
    messages: proto.IWebMessageInfo[],
    type: MessageUpsertType,
}

export interface ConfigTemplateMessages {

    text: string

}

export type tm = () => object