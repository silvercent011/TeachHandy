const api = require("./api")
const axios = require('axios')
async function getUsers(token) {
    const uri = `${process.env.GRAPH_ENDPOINT}v1.0/users`
    return await api.Get(uri, token)
}

async function getUser(token, mail) {
    const uri = `${process.env.GRAPH_ENDPOINT}v1.0/users/${mail}`
    const options = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }

    try {
        const response = await axios.get(uri, options)
        return response.data
    } catch (error) {
        return error
    }

}

async function getGroups(token) {
    const uri = `${process.env.GRAPH_ENDPOINT}v1.0/groups`
    return await api.Get(uri, token)
}

async function postUsers(token, data, addUri = '') {
    const uri = `${process.env.GRAPH_ENDPOINT}v1.0/users${addUri}`
    return await api.Post(uri, token, data)
}

async function patchUsers(token, data, addUri = '') {
    const uri = `${process.env.GRAPH_ENDPOINT}v1.0/users${addUri}`
    return await api.Patch(uri, token, data)
}

async function postGroups(token, data, addUri = '') {
    const uri = `${process.env.GRAPH_ENDPOINT}v1.0/groups${addUri}`
    return await api.Post(uri, token, data)
}

async function updateUsers(token) {
    console.log(token)
}

module.exports = {
    getUsers, getUser, postUsers, updateUsers, getGroups, postGroups, patchUsers
}