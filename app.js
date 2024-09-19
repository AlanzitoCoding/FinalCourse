const express = require('express');
const app = express();
const conn = require('./db');
const bodyParser = require('body-parser');

const port = 8081;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/', function(req, res){
    res.sendFile(__dirname + '/HTMLs/home.html');
});

app.get('/loginScreen', function(req, res){
    res.sendFile(__dirname + '/HTMLs/login.html');
});

app.get('/registerScreen', function(req, res){
    res.sendFile(__dirname + '/HTMLs/register.html');
});

app.post('/registerUser', (req, res) => {
    const { email, password } = req.body || {};

    if (!email || !password) {
        return res.status(400).send('Email and password are required.');
    }

    const query = 'INSERT INTO users (userEmail, userPassword) VALUES (?, ?)';
    
    conn.query(query, [email, password], (err, result) => {
        if (err) {
            console.error('Insertion Error: ' + err.stack);
            return res.status(500).send('Registration Error.');
        }

        res.send('User has been successfully registered.');
    });
});

app.post('/email', (req, res) => {
    const {email, password} = req.body;
    const query = 'select * from users where userEmail = ? and userPassword = ?';

    conn.query(query, [email, password], (err, result) => {
        if(err){
            console.error('User not found: ' + err.stack);
            return res.status(500).send('User not found.');
        }
        else{
            res.json({message: "Logged in!"});
        }
    });
});

app.listen(port, function(){
    console.log('Server is working properly!');
});