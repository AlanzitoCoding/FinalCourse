const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const path = require('path');

const app = express();
const port = 8081;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'cimatec',
    database: 'curso_online'
});

db.connect((err) => {
    if (err) {
        throw err;
    }
    console.log('Conectado ao banco de dados!');
});

app.use(express.static(path.join(__dirname, 'HTMLs')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'HTMLs', 'home.html'));
});

app.get('/loginScreen', (req, res) => {
    res.sendFile(path.join(__dirname, 'HTMLs', 'login.html'));
});

app.get('/registerScreen', (req, res) => {
    res.sendFile(path.join(__dirname, 'HTMLs', 'register.html'));
});

app.get('/modulesScreen', function(req, res){
    res.sendFile(__dirname + '/HTMLs/modules.html');
});

app.post('/submit', (req, res) => {
    const { gmail, senha } = req.body;
    const query = 'INSERT INTO usuario (gmail, senha) VALUES (?, ?)';
    db.query(query, [gmail, senha], (err, result) => {
        if (err) {
            return res.status(500).json({ message: 'Erro ao realizar cadastro!' });
        }
        res.json({ message: 'Cadastro realizado!' });
    });
});

app.get('/getData', (req, res) => {
    const query = 'SELECT * FROM usuario';
    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Erro ao recuperar dados!' });
        }
        res.json(results);
    });
});

app.post('/auth', (req, res) => {
    const { gmail, senha } = req.body;

    if (gmail && senha) {
        db.query('SELECT * FROM usuario WHERE gmail = ? AND senha = ?', [gmail, senha], (err, results) => {
            if (err) {
                return res.status(500).json({ message: 'Erro na autenticação!' });
            }

            if (results.length > 0) {
                
                res.redirect('/home');
            } else {
                res.status(401).send('Gmail ou senha incorretos!');
            }
        });
    } else {
        res.status(400).send('Digite um gmail e senha!');
    }
});

app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});
