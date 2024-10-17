const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const firebase = require('firebase/app')
const auth = require('firebase/auth')


const firebaseConfig = {
    apiKey: "AIzaSyCzRU7UCjiA5OhRo6NouMfVlTxCTL-YAPk",
    authDomain: "coursesportal-7e59f.firebaseapp.com",
    projectId: "coursesportal-7e59f",
    storageBucket: "coursesportal-7e59f.appspot.com",
    messagingSenderId: "1089442985258",
    appId: "1:1089442985258:web:658bb10d567f5ffdb0da53"

}

firebase.initializeApp(firebaseConfig)


const app = express();
const port = 8081;
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
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
    res.sendFile(__dirname + '/HTMLs/Modules/modules.html');
});

app.get('/Cursos', function(req, res){
    res.sendFile(__dirname + '/HTMLs/Cursos.html');
});

app.get('/CursoGithub', function(req, res){
    res.sendFile(__dirname + '/HTMLs/CursoGithub.html');
});



app.post('/submit', (req, res) => {
    const { gmail, senha } = req.body;
   
auth.createUserWithEmailAndPassword(auth.getAuth(), gmail, senha).
then((userCredential) => {

const user = userCredential.user

 res.json({message: 'Conta cadastrada com sucesso!'})

}).catch((error) => {
   res.status(500).json({ message: 'Erro ao realizar cadastro!' });
})
       
});


app.post('/auth', (req, res) => {
    const { gmail, senha } = req.body;

    
       
        auth.signInWithEmailAndPassword(auth.getAuth(), gmail, senha)
        .then((userCredential) => {

            res.redirect('/Cursos');

        })
        .catch((error) => {
            res.status(500).json({ message: 'Erro na autenticação!' });
        })       
    
});


app.delete('/deleteAcc/:email', (req,res) => {


})


app.put('/updateAcc', (req,res) => {


})

app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});
