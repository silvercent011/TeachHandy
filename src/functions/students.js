const users = require('./handFunctions')
const AlunosController = require('../database/Student')

const shared = require('./shared')

//Obtém todos os estudantes do Microsoft Graph
async function getStudents(token) {
    const students = await users.getUsers(token)
    return await students.filter((student) => student.jobTitle === 'Estudante')
}

//Cria novos estudantes
async function postStudents(token, data) {
    //Criando usuário
    const splittedName = await shared.balanceName(data.nome)
    const dispName = await shared.uppercaseFirst(data.nome)
    const studentData = {
        accountEnabled: true,
        displayName: dispName.join(' '),
        givenName: splittedName.name,
        surname: splittedName.surname,
        mailNickname: data.matricula,
        jobtitle: 'Estudante',
        userPrincipalName: `${data.matricula}@${process.env.DOMAIN}`,
        usageLocation: 'BR',
        passwordProfile: {
            forceChangePasswordNextSignIn: process.env.FORCE_CHANGE_PASSWORD,
            password: process.env.DEFAULT_PASSWORD
        }
    }

    const students = await users.postUsers(token, studentData)

    //Atribuindo licencas
    const licence =
    {
        "addLicenses": [
            {
                "disabledPlans": [],
                "skuId": process.env.STUDENT_SKUID
            }
        ],
        "removeLicenses": []
    }
    await users.postUsers(token, licence, `/${students.userPrincipalName}/assignLicense`)

    //Atualizando banco de dados original
    const alunoToUpdate = {
        matricula: data.matricula,
        email: `${data.matricula}@${process.env.DOMAIN}`,
    }

    await AlunosController.updateStudentsEmail(alunoToUpdate)

    //Obtendo objetos para adicionar usuários a grupos
    // const userObjects = {"@odata.id":students["@odata.id"]}
    const userObjects = { "@odata.id": `https://graph.microsoft.com/v1.0/directoryObjects/${students.id}` }

    //Adicionando a grupo de organização
    await users.postGroups(token, userObjects, `/${process.env.STUDENT_GROUP_ID}/members/$ref`)
    //ADICIONAR APENAS SE HOUVER SSO NA ORGANIZAÇÃO
    //Adicionando a grupo de SSO
    await users.postGroups(token, userObjects, `/${process.env.SSO_STUDENT_GROUP}/members/$ref`)


    //Adicionando aluno na collection de distribuição
    const alunoToAdd = {
        _id: data.matricula,
        matricula: data.matricula,
        nome: data.nome,
        senha: process.env.DEFAULT_PASSWORD,
        email: `${data.matricula}@${process.env.DOMAIN}`,
        jobtitle: studentData.jobTitle,
        created: Date.now(),
        updated: Date.now(),
    }

    await AlunosController.pushStudentsToDistribution(alunoToAdd)

    return students
}

//Função ponto de partida para a criação de alunos que estão sem conta
async function createMissingStudents(token) {
    //STUDENTS
    const studentsNoEmail = await AlunosController.getStudentsNoEmail()
    const studentsPost = await Promise.all(studentsNoEmail.map(async (student) => {
        // Verifica se aluno está habilitado antes de criar as contas
        if (student.enabled === true) {
            const studentToPost = await postStudents(token, student)
            return studentToPost
        } else {
            return null
        }
    }))

    return studentsPost
}

//Reseta senhas de estudantes
async function resetStudentsPasswords(token) {
    const studentsToReset = await AlunosController.getStudentsToResetPassword()
    const studentsReset = await Promise.all(studentsToReset.map(async (student) => {
        const updateActual = await studentResetPassword(token, student)
        return updateActual
    }))

    return studentsReset
}

//Redefinição de Senha
async function studentResetPassword(token, data) {
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
    const studentOk = AlunosController.updateStudentsDistribution(toUpdate)

}

module.exports = {
    getStudents, postStudents, createMissingStudents, resetStudentsPasswords
}