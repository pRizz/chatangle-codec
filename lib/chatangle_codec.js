/*!
 * Chatangle Codec
 * Copyright Peter Ryszkiewicz 2018
 * MIT Licensed
 */

const openpgp = require('openpgp')

openpgp.initWorker()

function base64FromUint8Array(uint8Array) {
    return Buffer.from(uint8Array).toString('base64')
}

function bufferFromBase64(base64Text) {
    return Buffer.from(base64Text, 'base64')
}

// Returns a base64 string promise
async function encryptPayload(payload, password) {
    const options = {
        data: JSON.stringify(payload),
        passwords: [password],
        armor: false
    }

    const ciphertext = await openpgp.encrypt(options)
    return base64FromUint8Array(ciphertext.message.packets.write())
}

// Returns an object promise
async function decryptPayload(encryptedPayload, password) {
    const options = {
        message: openpgp.message.read(bufferFromBase64(encryptedPayload)),
        passwords: [password],
        format: 'utf8'
    }

    const plaintext = await openpgp.decrypt(options)
    return JSON.parse(plaintext.data)
}

module.exports = {
    encryptPayload,
    decryptPayload
}