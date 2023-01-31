import { useMultiFileAuthState } from "@adiwajshing/baileys"
import BaileysBottle from 'baileys-bottle'
import dotenv from 'dotenv'

dotenv.config()

async function bootstrapDataBase() {
    
    const database = await BaileysBottle.init({
        type: 'postgres',
        database: process.env.DATABASE,
        port: Number(process.env.PORT),
        host: process.env.HOST,
        username: process.env.USERNAME,
        password: process.env.PASSWORD
    })
    
    const {auth, store} = await database.createStore('RenanId')

    return {auth, store}
}

export {
    bootstrapDataBase
}