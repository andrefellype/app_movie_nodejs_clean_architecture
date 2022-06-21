export default class ValidatorData {
    public static validateCnpj(cnpj: String): boolean {
        cnpj = cnpj.replace(/[^\d]+/g, '')
        if (cnpj == '') {
            return false
        }

        if (cnpj.length != 14) {
            return false
        }

        if (cnpj == "00000000000000" || cnpj == "11111111111111" || cnpj == "22222222222222" || cnpj == "33333333333333" ||
            cnpj == "44444444444444" || cnpj == "55555555555555" || cnpj == "66666666666666" || cnpj == "77777777777777" ||
            cnpj == "88888888888888" || cnpj == "99999999999999") {
            return false
        }

        let tamanho = cnpj.length - 2
        let numeros = cnpj.substring(0, tamanho)
        let digitos = cnpj.substring(tamanho)
        let soma = 0
        let pos = tamanho - 7
        for (let i = tamanho; i >= 1; i--) {
            soma += parseFloat(numeros.charAt(tamanho - i)) * pos--
            if (pos < 2) {
                pos = 9
            }
        }
        let resultado = soma % 11 < 2 ? 0 : 11 - soma % 11
        if (resultado != parseFloat(digitos.charAt(0))) {
            return false
        }

        tamanho = tamanho + 1
        numeros = cnpj.substring(0, tamanho)
        soma = 0
        pos = tamanho - 7
        for (let i = tamanho; i >= 1; i--) {
            soma += parseFloat(numeros.charAt(tamanho - i)) * pos--
            if (pos < 2) {
                pos = 9
            }
        }
        resultado = soma % 11 < 2 ? 0 : 11 - soma % 11
        if (resultado != parseFloat(digitos.charAt(1))) {
            return false
        }
        return true
    }

    public static validateCpf(cpfValue: string): boolean {
        let cpf = cpfValue.replace(/[^\d]+/g, '')
        if (cpf == '')
            return false
        if (cpf.length != 11 || cpf == "00000000000" || cpf == "11111111111" || cpf == "22222222222" ||
            cpf == "33333333333" || cpf == "44444444444" || cpf == "55555555555" || cpf == "66666666666" ||
            cpf == "77777777777" || cpf == "88888888888" || cpf == "99999999999")
            return false
        let add = 0
        for (let i = 0; i < 9; i++)
            add += parseInt(cpf.charAt(i)) * (10 - i)
        let rev = 11 - (add % 11)
        if (rev == 10 || rev == 11)
            rev = 0
        if (rev != parseInt(cpf.charAt(9)))
            return false
        add = 0
        for (let i = 0; i < 10; i++)
            add += parseInt(cpf.charAt(i)) * (11 - i)
        rev = 11 - (add % 11)
        if (rev == 10 || rev == 11)
            rev = 0
        if (rev != parseInt(cpf.charAt(10)))
            return false
        return true
    }

    public static validateLeapYear(year: number): boolean {
        if ((year % 4) == 0 && (year % 100) != 0)
            return true
        if ((year % 4) == 0 && (year % 100) == 0 && (year % 400) == 0)
            return true
        return false
    }

    public static validateDateEUA(dateValue: string): boolean {
        const year = dateValue.substring(0, 4)
        const month = dateValue.substring(5, 7)
        const day = dateValue.substring(8, 10)
        if (parseInt(year) < 1900 || parseInt(year) > 2050)
            return false
        if (parseInt(month) < 1 || parseInt(month) > 12)
            return false
        if ((parseInt(month) == 1 || parseInt(month) == 3 || parseInt(month) == 5 || parseInt(month) == 7 ||
            parseInt(month) == 8 || parseInt(month) == 10 || parseInt(month) == 12) && (parseInt(day) < 1 || parseInt(day) > 31))
            return false
        if ((parseInt(month) == 4 || parseInt(month) == 6 || parseInt(month) == 9 || parseInt(month) == 11) && (parseInt(day) < 1 || parseInt(day) > 30))
            return false
        if (parseInt(month) == 2) {
            const daysMonth = this.validateLeapYear(parseInt(year)) ? 29 : 28
            return (parseInt(day) >= 1 && parseInt(day) <= daysMonth)
        }
        return true
    }

    public static validateAgeMin(dateValue: string, ageMin: number) {
        const dateAge = new Date()
        dateAge.setFullYear((dateAge.getFullYear() - ageMin))

        const dateActual = new Date(`${dateValue} 00:00:00`)

        if (dateActual.getFullYear() > dateAge.getFullYear()) {
            return false
        }
        if (dateActual.getFullYear() == dateAge.getFullYear() && dateActual.getMonth() > dateAge.getMonth())
            return false
        if (dateActual.getFullYear() == dateAge.getFullYear() && dateActual.getMonth() == dateAge.getMonth() &&
            dateActual.getDay() > dateAge.getDay())
            return false

        return true
    }
}