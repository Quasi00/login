const db = require('./database.js')

function users(res){
    const sqlQuery = 'select * from user';
    db.conn.query(sqlQuery, function (err, result) {
      if (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
        return;
      }
      console.log('Pomyślnie pobrano dane użytkowników');
      res.status(200).send(result);
    });
}

function tokens(res){
    const sqlQuery = 'select * from authToken';
    db.conn.query(sqlQuery, function (err, result) {
      if (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
        return;
      }
      console.log('Pomyślnie pobrano tokeny');
      res.status(200).send(result);
    });
}

module.exports = {users, tokens}