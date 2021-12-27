const mongoose = require('mongoose')
const Professor = require('../models/Professor')
const Distribution = require('../models/DistributionFaculty')

async function getTeachers() {
    const faculty = await Professor.find({})
    return faculty
}

async function getTeachersNoEmail() {
    const faculty = await Professor.find({email:null})
    return faculty
}

async function updateTeachersEmail(data) {
    const professor = await Professor.findOneAndUpdate({cpf:data.cpf}, {email:data.email})
}

async function updateFacultyDistribution(data) {
    const professor = await Distribution.findOneAndUpdate({email:data.email}, {senha:data.senha, updated: Date.now(), reset_password: false})
}

async function pushTeachersToDistribution(data){
    const distributionAdd = await Distribution.create(data)
    return distributionAdd
}

async function getFacultyToResetPassword() {
    const faculty = await Distribution.find({reset_password:true})
    return faculty
}



module.exports = {
    getTeachers,
    getTeachersNoEmail,
    updateTeachersEmail,
    pushTeachersToDistribution,
    updateFacultyDistribution,
    getFacultyToResetPassword
}