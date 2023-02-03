import { container, inject } from "tsyringe";
import { SendMessages } from "../application/msgFuncitions/SendMessgesFunctions";
import { TimeCalculate } from "../application/timeFunctions/time";
import { isClient, templatesMessages } from "../configAssistent";
import { StoreFunctions } from "../database/querys/StoreFunctions";
import { handleTimestamp } from "../utils/handleTimestamp";
import { MessageArg } from "../utils/types";




export class ReceivedMessagesController {
    
    constructor(
        private msgReceivedInfo: MessageArg,
        private storeQuerys: StoreFunctions
        ){}
        
        
    private typeReceivedMsg = async () => {

        const msg = this.msgReceivedInfo.messages[0]

        if (msg.key.fromMe) return this.fromMeExecuteMsg()
        
        if (msg.key.participant) return this.groupExecuteMsg()

        if (isClient(msg.pushName!)) return this.clientExecuteMsg()
        
        
    }
    
    private async clientExecuteMsg() {

        console.log('mensagem cliente')
        const id = this.msgReceivedInfo.messages[0].key.remoteJid!
        const time = new TimeCalculate(handleTimestamp(this.msgReceivedInfo.messages[0].messageTimestamp!))
        
        const msgTarget = await this.storeQuerys.getMsgTargetById(id, templatesMessages().unavaliableMessage)
        const resultCompare = time.compareTimeBetweenMsgs(handleTimestamp(msgTarget?.messageTimestamp!))

        const sendmsg = new SendMessages(id)

        if (!time.disponibilidade() && resultCompare) {
            await sendmsg.sendClientMessageUnavaliable()
            await sendmsg.sendSeenMsg([this.msgReceivedInfo.messages[0].key])

        }
        
        if (!time.disponibilidade() && !resultCompare) {
            await sendmsg.sendSeenMsg([this.msgReceivedInfo.messages[0].key])
        }


    }

    private async groupExecuteMsg() {

        return null
    }

    private fromMeExecuteMsg = async () => {

        return null
    }


    execute = async () => {

        await this.typeReceivedMsg()

    }
    





}