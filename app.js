const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const firebase = require('firebase/app')
const auth = require('firebase/auth')
const db = require('firebase/firestore')
const session = require('express-session')
const uuid = require('uuid').v4
const FileStore = require('session-file-store')(session);
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

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
app.use(session({
    genid: (req) => {
        console.log(req.sessionID)
        return uuid()
    },
    store: new FileStore(),
    secret: 'testing',
    resave: false,
    saveUninitialized: true
}))



app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'HTMLs', 'home.html'));
});

app.get('/loginScreen', (req, res) => {
    res.sendFile(path.join(__dirname, 'HTMLs', 'login.html'));
});

app.get('/registerScreen', (req, res) => {
    res.sendFile(path.join(__dirname, 'HTMLs', 'register.html'));
});

app.get('/perfil', (req, res) => {
    res.sendFile(__dirname + 'perfil.html')
})

app.get('/modulesScreen', function(req, res){
    res.sendFile(__dirname + '/HTMLs/Modules/modules.html');
});

app.get('/Cursos', function(req, res){
    res.sendFile(__dirname + '/HTMLs/Cursos.html');
});

app.get('/CursoGithub', function(req, res){
    res.sendFile(__dirname + '/HTMLs/CursoGithub.html');
});

app.get('/Cursohtml', function(req, res){
    res.sendFile(__dirname + '/HTMLs/CursoHTML.html');
});



app.post('/submit', (req, res) => {
    const { email, senha, nome, cpf, telefone } = req.body;
    
   
auth.createUserWithEmailAndPassword(auth.getAuth(), email, senha).
then((userCredential) => {

    const database = db.getFirestore()
    const user = userCredential.user
    const userData = {
        email: email, 
        nome: nome, 
        cpf: cpf,
        telefone: telefone,
        last_signIn: Date.now()
    }
    const docRef = db.doc(database, 'users', user.uid)
    db.setDoc(docRef, userData).then(() => {
        console.log('Sucesso ao cadastrar na firestore!')
    }).catch((error) => {
        console.log('Erro ao registrar na firestore!')

    })


    res.json({message: 'Conta cadastrada com sucesso!'})

}).catch((error) => {
   res.status(500).json({ message: 'Erro ao realizar cadastro!' });
})


       
});


app.post('/auth', (req, res) => {
    const { email, senha } = req.body;

    
       
        auth.signInWithEmailAndPassword(auth.getAuth(), email, senha)
        .then((userCredential) => {

            res.redirect('/Cursos');

        })
        .catch((error) => {
            res.status(500).json({ message: 'Erro na autenticação!' });
        })       
    
});


app.get('/getAcc', (req,res) => {
    const database = db.getFirestore()
    auth.onAuthStateChanged(auth.getAuth(), (user) => {
       const loggedInUserId = localStorage.getItem('loggedInUserId')
       if(loggedInUserId){
            const docRef = db.doc(db, 'users', loggedInUserId)
            db.getDoc(docRef).then((docSnap) => {
                if(docSnap.exists()){
                    const userData = docSnap.data()
                    res.json(userData)
                }else{
                    console.log('Nenhum documento encontrado com esse id!')
                }
            }).catch((error) => {
                console.log('Erro ao encontrar o documento!')
            })
       } 
    })

})

app.delete('/deleteAcc', (req,res) => {

   
})


app.put('/updateAcc', (req,res) => {


})

app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});
