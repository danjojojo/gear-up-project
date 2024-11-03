const crypto = require('crypto');
const encryptionKey = process.env.ENCRYPTION_KEY; // Make sure this is a 32-byte key

const algorithm = 'aes-256-cbc'; // AES-256-CBC encryption
const ivLength = 16; // IV length for AES-256-CBC is 16 bytes

function encrypt(data) {
    const iv = crypto.randomBytes(ivLength);
    const cipher = crypto.createCipheriv(algorithm, Buffer.from(encryptionKey), iv);
    let encrypted = cipher.update(data, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    const encryptedData = `${iv.toString('hex')}:${encrypted}`; // IV and encrypted data
    return encryptedData;
}

function decrypt(encryptedData) {
    const [iv, encrypted] = encryptedData.split(':');
    const decipher = crypto.createDecipheriv(algorithm, Buffer.from(encryptionKey), Buffer.from(iv, 'hex'));
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
}

module.exports = { encrypt, decrypt };