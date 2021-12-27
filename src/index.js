//Require Functions
const auth = require('./auth')
const students = require('./functions/students')
const faculties = require('./functions/faculties')
const mongoose = require("mongoose")

//Load credentials from dotenv
require('dotenv').config()
const msalConfig = {
    clientId: process.env.CLIENT_ID,
    authority: `https://login.microsoftonline.com/${process.env.TENANT_ID}`,
    clientSecret: process.env.CLIENT_SECRET
}

//main function
async function main() {
    const token = await auth.requireToken(msalConfig).then((data) => data.accessToken)

    if (process.env.STUDENTS_START == 'true') {
        console.log("Starting Students")
        const Students = await students.createMissingStudents(token)
        console.log(Students)
        const resetStudents = await students.resetStudentsPasswords(token)
        console.log(resetStudents)
    }
    if (process.env.FACULTY_START == 'true') {
        console.log("Starting Faculty")
        const Faculty = await faculties.createMissingFaculty(token)
        console.log(Faculty)
        const resetFaculty = await faculties.createMissingFaculty(token)
        console.log(resetFaculty)
    }
    console.log("END")

    process.exit()
}

//MongoDB Connection
mongoose.connect(process.env.MONGO_STRING, { useNewUrlParser: true, useUnifiedTopology: true })
main()