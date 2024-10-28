const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
const mysql = require('mysql2');
const port = 8081;

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "cimatec",
    database: "FinalCourse"
});



app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'HTMLs')));

app.post('/submit', (req, res) => {
    const {email, senha, nome, cpf, telefone} = req.body;

    const query = "insert into users values (?, ?, ?, ?, ?);"

    db.query(query, [cpf, nome, email, senha, telefone], function(err, result){
        if(err) throw err;

        console.log("1 record inserted");
        res.redirect("/");
    });
});


app.post("/auth", (req, res) => {
    let email = req.body.email;
    let senha = req.body.senha;
    
    db.query("select * from users where userEmail = ? and userPassword = ?;", [email, senha], function(err, results, fields){
        if(err) throw err;
        
        if(email && senha){
            if(results.length > 0){
                req.session.loggedin = true;
                req.session.email = email;
                
                console.log(req.session.email);
                
                res.redirect('/');
            }
            else{
                res.json({ success: false, message: "Incorrect email and/or password." });
            }
        }
        else{
            res.json({ success: false, message: 'Please, insert your email and password!' });
        }
    })
});

app.post("/gitReg", (req, res) => {
    db.query("insert into courseUsers (userEmail_FK, courseID_FK) values (?, 1);", [req.session.email], function(err, results, fields){
        if(err) throw err;
        
        console.log("1 record inserted");
        res.redirect('/CursoGithub');
    })
});

app.post('/gitAuth', (req, res) => {
    if (req.session.loggedin) {
        db.query("select * from courseUsers where userEmail_FK = ? and courseID_FK = 1;", [req.session.email], function(err, results, fields){
            if(err) throw err;
            
            if(results.length > 0){
                res.redirect('/gitModules');
            }
            else{
                res.redirect('/QGitHub');
            } 
        })
    } 
    else {
        res.redirect('/loginScreen');
    }
})

app.post("/htmlcssReg", (req, res) => {
    db.query("insert into courseUsers (userEmail_FK, courseID_FK) values (?, 2);", [req.session.email], function(err, results, fields){
        if(err) throw err;
        
        console.log("1 record inserted");
        res.redirect('/Cursohtml');
    })
});

app.post('/htmlcssAuth', (req, res) => {
    if (req.session.loggedin) {
        db.query("select * from courseUsers where userEmail_FK = ? and courseID_FK = 2;", [req.session.email], function(err, results, fields){
            if(err) throw err;
            
            if(results.length > 0){
                res.redirect('/htmlModules');
            }
            else{
                res.redirect('/QHTML');
            } 
        })
    } 
    else {
        res.redirect('/loginScreen');
    }
})
app.post("/jsReg", (req, res) => {
    db.query("insert into courseUsers (userEmail_FK, courseID_FK) values (?, 3);", [req.session.email], function(err, results, fields){
        if(err) throw err;

        console.log("1 record inserted");
        res.redirect('/CursoJS');
    })
});

app.post('/jsAuth', (req, res) => {
    if (req.session.loggedin) {
        db.query("select * from courseUsers where userEmail_FK = ? and courseID_FK = 3;", [req.session.email], function(err, results, fields){
            if(err) throw err;
            
            if(results.length > 0){
                res.redirect('/javaModules');
            }
            else{
                res.redirect('/QJS');
            } 
        })
    } 
    else {
        res.redirect('/loginScreen');
    }
})

app.get('/userInfo', (req, res) => {
    if (req.session.loggedin) {
        db.query("select * from users where userEmail = ?", [req.session.email], function(err, results, fields){
            if(err) throw err;
            
            if(results.length > 0){
                res.json(results);
                console.log(results);
            }
            else{
                console.log("Couldn't find user.")
            }
        })
    } 
    else {
        res.redirect('/loginScreen');
    }
})


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
    res.sendFile(__dirname + '/HTMLs/perfil.html')
})

app.get('/gitModules', function(req, res){
    res.sendFile(__dirname + '/HTMLs/Modules/modulesGit.html');
});

app.get('/htmlModules', function(req, res){
    res.sendFile(__dirname + '/HTMLs/Modules/modulesHtml.html');
});

app.get('/javaModules', function(req, res){
    res.sendFile(__dirname + '/HTMLs/Modules/modulesJava.html');
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

app.get('/CursoJS', function(req, res){
    res.sendFile(__dirname + '/HTMLs/CursoJavaScript.html');
});

app.get('/QGitHub', function(req, res){
    res.sendFile(__dirname + '/HTMLs/Question/CourseGit.html');
});

app.get('/QHTML', function(req, res){
    res.sendFile(__dirname + '/HTMLs/Question/CourseHtmlCss.html');
});

app.get('/QJS', function(req, res){
    res.sendFile(__dirname + '/HTMLs/Question/Coursejs.html');
});


app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});
