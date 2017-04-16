const fs = require('fs')

const readFromFile = (pathToFile) => {
  let promise = new Promise((resolve, reject) => {
    fs.readFile(pathToFile, 'utf8', (err, data) => {
      if (err) reject(err)
      else resolve(data)
    })
  })
  return promise;
}

module.exports = {
  readFromFile
}
