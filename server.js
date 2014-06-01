var _ = require('lodash')
var Bitcoin = require('bitcoinjs-lib')
var util = require('./util')

var registeredClients = []

var register = function(client) {
  if(verifyInputAddress(client.inputAddress)) {
    registeredClients.push(client)
  }
}

var shuffle = function(denomination) {

  registeredClients = util.randomizeOrder(registeredClients)
  var pubKeyList = getPubKeyList(registeredClients)
  var encryptedOutputs = getEncryptedOutputs(registeredClients, pubKeyList)

  // call each client in order, asking them to shuffle and decrypt
  var decryptedOutputs = getDecryptedOutputs(registeredClients, encryptedOutputs)

  // create transaction
  var inputList = getInputs(registeredClients)
  var changeOutputs = generateChangeOutputs(registeredClients, denomination)
  var transaction = createTransaction(inputList, decryptedOutputs, changeOutputs)

  // submit transaction to all clients for signature
  var signedTransaction = requestClientSignatures(registeredClients, transaction)

  // serialize transaction
  var hexTransaction = signedTransaction.serializeHex()

  // broadcast
  console.log(hexTransaction)
}

var requestClientSignatures = function(clients, transaction) {
  var index = 0

  _(clients).forEach(function (client) {
    transaction = client.verifyAndSignTransaction(transaction, index)
    index++
  })
  return transaction
}

var lookupInputs = function(address) {
 // inputs simulates using helloblock or blockchain api to look up inputs for given addresses
  var inputData = {
    'mpHvfkpNc9cTL6oytRCuCRKwjb4giBVreo': ['3020283677df6041c5cbf47eb483172dee6795c237729cda3c7b5b67f993d233', 0],
    'mqotCTdWDGocKk3q4PgG4NjJdFp3Z4q5rp': ['e72e85b77dfdd77527a42b97814c3a31edea4bda1a7aaadce2d76eeec2908895', 1],
    'mtUhedGBQ2txSYbH5ZTktdyyi8816m2UM3': ['b7a3b6937119cc8ee5b014cdfbecb28e8436d2c984e8bcdd2047c1747b81172e', 0],
    'mu75neruhq29tDS8SZhNg5jkK7ZQpt8phi': ['915caddfaa3c835ea11d9a07d16b343a8905217b227a21dd27e6705a143a28d8', 1],
    'mvbVJ5he6hs4dsUcc1MnWkPMGttgV8ppNY': ['4088f2f0de3b7a3dc060beba4ea45ef51494bf43520763ac7884243cb33f07f3', 0],
    'mx71vJ2Jn7tSLetwpf4T4veqU9qDbziuUj': ['ee584eff88554f715672955b7c30c8b653d720eca77599762647527888997778', 0],
    'mzRjMNjesdB6HyjpYkVYy81FnvSoTvjcJ9': ['9f6459f338d8abddcfd5c377a954c56bbd486a2df63d160e223de39940e839e5', 1],
    'n4gKvUQFSY58oFJxY2zcKQpS45B7WPLmHt': ['e4a2fa78c80c365d5c059c7361f6f234ee5eda6127b6efd2be032086b92c601d', 0],
    'morMCuQ6sMVPS8enxCRnTidaebhPz1Nftv': ['2609c9e8744a896c0f27af9a69e94c00ce5009fabe45877ed1fb3f32d5274b3b', 0],
    'mp3ubgiJaAUAAddb54QArDuBKgeX829RNN': ['fc3a8e6dcf027ef2baab29486a5e8d76c850b17d96c584b12509ee644df6df41', 0]
  }

  return inputData[address]
}

var lookupInputAmount = function(txid, txIndex) {
  var txData = {
    '3020283677df6041c5cbf47eb483172dee6795c237729cda3c7b5b67f993d233': [160000000],
    'e72e85b77dfdd77527a42b97814c3a31edea4bda1a7aaadce2d76eeec2908895': [null, 160000000],
    'b7a3b6937119cc8ee5b014cdfbecb28e8436d2c984e8bcdd2047c1747b81172e': [170000000],
    '915caddfaa3c835ea11d9a07d16b343a8905217b227a21dd27e6705a143a28d8': [null, 160000000],
    '4088f2f0de3b7a3dc060beba4ea45ef51494bf43520763ac7884243cb33f07f3': [160000000],
    'ee584eff88554f715672955b7c30c8b653d720eca77599762647527888997778': [160000000],
    '9f6459f338d8abddcfd5c377a954c56bbd486a2df63d160e223de39940e839e5': [null, 150000000],
    'e4a2fa78c80c365d5c059c7361f6f234ee5eda6127b6efd2be032086b92c601d': [160000000],
    '2609c9e8744a896c0f27af9a69e94c00ce5009fabe45877ed1fb3f32d5274b3b': [150000000],
    'fc3a8e6dcf027ef2baab29486a5e8d76c850b17d96c584b12509ee644df6df41': [160000000]
  }

  return txData[txid][txIndex]
}

var generateChangeOutputs = function(clients, denomination) {
  var changeOutputs = []

  _(clients).forEach(function(client) {
    inputData = lookupInputs(client.inputAddress)
    inputAmount = lookupInputAmount(inputData[0], inputData[1])
    changeAmount = inputAmount - denomination
    changeOutputs.push([client.inputAddress, changeAmount])
  })
  
  return changeOutputs
}

var getInputs = function(clients) {
  var inputList = []

  _(clients).forEach(function (client) {
    inputList.push(lookupInputs(client.inputAddress))
  })

  return inputList
}

var createTransaction = function(inputList, outputList, changeOutputs) {
  var tx = new Bitcoin.Transaction()

  _(inputList).forEach(function (input) {
    tx.addInput(input[0], input[1])
  })

  _(outputList).forEach(function (output) {
    tx.addOutput(output, 1)
  })

  _(changeOutputs).forEach(function (changeOutput) {
    tx.addOutput(changeOutput[0], changeOutput[1])
  })

  return tx
}

var verifyInputAddress = function(address) {
  // server should connect to helloblock and test inputs to make sure there are enough coins
  return true 
}

var getPubKeyList = function(clientList) {
  var pubKeyList = []

  _(clientList).forEach(function (client) {
    pubKeyList.push(client.pubKey)
  })
  return pubKeyList
}

var getEncryptedOutputs = function(clientList, pubKeyList) {
  var encryptedOutputs = []

  // pass each client the list of public keys, ask them to return their 
  // output encrypted in the proper order
  _(clientList).forEach(function (client) {
    encryptedOutputs.push(client.encryptOutput(pubKeyList))
  })
  return(encryptedOutputs)
}

var getDecryptedOutputs = function(clientList, encryptedOutputs) {
  var decryptedOutputs = encryptedOutputs
  var reversedClientList = clientList.reverse()

  _(reversedClientList).forEach(function (client) {
    decryptedOutputs = client.decryptOutputs(decryptedOutputs, client.privKey)
  })

  return decryptedOutputs
}

exports.register = register
exports.shuffle = shuffle
