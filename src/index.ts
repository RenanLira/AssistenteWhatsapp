import makeWASocket, { DisconnectReason, BufferJSON, useMultiFileAuthState, Browsers, makeInMemoryStore, aggregateMessageKeysNotFromMe, proto, AnyMessageContent } from '@adiwajshing/baileys'
import { Boom } from '@hapi/boom'
import * as fs from 'fs'

import dayjs from 'dayjs'
import LocalizedFormat from 'dayjs/plugin/localizedFormat'
import utc from 'dayjs/plugin/utc'
import 'dayjs/locale/pt-br'
import { TimeCalculate } from './timeFunctions/time'


dayjs.locale('pt-br')
dayjs.extend(LocalizedFormat)
dayjs.extend(utc)


async function connectToWhatsApp () {
    const { state, saveCreds } = await useMultiFileAuthState('auth_info_baileys')

    const store = await makeInMemoryStore({ })
    // saves the state to a file every 10s
    setInterval(() => {
        store.writeToFile('./baileys_store.json')
    }, 10_000)
    // can be read from a file
    store.readFromFile('./baileys_store.json')


    const sock = makeWASocket({
        auth: state ,
        printQRInTerminal: true,
        patchMessageBeforeSending: (message) => {
            const requiresPatch = !!(
              message.buttonsMessage
          	  || message.templateMessage
          		|| message.listMessage
            );
            if (requiresPatch) {
                message = {
                    viewOnceMessage: {
                        message: {
                            messageContextInfo: {
                                deviceListMetadataVersion: 2,
                                deviceListMetadata: {},
                            },
                            ...message,
                        },
                    },
                };
            }
            return message;
},


    })

    store.bind(sock.ev)

    sock.ev.on('messages.upsert', async (arg) => {
        
        const message = arg.messages[0]
        const horario = new TimeCalculate()

        if (!message.key.fromMe) {
            const id = message.key.remoteJid!
            console.log(id)

            const templateButtonMsg: proto.IHydratedTemplateButton[] = [
                {index: 1, urlButton: {displayText: 'Meu gitHub', url: 'https://github.com/RenanLira'}}
            ]

            const templateMsg: AnyMessageContent = {
                text: horario.VerificarDisponibilidade(),
                footer: `${dayjs().utcOffset(-3)}`,
                templateButtons: templateButtonMsg,
                viewOnce: true
            }
                

            await sock.sendMessage(id, templateMsg)

            
        }


    })

    sock.ev.on('connection.update', async (update) => {
        const { connection, lastDisconnect } = update
        if(connection === 'close') {
            const shouldReconnect = (lastDisconnect!.error as Boom)?.output?.statusCode !== DisconnectReason.loggedOut
            console.log('connection closed due to ', lastDisconnect!.error, ', reconnecting ', shouldReconnect)
            // reconnect if not logged out
            if(shouldReconnect) {
                connectToWhatsApp()
            }
        } else if(connection === 'open') {
            await sock.sendPresenceUpdate('unavailable')
            console.log('opened connection')
        }
    })

    sock.ev.on('creds.update', saveCreds)


    sock.ev.on('call', async (arg) => {

        if ( arg[0].status == 'ringing') {
            await sock.rejectCall(arg[0].id, arg[0].from)

        }

        if (arg[0].status == 'reject') {

            await sock.sendMessage(arg[0].from, {text: "Olá, não posso atender agora"})
        }


    })




    
}
// run in main file
connectToWhatsApp()