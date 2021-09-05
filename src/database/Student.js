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

async function pushStudentsToDistribution(data){
    const distributionAdd = await Distribution.create(data)
    return distributionAdd
}

module.exports = {
    getStudents,
    getStudentsNoEmail,
    updateStudentsEmail,
    pushStudentsToDistribution,
}