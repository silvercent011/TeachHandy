const axios = require('axios')

async function Get(endpoint,token) {
    const options = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }

    try {
        const response = await axios.get(endpoint,options)
        return response.data.value
    } catch (error) {
        return error
    }
}

async function Post(endpoint, token, data) {
    const options = {
        headers: {
            Authorization: `${token}`
            // Authorization: `Bearer ${token}`
        }
    }

    try {
        const response = await axios.post(endpoint,data,options)
        return response.data
    } catch (error) {
        return error
    }
}
async function Patch(endpoint, token, data) {
    const options = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }

    try {
        const response = await axios.patch(endpoint,data,options)
        return response.data.value
    } catch (error) {
        return error
    }
}

module.exports = {
    Get, Post, Patch
}