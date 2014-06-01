var bitcoin = require('bitcoinjs-lib'),
     ecies = require('ecies');

var text = 'mfhaGJVjYGTBw81HtoLQMws9gCn5sknrWz';
var ecKey = bitcoin.ECKey('cPYsZsVe38k4aVk8DVb1rKxrhcRF6gZRW4uZeNEJBDQKXawcxTHu', false)

var privateKey = ecKey.toHex();
console.log(privateKey);
var publicKey = ecKey.getPub(false).toString();
console.log(publicKey);
var cipherText = ecies.encrypt(text, publicKey, 'secp256k1');

var decryptedText = ecies.decrypt(cipherText, privateKey, 'secp256k1');
console.log(text, '->', cipherText, '->', decryptedText);
