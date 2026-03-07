const imageKit = require("@imagekit/nodejs");
// const {toFile} = require("@imagekit/nodejs");

const client = new imageKit({
    privatekey: process.env.IMAGEKIT_PRIVATE_KEY
})

async function uploadFile({buffer, filename, folder = ""}) {
    const file = await client.files.upload({
        file: await imageKit.toFile(Buffer.from(buffer)),
        fileName: filename,
        folder
    })

    return file
}

module.exports = {uploadFile}