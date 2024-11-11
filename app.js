const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
const mysql = require('mysql2');
const { error } = require('console');
const port = 8081;

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "2006Pa#*#",
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
        if(err){
           return res.json({message: 'Erro ao cadastrar usuário!'})
        };

        console.log("1 record inserted");
        req.session.loggedin = true;
        req.session.email = email;
        res.json({message: 'Cadastro efetuado!'})
    });
});


app.post("/auth", (req, res) => {
   const {email, senha} = req.body
    
    db.query("select * from users where userEmail = ? and userPassword = ?;", [email, senha], function(err, results, fields){
        if(err) throw err;
        
        if(email && senha){
            if(results.length > 0){
                req.session.loggedin = true;
                req.session.email = email;
                
                console.log(req.session.email);
                res.json({ok:true});
                
            }
            else{
                const msg = "Incorrect email and/or password."
                res.json({message: msg});
                
            }
        }
        else{
            const msg = 'Please, insert your email and password!'
            res.json({message: msg});
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
    if (!req.session.loggedin) {

        res.redirect('/loginScreen');
    }

    db.query("select * from users where userEmail = ?", [req.session.email], function(err, results, fields){
        if(err) throw err;
        
        if(results.length > 0){
            res.json(results);
        }
        else{
            console.log("Couldn't find user.")
        }
    })
    
})

app.get('/logout', (req, res) => {
    req.session.loggedin = false;
    req.session.email = '';
    console.log('Logged out');
    res.redirect('/');
})

app.post('/gitComment', (req, res) => {
    const {comment} = req.body;

    db.query("insert into comments (courseID_FK, userEmail_FK, userComment) values (1, ?, ?);", [req.session.email, comment], function(err, results, fields){
        if(err) throw err;

        console.log('Comment sent');
    })
})


app.get('/getGitComment', (req,res) => {

db.query('select * from comments where courseID_FK = 1', function(err, results, fields){
    if(err) throw err;

    console.log('Comment gotten!');
    res.json(results)
})


})


app.post('/htmlcssComment', (req, res) => {
    const {comment} = req.body;

    db.query("insert into comments (courseID_FK, userEmail_FK, userComment) values (2, ?, ?);", [req.session.email, comment], function(err, results, fields){
        if(err) throw err;

        console.log('Comment sent');
    })
})

app.get('/getHtmlComment', (req,res) => {

    db.query('select * from comments where courseID_FK = 2', function(err, results, fields){
        if(err) throw err;
    
        console.log('Comment gotten!');
        res.json(results)
    })
    
    
})

app.post('/jsComment', (req, res) => {
    const {comment} = req.body;

    db.query("insert into comments (courseID_FK, userEmail_FK, userComment) values (3, ?, ?);", [req.session.email, comment], function(err, results, fields){
        if(err) throw err;

        console.log('Comment sent');
    })
})

app.get('/getJsComment', (req,res) => {
    db.query('select * from comments where courseID_FK = 3', function(err, results, fields){
        if(err) throw err;
    
        console.log('Comment gotten!');
        res.json(results)
    })
    
    

})

app.post('/gitWatchedVideo', (req, res) => {
    const {video} = req.body;

    try {
        db.query("insert into watchedVideos values (?, 1, ?, true);", [video, req.session.email], function(err, results, fields){
            if(err) {
                console.error(err);
                res.status(500).json({ error: 'Erro ao salvar no banco de dados' });
                return;
            }

            console.log('Vídeo salvo:', video);
            res.json({ success: true, message: 'Vídeo marcado como assistido' });
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

app.post('/htmlcssWatchedVideo', (req, res) => {
    const {video} = req.body;

    try {
        db.query("insert into watchedVideos values (?, 2, ?, true);", [video, req.session.email], function(err, results, fields){
            if(err) {
                console.error(err);
                res.status(500).json({ error: 'Erro ao salvar no banco de dados' });
                return;
            }

            console.log('Vídeo salvo:', video);
            res.json({ success: true, message: 'Vídeo marcado como assistido' });
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

app.post('/jsWatchedVideo', (req, res) => {
    const {video} = req.body;

    try {
        db.query("insert into watchedVideos values (?, 3, ?, true);", [video, req.session.email], function(err, results, fields){
            if(err) {
                console.error(err);
                res.status(500).json({ error: 'Erro ao salvar no banco de dados' });
                return;
            }

            console.log('Vídeo salvo:', video);
            res.json({ success: true, message: 'Vídeo marcado como assistido' });
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

app.post('/checkVideo', (req, res) => {
    const {video} = req.body;

    try {
        db.query("select * from watchedVideos where videoLink_FK = ? and userEmail_FK = ?;", [video, req.session.email], function(err, results, fields){
            if(err) {
                console.error(err);
                res.status(500).json({ error: 'Erro ao checar no banco de dados' });
                return;
            }

            if(results.length > 0){
                console.log(1)
                res.json(1);
            }
            else{
                console.log(0);
                res.json(0);
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
})


app.post('/progressCoursePercentage', (req, res) => {
    try {
        const {courseID} = req.body

        db.query("select sum(wv.isWatched)*100/c.modulesAmount as percentage from watchedVideos wv inner join courses c where wv.courseID_FK = c.courseID and wv.courseID_FK = ? and userEmail_FK = ? group by courseID;", [courseID, req.session.email], function(err, results, fields){
            if(err) {
                console.error(err);
                res.status(500).json({ error: 'Erro ao checar no banco de dados' });
                return;
            }

            
            console.log('Porcentagem de progresso: ' + results.length)
                res.json(results);
            
            
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
})

app.put('/updateUser', (req, res) => {

    const {userName, userCPF, userPhone, userPassword} = req.body;
    console.log(`${userName} | ${userCPF} | ${userPhone} | ${userPassword}`)

    db.query('UPDATE users SET userName = ?, userCPF = ?, userPhone = ?, userPassword = ? WHERE userEmail = ?', [userName, userCPF, userPhone, userPassword, req.session.email], function(err, results, fields){
        if(err) throw err;

        console.log("Informações alteradas com sucesso!");
        res.json({message: 'Informações alteradas com sucesso!'})
    })
})

app.delete('/deleteUser', (req, res) => {

    const {userPassword} = req.body


    db.query('DELETE FROM users WHERE userEmail = ? AND userPassword = ?', [req.session.email, userPassword], (err, results) => {
        if (!results.affectedRows || err ) {
            console.error('Erro ao deletar usuário:', err);
            return

        }
        
        console.log('User deletado')
        // Destruir a sessão'
        req.session.destroy((err) => {
            if (err) {
                console.error('Erro ao destruir sessão:', err);
            }
        });

        res.redirect('/')
    });
});

app.get('/listCourses', (req, res) => {
    db.query("select courseName from courseUsers inner join courses on courseID_FK = courseID and userEmail_FK = ?;", [req.session.email], function(err, results, fields){
        if(err) throw err;
        
        if(results.length > 0){
            console.log(results);
            res.json(results);
        }
        else{
            console.log("Couldn't find user.")
        }
    })
})

app.post('/videoRating', (req, res) => {
    const {video, courseID, rating} = req.body;

    db.query('insert into videoRating (videoLink_FK, courseID_FK, userEmail_FK, rating) values (?, ?, ?, ?)', [video, courseID, req.session.email, rating], function(err, results, fields){
        if(err) throw err;

        console.log('Rating sent');
    })
});

app.delete('/deleteRating', (req, res) => {
    const {video, courseID} = req.body;

    db.query('delete from videoRating where videoLink_FK = ? and courseID_FK = ? and userEmail_FK = ?', [video, courseID, req.session.email], function(err, results, fields){
        if(err){
            console.error('Erro ao excluir avaliação: ' + err);
            return res.status(500).send('Erro ao deletar avaliação');
        }

        console.log('Avaliação excluída!')
    })
})

app.post('/likesNDislikes', (req, res) => {
    const {video} = req.body;
    console.log(video)

    db.query('select (select count(rating) from videoRating where rating = 1 and videoLink_FK = ?) as Likes, (select count(rating) from videoRating where rating = 0 and videoLink_FK = ?) as Dislikes;', [video, video], function(err, results, fields){
        if(err) throw err;

        res.json(results);
        console.log(results);
    })
})

app.post('/addPfp', (req,res) => {
    const {imageLink} = req.body

    console.log('Image Link: ' + imageLink)

    db.query('INSERT INTO usersPic (imageLink, userEmail_FK) values (?,LOAD_FILE(?))', [imageLink, req.session.email], (err,results,fields) => {

        if(err) throw err;


    }) 
})

/*app.post('/getPfp', (req,res) => {
    const {imageLink} = req.body

    console.log('Image Link: ' + imageLink)

    db.query('SELECT ')


})*/

app.post('/getCourseConclusion', (req,res) => {
    const {courseID} = req.body

    db.query('SELECT courseConcluded from courseUsers where courseId_FK = ? AND userEmail_FK = ?', [courseID, req.session.email], (err,results,fields) => {
        if(err) throw err;

        console.log(results);
        res.json(results);
    })
})

app.post('/postCourseConclusion', (req,res) => {
    const {courseID,courseConcluded} = req.body

    db.query('INSERT INTO courseUsers (userEmail_FK,courseID_FK,courseConcluded) VALUES (?,?,?)', [req.session.email,courseID, courseConcluded], (err,results,fields) => {
        if(err) throw err;

        console.log(results);
        res.json({message: 'Curso concluído com sucesso!'});
    })
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
    if(req.session.loggedin){
        res.sendFile(__dirname + '/HTMLs/perfil.html')

    }else{
        
        res.sendFile(path.join(__dirname, 'HTMLs', 'login.html'))
    }
})
app.get('/sobre', (req, res) => {
    res.sendFile(__dirname + '/HTMLs/sobre.html')
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

app.get('/Certificado', function(req, res){
    res.sendFile(__dirname + '/HTMLs/Certificado.html');
});


app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});