const unidecode = require('unidecode')

//Coloca todos os nomes do array com primeira letra maiúscula
//Retorna String normalizada um padrão ASCII
async function uppercaseFirst(nome) {
    return await nome.split(' ').map((name) => {
        return unidecode(name.charAt(0).toUpperCase() + name.slice(1).toLowerCase())
    })
}

//Divide o nome de forma correta em dois campos
async function balanceName(name) {
    const nameSplit = await uppercaseFirst(name)

    let finalName = {
        name: null,
        surname: null
    }
    let middle = await Math.floor(nameSplit.length/2)
    let nameArray = await nameSplit.slice(0, middle)
    let surnameArray = await nameSplit.slice(middle, nameSplit.length)

    finalName.name = await nameArray.join(' ')
    finalName.surname = await surnameArray.join(' ')

    return finalName
}

async function firstAndLastName(nome) {
    const nameSplit = await nome.map((name) => {
        return unidecode(name.toLowerCase())
    })

    let nameArray = []

    nameArray.push(nameSplit[0])
    nameArray.push(nameSplit[nameSplit.length - 1])

    let name = nameArray.join('.')

    return name
}

module.exports = {
    uppercaseFirst, balanceName, firstAndLastName
}