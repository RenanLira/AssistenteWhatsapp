import dayjs from 'dayjs'
import LocalizedFormat from 'dayjs/plugin/localizedFormat'
import utc from 'dayjs/plugin/utc'
import 'dayjs/locale/pt-br'


// const horario = {
//     default: {
//         start: 9,
//         end: 18,
//         pause: [[12, 30], [13, 30]]
//     },
//     6: {
//         start: 9,
//         end: 17,
//         pause: [[12,0], [13,0]]
//     },
//     0: {
//         undefined
//     }

// }


export class TimeCalculate {

    private time = dayjs().utcOffset(-3)
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


    VerificarDisponibilidade = () => {
        const agora = this.getHoursAndMinutes()

        const day = this.getDayWeek()

        console.log(day, this.horariosDisponiveis[2], agora)

        if (this.horariosDisponiveis[day].start > agora && this.horariosDisponiveis[day].end < agora ){
            
            return 'disponivel'
            
        }
        
        if (this.horariosDisponiveis[day].pause.filter((v, i) => agora < v[0] && agora > v[1])) {

            return 'disponivel'
        }

        return 'indisponivel'
    }

    getHoursAndMinutes = () => {
        
        let hour = this.time.hour()
        let minutes = this.time.minute() / 100


        return hour + minutes
    
    
    }
    
    getDayWeek = () => {
    
        return this.time.day()


    
    }

}
