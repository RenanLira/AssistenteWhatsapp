import makeWASocket, { AnyMessageContent, BaileysEventEmitter, MessageUpsertType, proto } from "@adiwajshing/baileys"
import { autoInjectable, inject } from "tsyringe"
import { templatesMessages } from "../../configAssistent"
import { MessageArg, socket } from "../../utils/types"

import { TimeCalculate } from '../timeFunctions/time'


@autoInjectable()
export class SendMessages {

    constructor(
        private remoteJid: string,
        @inject('Sock')
        private sock?: socket,
    ){}


    sendClientMessageUnavaliable = async () => {

        await this.sock!.sendMessage(this.remoteJid, {text: templatesMessages().unavaliableMessage})

    }

    sendSeenMsg = async (keys: proto.IMessageKey[]) => {

        await this.sock!.readMessages(keys)
    }


}

