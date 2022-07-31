var request = require('request');
var csv2 = require('csv-stream');

'use strict';

module.exports.csv = async event => {
  var rows = [];
  rows = await parseCSV(event);
  return {"rows" :rows};
    
};

async function parseCSV(event) {

  let promise = new Promise((resolve, reject) => {

    checkInput(event, reject);

    var csvStream = csv2.createStream({});
    var rows = [];
    var options = event.url;
 
    request(options).pipe(csvStream)
      .on('error', function (err) {
        return reject(err)
      })
      .on('header', function (columns) {
        //console.log(columns);
      })
      .on('data', function (data) {
        // outputs an object containing a set of key/value pair representing a line found in the csv file.
       // console.log(data);
       //rows.push({"data": JSON.stringify(data)})
       rows.push(data)

      })
      .on('column', function (key, value) {
        // outputs the column name associated with the value found
        //console.log('#' + key + ' = ' + value);

      })
      .on('end', function () {
        return resolve(rows);
      });



  })

  let result = await promise; // wait till the promise resolves (*)
  return result

 
}

function checkInput(event ,reject) {
  if (!event?.url) {
    reject(new Error("Please provide a URL"));
  }

  const expression = /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/gi;
  const regex = new RegExp(expression);
  if (!event.url.match(regex) || !event.url.match(regex).length) {
    reject(new Error("URL invalid: " + event.url));
  }
}