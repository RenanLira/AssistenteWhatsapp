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


    })


    return sock


}

export const bootstrap = bootstrapDataBase().then(async ({auth, store}) => {
    const sock = await connectToWhatsApp(auth, store)

    container.registerInstance('Store', store)
    container.registerInstance('Sock', sock)
})
