import { ConfigTemplateMessages } from "./utils/types"



const defaulOperatingHours = {
    start: 9,
    end: 18,
    pause: [[12.3, 13.3]]
}

export const operatingHours = {
    // days of week
    //Sunday (domingo)
    '0': null,
    // Monday
    '1': defaulOperatingHours,
    // Tuesday
    '2': defaulOperatingHours,
    // Wednesday
    '3': defaulOperatingHours,
    // Thursday
    '4': defaulOperatingHours,
    // Friday
    '5': defaulOperatingHours,
    // Saturday
    '6': {
        start: 9,
        end: 17,
        pause: [[12, 13]]
    },

}

export const TimeIntervalBetweenEachMessage: number = 1

export const isClient = (name: string) : boolean => true //name.search('TC') != -1


export const templatesMessages = () => (
    {
        unavaliableMessage: 'Olá, não estou disponivel no momento',
    }

)
