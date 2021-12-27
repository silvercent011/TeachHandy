const mongoose = require('mongoose')
const Aluno = require('../models/Aluno')
const Distribution = require('../models/DistributionStudent')

async function getStudents() {
    const students = await Aluno.find({})
    return students
}

async function getStudentsNoEmail() {
    const students = await Aluno.find({email:null})
    return students
}

async function updateStudentsEmail(data) {
    const aluno = await Aluno.findOneAndUpdate({matricula:data.matricula}, {email:data.email})
}

async function updateStudentsDistribution(data) {
    const aluno = await Distribution.findOneAndUpdate({email:data.email}, {senha:data.senha, updated: Date.now(), reset_password: false})
}

async function pushStudentsToDistribution(data){
    const distributionAdd = await Distribution.create(data)
    return distributionAdd
}


async function getStudentsToResetPassword() {
    const students = await Distribution.find({reset_password:true})
    return students
}

module.exports = {
    getStudents,
    getStudentsNoEmail,
    updateStudentsEmail,
    pushStudentsToDistribution,
    updateStudentsDistribution,
    getStudentsToResetPassword
}