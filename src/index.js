//Require Functions
const auth = require('./auth')
const students = require('./functions/students')
const mongoose = require("mongoose")

//Load credentials from dotenv
require('dotenv').config()
const msalConfig = {
    clientId: process.env.CLIENT_ID,
    authority: `https://login.microsoftonline.com/${process.env.TENANT_ID}`,
    clientSecret: process.env.CLIENT_SECRET
}

//main function
async function main(){
    const token = await auth.requireToken(msalConfig).then((data)=> data.accessToken)

    const Students = await students.createMissingStudents(token)
    console.log(Students)

}

//MongoDB Connection
mongoose.connect(process.env.MONGO_STRING, {useNewUrlParser: true, useUnifiedTopology: true})
main()