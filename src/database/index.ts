import { useMultiFileAuthState } from "@adiwajshing/baileys"
import BaileysBottle from 'baileys-bottle'

async function bootstrapDataBase() {
    
    const database = await BaileysBottle.init({
        type: 'postgres',
        database: "assistente",
        port: 5431,
        host: 'localhost',
        username: 'postgres',
        password: 'postgres'
    })
    
    const {auth, store} = await database.createStore('RenanId')

    return {auth, store}
}

export {
    bootstrapDataBase
}