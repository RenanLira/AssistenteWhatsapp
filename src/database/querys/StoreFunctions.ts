import StoreHandle from "baileys-bottle/lib/bottle/StoreHandle";
import { inject, injectable, singleton } from "tsyringe";


@singleton()
export class StoreFunctions {

    constructor(
        @inject('Store')
        private store: StoreHandle

    ){}

    getAllMsgs = async (remoteJid: string) => {

        const msgs = await this.store.messages.all(remoteJid)

        return msgs

    }

    getMsgTargetById = async (remoteJid: string, templateMessage: string) => {

        const msgs = await this.getAllMsgs(remoteJid)

        const targetMsg = msgs?.sort((a,b) => b.id - a.id).find((v, i) => v.message?.extendedTextMessage?.text == templateMessage)


        return targetMsg

    }

}