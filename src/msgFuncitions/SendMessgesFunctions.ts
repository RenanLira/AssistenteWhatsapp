import makeWASocket, { AnyMessageContent, BaileysEventEmitter, MessageUpsertType, proto } from "@adiwajshing/baileys"
import { socket } from "../utils"

import { TimeCalculate } from '../timeFunctions/time'


interface argMessage {
    
    messages: proto.IWebMessageInfo[];
    type: MessageUpsertType;

}

export class SendMessages {


    constructor(
        private sock: socket,
        private msg?: AnyMessageContent){}

    
    sendMessageClientUnavailable = async (arg: argMessage) => {

        let id = arg.messages[0].key.remoteJid!
        if (this.criteriosOk(arg)) {
            await this.sock.sendMessage(id, {text: 'Olá não estou disponivel no momento, respondo assim que possivel'})

        }

    }


    private criteriosOk = (arg: argMessage) => {

        const time = new TimeCalculate(Number(arg.messages[0].messageTimestamp!))

        if (arg.type == 'append') return false

        if (arg.messages[0].key.participant) return false

        if (arg.messages[0].key.fromMe) return false

        // if (!arg.messages[0].pushName?.search('Renan')) return false

        if (!time.disponibilidade()) return false

        return true


    }






}

