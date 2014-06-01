var _ = require('lodash')
var Bitcoin = require('bitcoinjs-lib')

var Server = require('../server.js')
var Client = require('../client.js')


var clientsData = initializeClientsData()

_(clientsData).forEach(function (clientData) {
  var c = new Client(clientData['inputPrivKey'], clientData['outputAddress'])  

  Server.register(c)
})

var denomination = 100000000

Server.shuffle(denomination)



function initializeClientsData() {

  var clientPrivKeys = [
    'cPYsZsVe38k4aVk8DVb1rKxrhcRF6gZRW4uZeNEJBDQKXawcxTHu',
    'cQD5McWvaUBKat7JMdY6LZmMBA5damsqS6WyNp5kQttzJUCJvRhe',
    'cNc9Sbn9mowYR4m7U4cxpiPXKpcAMHU94gzxENcxwMHMKKR2u5Xs',
    'cPU1YhimBwKzf6eC6m9wPqn5gbjo2CMF4DtN4s1tXR8zX4TxK1xA',
    'cV3hJizp8sFdfd4tA61nLuusALb5hHBzCZtNpcU5nso2AEPPncg2',
    'cViWZjMyhDe3Az6YFaNVQmgrsTwSbuyx8hyraP5X66B23Endy9f6',
    'cUYZPH7q5GNhNrqXDeqpRvXCDr9tUCcmCDaGBbN7bKpcceDN4rpk',
    'cSW1smqep3zLNRnMg6Um55uC5Ds3DhuQ7nL73dMhVDRaKvt4kwNw',
    'cV8a91QJxBhWCgCsHDECc3uGwoNiQXp4ojD1MKyW9bnV7NrDxEfu',
    'cPLJezqix1W4HnHhKDVPDAg8RvsrqbSAEhAwyNjqZ67CvJtkX4W5'
    ]

/*
  var inputAddresses = [
    'mtUhedGBQ2txSYbH5ZTktdyyi8816m2UM3',
    'mu75neruhq29tDS8SZhNg5jkK7ZQpt8phi',
    'n4gKvUQFSY58oFJxY2zcKQpS45B7WPLmHt',
    'mpHvfkpNc9cTL6oytRCuCRKwjb4giBVreo',
    'mzRjMNjesdB6HyjpYkVYy81FnvSoTvjcJ9',
    'mvbVJ5he6hs4dsUcc1MnWkPMGttgV8ppNY',
    'mp3ubgiJaAUAAddb54QArDuBKgeX829RNN',
    'mqotCTdWDGocKk3q4PgG4NjJdFp3Z4q5rp',
    'mx71vJ2Jn7tSLetwpf4T4veqU9qDbziuUj',
    'morMCuQ6sMVPS8enxCRnTidaebhPz1Nftv'
  ]
*/

  var outputAddresses = [
    'mfhaGJVjYGTBw81HtoLQMws9gCn5sknrWz',
    'mqjCTNuKUcJYBzCQ8hHMiPPmK2dmV1vWjH',
    'msDtXzyP8eAGWSMbyTT35yByodUNf1Zpg4',
    'mvZXkjFD556r5fNUuwFFsPXjKwSe8JVBGd',
    'mjSAtRMtMnMAsz81t4Ra8nmbktEkn95iLK',
    'mzHXgphR655SMgio8oPDkQNJuLq7W1KnZH',
    'muQk3uAak7d3FLKSVL7yoGDzV1YtQg2oqS',
    'mh2nsd6qeZqCimtcDjX5TihGSHPA7s8AwW',
    'n1Te8fxTxyZtWi7Y8QeCCHEHLjPFpriZPn',
    'mwZPzLSjRxHbhWGDiXvoF8BgyEJZXjooki'
    ]

  var clientsData = []

  for(var i=0; i < clientPrivKeys.length; i++) {
    var clientData = {}
    clientData['inputPrivKey'] = clientPrivKeys[i]
    clientData['outputAddress'] = outputAddresses[i] 
    
    clientsData.push(clientData)
  }

  return clientsData
}

