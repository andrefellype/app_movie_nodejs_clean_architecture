export default class ConvertData {
    public static getDateObject() {
        let dateNow = new Date()
        let year = dateNow.getFullYear()
        let month: any = dateNow.getMonth() + 1
        month = (month >= 1 && month <= 9) ? `0${month}` : month
        let day: any = dateNow.getDate() + 1
        day = (day >= 1 && day <= 9) ? `0${day}` : day
        let hour: any = dateNow.getHours()
        hour = (hour >= 1 && hour <= 9) ? `0${hour}` : hour
        let minutes: any = dateNow.getMinutes()
        minutes = (minutes >= 1 && minutes <= 9) ? `0${minutes}` : minutes
        let seconds: any = dateNow.getSeconds()
        seconds = (seconds >= 1 && seconds <= 9) ? `0${seconds}` : seconds
        return {
            year: year,
            month: month,
            day: day,
            hour: hour,
            minutes: minutes,
            seconds: seconds
        }
    }

    public static getDateNowStr(): string {
        let dateNow = new Date()
        let year = dateNow.getFullYear()
        let month: any = dateNow.getMonth() + 1
        month = (month >= 1 && month <= 9) ? `0${month}` : month
        let day: any = dateNow.getDate()
        day = (day >= 1 && day <= 9) ? `0${day}` : day
        let hour: any = dateNow.getHours()
        hour = (hour >= 0 && hour <= 9) ? `0${hour}` : hour
        let minutes: any = dateNow.getMinutes()
        minutes = (minutes >= 0 && minutes <= 9) ? `0${minutes}` : minutes
        let seconds: any = dateNow.getSeconds()
        seconds = (seconds >= 0 && seconds <= 9) ? `0${seconds}` : seconds
        return `${year}-${month}-${day} ${hour}:${minutes}:${seconds}`
    }
}