import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
dayjs.extend(utc)



export class TimeCalculate {

    private time;
    private default = {
        start: 9,
        end: 18,
        pause: [[12.3, 13.3]]
    }

    private horariosDisponiveis = {
        [1 - 0]: this.default,
        '2': this.default,
        '3': this.default,
        '4': this.default,
        '5': this.default,
        '6': {
            start: 9,
            end: 17,
            pause: [[12, 13]]
        },
        '0': {
            start: 0,
            end: 0,
            pause: []
        },
    
    }
    constructor(timestamp: number) {
        this.time = dayjs(timestamp * 1000).utcOffset(-3)
    }


    disponibilidade = () => {
        const agora = this.getHoursAndMinutes()

        const day = this.getDayWeek()


        if (this.horariosDisponiveis[day].start >= agora || this.horariosDisponiveis[day].end <= agora ){
            
            return false
            
        }
        
        if (this.horariosDisponiveis[day].pause.find((v, i) => agora > v[0] && agora < v[1])) {

            return false
        }

        return true
    }

    diferencaTimeResposta = (timepassado: number ) => {

        console.log(dayjs(timepassado).utcOffset(-3))

        const oldTime = this.getHoursAndMinutes(dayjs(timepassado * 1000).utcOffset(-3))



        return Number((this.getHoursAndMinutes() - oldTime).toFixed(2))


    }

    getHoursAndMinutes = (oldtime?: dayjs.Dayjs) => {
        let hour = oldtime?.hour() || this.time.hour()
        let minutes = oldtime?.minute()! / 100 || this.time.minute() / 100


        return hour + minutes
    
    
    }
    
    getDayWeek = () => {
    
        return this.time.day()


    
    }

}
