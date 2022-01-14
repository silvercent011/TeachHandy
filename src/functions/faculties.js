const users = require('./handFunctions')
const StaffController = require('../database/Faculty')

const shared = require('./shared')

//Obtém todos os não estudantes do Microsoft Graph
async function getFaculty(token) {
    const staff = await users.getUsers(token)
    return await staff.filter((staff) => staff.jobtitle !== 'Estudante')
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
        jobtitle:data.jobtitle,
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
    await users.postUsers(token,licence, `/${staff.userPrincipalName}/assignLicense`)
    
    //Atualizando banco de dados original
    const staffToUpdate = {
        cpf: data.cpf,
        email: staff.userPrincipalName,
    }

    await StaffController.updateTeachersEmail(staffToUpdate)

    //Obtendo objetos para adicionar usuários a grupos
    // const userObjects = {"@odata.id":staff["@odata.id"]}
    const userObjects = {"@odata.id":`https://graph.microsoft.com/v1.0/directoryObjects/${staff.id}`}

    //Adicionando a grupo de organização
    await users.postGroups(token, userObjects, `/${process.env.FACULTY_GROUP_ID}/members/$ref`)
    //ADICIONAR APENAS SE HOUVER SSO NA ORGANIZAÇÃO
    //Adicionando a grupo de SSO
    await users.postGroups(token, userObjects, `/${process.env.SSO_FACULTY_GROUP}/members/$ref`)

    //Adicionando usuario na collection de distribuição
    const staffToAdd = {
        _id: data.cpf,
        cpf: data.cpf,
        nome: data.nome,
        senha: process.env.DEFAULT_PASSWORD,
        email: staffData.userPrincipalName,
        jobtitle: staffData.jobtitle,
        created: Date.now(),
        updated: Date.now(),
    }

    await StaffController.pushTeachersToDistribution(staffToAdd)
    
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


//Reseta senhas de estudantes
async function resetFacultyPasswords(token) {
    const facultyToReset = await StaffController.getFacultyToResetPassword()
    const facultyReset = await Promise.all(facultyToReset.map(async (student) => {
        const updateActual = await facultyResetPassword(token, student)
        return updateActual
    }))

    return studentsReset
}

//Redefinição de Senha
async function facultyResetPassword(token, data) {
    const userData = await users.getUser(token, data.email)
    console.log('Hello')
    const newPass = {
        passwordProfile: {
          forceChangePasswordNextSignIn: true,
          password: process.env.DEFAULT_PASSWORD
        }
      };
    const studentReseted = await users.patchUsers(token, newPass, `/${userData.id}`)
    const toUpdate = {
        email: userData.userPrincipalName,
        senha: process.env.DEFAULT_PASSWORD
    }
    console.log(studentReseted)
    const studentOk = StaffController.updateFacultyDistribution(toUpdate)

}

module.exports = {
    getFaculty, postStaffUser, createMissingFaculty, resetFacultyPasswords
}