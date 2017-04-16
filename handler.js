'use strict';

const fileReader = require('./file-reader')

const Combinatorics = require('js-combinatorics');

const R = require('ramda');

// const findDictionaryWords = R.pipe(generateAllWordCombinations, checkIfDictionaryWord);

// const checkIfDictionaryWord = ()

module.exports.getDictionaryWords = (event, context, callback) => {
  console.log(context);
  let params = {};
  if (event.queryStringParameters) {
    params = {
      inputString: event.queryStringParameters.letters.toLowerCase() || 'abcde',
      mandLetter: event.queryStringParameters.mand || 'd',
      minWordLength: event.queryStringParameters.length || 4
    }
  } else {
    params = {
      inputString: 'Realapp'.toLowerCase(),
      mandLetter: 'p',
      minWordLength: 4
    }
  }

  fileReader.readFromFile('./dict.txt')
  .then(data => {
    const allWords = generateAllWordCombinations(params.inputString,
     params.minWordLength, params.inputString.length);
    const filteredWords = filterByMandLetter(allWords, params.mandLetter);
    const response = {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin" : "*" // Required for CORS support to work
      },
      body: JSON.stringify({
        message: checkIfDictionaryWord(filteredWords, generateDictionary(data)),
        input: event,
      }),
    };
    callback(null, response);
  })
};

const generateDictionary = (data) => {
  let dict = {}
  data.split('\n').map(word => {
    dict[word] = true;
  })
  return dict;
}

const generateAllWordCombinations = (lettersList, minWordLength, maxWordLength) => {
  let cmb = Combinatorics.permutationCombination(lettersList.split(''));
  return R.uniq(cmb.toArray()
  .map(arr => arr.join(''))
  .filter(str => str.length > 3))
}

const checkIfDictionaryWord = (wordsList, dict) => wordsList.filter(word => dict[word])

const filterByMandLetter = (wordList, letter) => wordList.filter(word => word.indexOf(letter) != -1)