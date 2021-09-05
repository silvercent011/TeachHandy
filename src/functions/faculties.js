const users = require('./handFunctions')
const StaffController = require('../database/Faculty')

const shared = require('./shared')

//Obtém todos os não estudantes do Microsoft Graph
async function getFaculty(token) {
    const staff = await users.getUsers(token)
    return await staff.filter((staff) => staff.jobTitle !== 'Estudante')
}

//Cria novos usuários
async function postStaffUser(token, data) {
    //Criando usuário
    const splittedName = await shared.balanceName(data.nome)
    const dispName = await shared.uppercaseFirst(data.nome)
    const nickName = await shared.firstAndLastName(dispName)
    console.log(nickName)
    const staffData = {
        accountEnabled: true,
        displayName: dispName.join(' '),
        givenName: splittedName.name,
        surname: splittedName.surname,
        mailNickname: nickName,
        jobTitle:data.jobtitle,
        userPrincipalName: `${nickName}@${process.env.DOMAIN}`,
        usageLocation: 'BR',
        passwordProfile: {
            forceChangePasswordNextSignIn: process.env.FORCE_CHANGE_PASSWORD,
            password: process.env.DEFAULT_PASSWORD
        }
    }

    const staff = await users.postUsers(token,staffData)

    //Atribuindo licencas
    const licence = 
        {
            "addLicenses": [
              {
                "disabledPlans": [],
                "skuId": process.env.FACULTY_SKUID
              }
            ],
            "removeLicenses": []
    }
    const licences = await users.postUsers(token,licence, `/${staff.userPrincipalName}/assignLicense`)
    
    //Atualizando banco de dados original
    const staffToUpdate = {
        cpf: data.cpf,
        email: staff.userPrincipalName,
    }

    const updated = await StaffController.updateTeachersEmail(staffToUpdate)

    //Obtendo objetos para adicionar usuários a grupos
    const userObjects = {"@odata.id":staff["@odata.id"]}

    //Adicionando a grupo de organização
    // const orgGroup = await users.postGroups(token, userObjects, `/${process.env.FACULTY_GROUP_ID}/members/$ref`)
    //ADICIONAR APENAS SE HOUVER SSO NA ORGANIZAÇÃO
    //Adicionando a grupo de SSO
    // const ssoGroup = await users.postGroups(token, userObjects, `/${process.env.SSO_FACULTY_GROUP}/members/$ref`)

    //Adicionando usuario na collection de distribuição
    const staffToAdd = {
        _id: data.cpf,
        cpf: data.cpf,
        nome: data.nome,
        senha: process.env.DEFAULT_PASSWORD,
        email: staffData.userPrincipalName,
        jobtitle: staffData.jobTitle,
        created: Date.now(),
        updated: Date.now(),
    }

    const distributed = await StaffController.pushTeachersToDistribution(staffToAdd)
    
    return staff
}

//Função ponto de partida para a criação de funcionarios que estão sem conta
async function createMissingFaculty(token) {
    //STUDENTS
    const facultyNoEmail = await StaffController.getTeachersNoEmail()
    const facultyPost = await Promise.all(facultyNoEmail.map(async (userFaculty) => {
        const facultyToPost = await postStaffUser(token, userFaculty)
        return facultyToPost
    }))

    return facultyPost
}

module.exports = {
    getFaculty, postStaffUser, createMissingFaculty
}