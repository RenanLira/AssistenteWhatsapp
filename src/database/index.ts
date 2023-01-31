import { useMultiFileAuthState } from "@adiwajshing/baileys"
import BaileysBottle from 'baileys-bottle'
import dotenv from 'dotenv'
import path from 'path'

dotenv.config({path: path.join(__dirname, '..', '..', '.env') })

console.log(process.env.PORT)

async function bootstrapDataBase() {
    
    const database = await BaileysBottle.init({
        type: 'postgres',
        url: process.env.DATABASE_URL,
        database: process.env.DATABASE,
        port: Number(process.env.PORT),
        host: process.env.HOST,
        username: process.env.USERNAME_DATABASE,
        password: process.env.PASSWORD
    })
    
    const {auth, store} = await database.createStore('RenanId')

    return {auth, store}
}

export {
    bootstrapDataBase
}