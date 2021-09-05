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
        jobTitle:'Estudante',
        userPrincipalName: `${data.matricula}@${process.env.DOMAIN}`,
        usageLocation: 'BR',
        passwordProfile: {
            forceChangePasswordNextSignIn: process.env.FORCE_CHANGE_PASSWORD,
            password: process.env.DEFAULT_PASSWORD
        }
    }

    const students = await users.postUsers(token,studentData)

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
    const licences = await users.postUsers(token,licence, `/${students.userPrincipalName}/assignLicense`)
    
    //Atualizando banco de dados original
    const alunoToUpdate = {
        matricula: data.matricula,
        email: `${data.matricula}@${process.env.DOMAIN}`,
    }

    const updated = await AlunosController.updateStudentsEmail(alunoToUpdate)

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

    const distributed = await AlunosController.pushStudentsToDistribution(alunoToAdd)
    
    return students
}

//Função ponto de partida para a criação de alunos que estão sem conta
async function createMissingStudents(token) {
    //STUDENTS
    const studentsNoEmail = await AlunosController.getStudentsNoEmail()
    const studentsPost = await Promise.all(studentsNoEmail.map(async (student) => {
        const studentToPost = await postStudents(token, student)
        return studentToPost
    }))

    return studentsPost
}

module.exports = {
    getStudents, postStudents, createMissingStudents
}