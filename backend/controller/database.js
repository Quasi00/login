const mysql = require('mysql');

//Połączenie z bazą danych
const conn = mysql.createConnection({
  host: "localhost",//localhost - jeśli aplikacja jest uruchamiana na serwerze
  port: 3306,
  user: "root",
  password: "zaq1@WSX",
  database: "tests"
});

// Nawiązanie połączenia z bazą danych
conn.connect(function(err) {
  if (err) throw err;
  console.log("Connected to MySQL database!");
});

module.exports = {conn}