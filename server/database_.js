var mysql = require('mysql');
let config = require('./config.js');
let con = mysql.createConnection(config);
const userModel = require('../models/usermodel.js')




var insertquery = async (table, data) => {
  var keys1 = Object.keys(data)
  var values1 = keys1.toString()
  var keys2 = Object.values(data)
  var array = ""
  for (var i of keys2) {
    array += '"' + i + '"' + ','

  }
  array = array.substring(0, array.length - 1)
  var sql = `INSERT INTO ${table} (${values1}) VALUES (${array})`;

  await con.query(sql)
  var data = "data inserted"
  return data
}

var getquery = async (table) => {
  return new Promise((resolve, reject) => {

    var sql = `SELECT * FROM ${table}`
    var array = []
    await con.query(sql, (err, res) => {
      if (err) {
        reject(err)
      }
      else {
        resolve(res)
      }
    })

  })






}
var deletequery = async (table, id, callback) => {
  var sql = `DELETE FROM ${table} WHERE id=${id}`
  await con.query(sql, (err, result) => {
    return callback(result)
  })
}


var getbyidquery = async (table, id, callback) => {
  var sql = `SELECT * FROM ${table} WHERE id=${id}`
  await con.query(sql, (err, result) => {
    return callback(result)
  })

}
var updatequery = async (table, id, data, callback) => {
  var keys = Object.keys(data)
  var values = Object.values(data)
  var array = ""
  for (i = 0; i < keys.length; i++) {
    array += keys[i] + '=' + '"' + values[i] + '"' + ','
  }
  array = array.substring(0, array.length - 1)
  var sql = `UPDATE ${table} SET ${array} WHERE id=${id}`
  await con.query(sql, (err, result) => {
    return callback(result)
  })
  var data = "updated"
  return data
}


module.exports = {
  insertquery: insertquery,
  getquery: getquery,
  deletequery: deletequery,
  updatequery: updatequery,
  getbyidquery: getbyidquery
}





