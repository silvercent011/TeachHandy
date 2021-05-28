const auth = require('./auth')
const students = require('./functions/students')
const mongoose = require("mongoose")
require('dotenv').config()
const msalConfig = {
    clientId: process.env.CLIENT_ID,
    authority: `https://login.microsoftonline.com/${process.env.TENANT_ID}`,
    clientSecret: process.env.CLIENT_SECRET
}
async function main(){
    const token = await auth.requireToken(msalConfig).then((data)=> data.accessToken)

    const Students = await students.createMissingStudents(token)
    console.log(Students)
}

mongoose.connect(process.env.MONGO_STRING, {useNewUrlParser: true, useUnifiedTopology: true})
main()