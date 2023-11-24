const crypto = require('crypto')
function calculateHMAC(data, key){
    const hmac = crypto.createHmac('sha256', key);
    hmac.update(data, 'utf-8');
    return hmac.digest('hex');
}

module.exports = calculateHMAC
