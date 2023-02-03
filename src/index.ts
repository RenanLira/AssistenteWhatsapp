import makeWASocket, { DisconnectReason, BufferJSON, useMultiFileAuthState, Browsers, makeInMemoryStore, aggregateMessageKeysNotFromMe, proto, AnyMessageContent } from '@adiwajshing/baileys'

import { Boom } from '@hapi/boom'
import * as fs from 'fs'



import { init } from './sock'
import { bootstrapDataBase } from './database'
import AuthHandle from 'baileys-bottle/lib/bottle/AuthHandle'
import StoreHandle from 'baileys-bottle/lib/bottle/StoreHandle'
import { SendMessages } from './application/msgFuncitions/SendMessgesFunctions'
import { TimeCalculate } from './application/timeFunctions/time'

import { ReceivedMessagesController } from './controllers/ReceivedMessagesController'


import "reflect-metadata";
import { container } from 'tsyringe'
import { StoreFunctions } from './database/querys/StoreFunctions'


async function connectToWhatsApp (auth: AuthHandle, store: StoreHandle) {
    

    const {state, saveState} = await auth.useAuthHandle()

    const sock = await init(state)


    store.bind(sock.ev)

    


    sock.ev.on('connection.update', async (update) => {
        const { connection, lastDisconnect } = update
        if(connection === 'close') {
            const shouldReconnect = (lastDisconnect!.error as Boom)?.output?.statusCode !== DisconnectReason.loggedOut
            console.log('connection closed due to ', lastDisconnect!.error, ', reconnecting ', shouldReconnect)
            // reconnect if not logged out
            if(shouldReconnect) {
                connectToWhatsApp(auth, store)
            }
        } else if(connection === 'open') {
            await sock.sendPresenceUpdate('unavailable')
            console.log('opened connection')
        }
    })

    sock.ev.on('creds.update', saveState)

    sock.ev.on('messages.upsert', async (arg) => {
        
        if (arg.type == 'append') return ''
        const storeFunction = container.resolve(StoreFunctions)

        const msgController = new ReceivedMessagesController(arg, storeFunction)
        await msgController.execute()

        // const msgs =  await store.messages.all(arg.messages[0].key.remoteJid!)
        // const msgAlvo = msgs?.sort((a,b) => b.id - a.id).find((v, i) => {
        //    return v.message?.extendedTextMessage?.text == 'Olá não estou disponivel no momento, respondo assim que possivel'
        // })

        // const sendMessage = new SendMessages(sock,)
        // if (!msgAlvo) {

        //     await sendMessage.sendMessageClientUnavailable(arg)

            
        // }
        // const time = new TimeCalculate(Number(arg.messages[0].messageTimestamp))

        // let oldtimestamp = 0
        // if (typeof msgAlvo?.messageTimestamp === 'object') {
        //     oldtimestamp = msgAlvo?.messageTimestamp?.low!
        // }

        // const diferenca = time.diferencaTimeResposta(oldtimestamp)

        
        // if (!time.disponibilidade()) {
        //     if (diferenca < 0 || diferenca >= 1) {
        //         await sendMessage.sendMessageClientUnavailable(arg)
        //         return await sock.sendPresenceUpdate('available', arg.messages[0].key.remoteJid!)
        //     }

        // }

        // await sock.sendPresenceUpdate('unavailable', arg.messages[0].key.remoteJid!)


    })


    return sock


}

export const bootstrap = bootstrapDataBase().then(async ({auth, store}) => {
    const sock = await connectToWhatsApp(auth, store)

    container.registerInstance('Store', store)
    container.registerInstance('Sock', sock)
})
