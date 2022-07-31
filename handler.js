var request = require('request');
var csv2 = require('csv-stream');

'use strict';

module.exports.csv = async event => {
  var rows = [];
  rows = await parseCSV(event);
  return rows;
    
};

async function parseCSV(event) {

  let promise = new Promise((resolve, reject) => {

    var csvStream = csv2.createStream({});

    var rows = [];
    
    var options = event.url;
    
    if (event.options){
      options = event.options;
    }
    
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
       if (event.json) {
         rows.push({"data": JSON.stringify(data)})
       } else {
          rows.push(data)
       }
        

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