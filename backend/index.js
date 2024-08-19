const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const http = require('http');
const WebSocket = require('ws');
const loginSystem  = require('./controller/loginSystem.js');
const getData  = require('./controller/getData.js');
const db = require('./controller/database.js')

var online = 0;
const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });
wss.on('connection', ws => {
  // Zwiększ liczbę online i zaktualizuj wszystkich klientów
  online++;
  broadcastOnlineCount();

  ws.on('message', message => {
    console.log(`Received: ${message}`);
  });

  ws.on('close', () => {
    // Zmniejsz liczbę online i zaktualizuj wszystkich klientów
    online--;
    broadcastOnlineCount();
  });
});

function broadcastOnlineCount() {
  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(online);
    }
  });
}
// Ustawienia CORS
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});

//Parsowanie danych z formularzy
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const storage = multer.memoryStorage();

// Pobranie danych wszystkich użytkowników
app.post('/getUsers', (req, res) => {
  getData.users(res)
})

// Rejestracja użytkownika
app.post('/register', (req, res) => {
  loginSystem.register(req.body, res);
});

// Logowanie użytkownika
app.post('/login', (req, res) => {
  loginSystem.login(req.body, res);
});

app.post('/checkToken', (req, res) => {
  loginSystem.checkToken(req.body, res)
});

// // Obsługa żądań POST dla /logout
app.post('/logout', (req, res) => {
  loginSystem.logout(req.body, res)
});

// Uruchomienie serwera na porcie 80
server.listen(80, () => {
  console.log('Server is listening on port 80');
});