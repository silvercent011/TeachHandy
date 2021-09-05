const mongoose = require('mongoose')
const Professor = require('../models/Professor')
const Distribution = require('../models/DistributionFaculty')

async function getTeachers() {
    const students = await Professor.find({})
    return students
}

async function getTeachersNoEmail() {
    const students = await Professor.find({email:null})
    return students
}

async function updateTeachersEmail(data) {
    const professor = await Professor.findOneAndUpdate({cpf:data.cpf}, {email:data.email})
}

async function pushTeachersToDistribution(data){
    const distributionAdd = await Distribution.create(data)
    return distributionAdd
}

module.exports = {
    getTeachers,
    getTeachersNoEmail,
    updateTeachersEmail,
    pushTeachersToDistribution,
}