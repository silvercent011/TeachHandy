const msal = require('@azure/msal-node')

async function requireToken(config) {
    const msalConfig = {auth:config}
    const cca = new msal.ConfidentialClientApplication(msalConfig);
    const tokenRequest = {
        scopes: [ 'https://graph.microsoft.com/.default' ],
    };
    const tokenResponse = await cca.acquireTokenByClientCredential(tokenRequest)
    return tokenResponse
}

module.exports = {
    requireToken
}