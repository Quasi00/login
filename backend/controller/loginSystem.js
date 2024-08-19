const bcrypt = require("bcrypt");
const db = require('./database.js')

function register(data, res) {
  try {
    // res.status(200).send({error: true, errorCode: 'test_error'});
    // return
    const { email, displayName, passwordHash } = data;

    var dataError = false;
    if (!(/^[A-Za-z0-9+_.-]{1,}@[A-Za-z0-9.-]+$/.test(email))){
      dataError = true;
    }
    if (!/^[A-Za-z0-9+-_.!#]{5,}$/.test(displayName)){
      dataError = true;
    }

    if (dataError) {
      res.status(200).send({error: true, error: dataError});
      return
    };

    db.conn.query('SELECT * FROM user WHERE email = ?', [email], function (err, result) {
      if (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
        return;
      }
      
      if (result.length > 0){
        res.status(200).send({error: true, errorCode: 'email_used'});
        return;
      }
      
      const sqlQuery = 'INSERT INTO user (email, displayName, passwordHash) VALUES (?, ?, ?)';
      db.conn.query(sqlQuery, [email, displayName, passwordHash], function (err, result) {
        if (err) {
          console.error(err);
          res.status(500).send('Internal Server Error');
          return;
        }
        
        login(data, res)
      });
    });
  
  } catch (e) {
    res.status(500).send('Internal Server Error');
    return;
  }
}

function login(data, res) {
  try {
    const { email, passwordHash } = data;
  
    const sqlQuery = 'SELECT * FROM user WHERE email = ? AND passwordHash = ? LIMIT 1';
    db.conn.query(sqlQuery, [email, passwordHash], function (err, result) {
      if (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
        return;
      }
      
      if (result.length > 0){
        const userData = result[0];
        bcrypt
          .genSalt(userData.id)
          .then(salt => {
            return bcrypt.hash(userData.email, salt)
          })
          .then(token => {
            console.log(token)
            db.conn.query('INSERT INTO authToken (user_id, token) VALUES (?, ?)', [userData.id, token], function () {
              console.log(`New token created`);
              res.status(200).send({user: result[0], token: token});
            });
          })
          .catch(err => console.error(err.message))
        return;
      }
      res.status(200).send({error: true, errorCode: 'user_notfound'});
    });
  } catch (e) {
    res.status(500).send('Internal Server Error');
    return;
  }
}

function logout(data, res) {
  try {
    const { token } = data;

    const sqlQuery = 'DELETE FROM authtoken WHERE token = ?;';
    db.conn.query(sqlQuery, [token], function (err) {
      if (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
        return;
      }
  
      console.log('user logged out')
    });
    res.status(200);
  } catch (e) {
    res.status(500).send('Internal Server Error');
    return;
  }
}

function checkToken(data, res) {
  try {
    const { token } = data;
    
    const sqlQuery = 'SELECT * FROM authToken WHERE token = ?';
    
    db.conn.query(sqlQuery, [token], function (err, tokenResult) {
      if (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
        return;
      }
  
      if (!tokenResult.length) {
        // Jeśli token nie został znaleziony, zwróć odpowiedź z błędem
        res.status(200).send({error: true, errorCode: 'token_notfound'});
        return;
      }
  
      const sqlQueryUser = 'SELECT * FROM user WHERE id = ? LIMIT 1';
      
      db.conn.query(sqlQueryUser, [tokenResult[0].user_id], function (err, userResult) {
        if (err) {
          console.error(err);
          res.status(500).send('User select error');
          return;
        }
  
        if (!userResult.length) {
          // Jeśli użytkownik nie został znaleziony, zwróć odpowiedź z błędem
          res.status(200).send({error: true, errorCode: 'user_notfound'});
          return;
        }
        res.status(200).send(userResult[0]);
      });
    });
  } catch (e) {
    res.status(500).send('Internal Server Error');
    return;
  }
}

module.exports = {register, login, logout, checkToken}