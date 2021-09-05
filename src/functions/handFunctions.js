const api = require("./api")

async function getUsers(token){
    const uri = `${process.env.GRAPH_ENDPOINT}v1.0/users`
    return await api.Get(uri,token)
}

async function getGroups(token){
    const uri = `${process.env.GRAPH_ENDPOINT}v1.0/groups`
    return await api.Get(uri,token)
}

async function postUsers(token, data, addUri = '') {
    const uri = `${process.env.GRAPH_ENDPOINT}v1.0/users${addUri}`
    return await api.Post(uri, token,data)
}

async function postGroups(token, data, addUri = '') {
    const uri = `${process.env.GRAPH_ENDPOINT}v1.0/groups${addUri}`
    return await api.Post(uri, token,data)
}

async function updateUsers(token){
}

module.exports = {
    getUsers, postUsers, updateUsers, getGroups, postGroups
}