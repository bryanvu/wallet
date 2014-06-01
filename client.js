var _ = require('lodash')

var Bitcoin = require('bitcoinjs-lib')
var ecies = require('ecies')
var util = require('./util')


function Client(inputPrivKey, outputAddress) {
  this.ECKey = Bitcoin.ECKey()

  this.privKey = this.ECKey.toString()
  this.pubKey = this.ECKey.getPub().toString()
  this.inputPrivKey = inputPrivKey
  this.inputAddress = Bitcoin.ECKey(inputPrivKey).getPub().getAddress(111).toString()
  this.outputAddress = outputAddress
}

Client.prototype.verifyAndSignTransaction = function (transaction, inputIndex) {
  var key = Bitcoin.ECKey(this.inputPrivKey)

  transaction.sign(inputIndex, key)
  return(transaction)
}

Client.prototype.encryptOutput = function (pubKeyList) {
  var output = this.outputAddress

  _(pubKeyList).forEach(function (pubKey) {
    output = ecies.encrypt(output, pubKey, 'secp256k1')
  })

  return output 
}

Client.prototype.decryptOutputs = function (encryptedOutputs, privKey) {
  var decryptedOutputs = []

  encryptedOutputs = util.randomizeOrder(encryptedOutputs)

  _(encryptedOutputs).forEach(function (encOutput) {
    decryptedOutputs.push(ecies.decrypt(encOutput, privKey, 'secp256k1'))
  })

  return decryptedOutputs
}

Client.prototype.reorderAndDecrypt = function (encryptedOutputList) {
  return decryptedOutputList
}

module.exports = Client
