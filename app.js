const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
const mysql = require('mysql2');
const { error } = require('console');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const port = 8081;

const db = mysql.createConnection({
    host: "interchange.proxy.rlwy.net",
    user: "root",
    password: "XQrNPTjyDkNqEaxGDRNQhqOUSHsdMnWa",
    database: "railway",
    port: "12775"
});

db.connect((err) => {
    if(err) throw err;

    console.log('Conectado ao banco de dados!')
})

app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

app.use(express.static(path.join(__dirname, 'public'), { extensions: ['html', 'ejs'] }));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// Removido o middleware global para arquivos estáticos
// app.use('/HTML/professores', verifyTokenAndEntity('professores'))
// app.use('/HTML/alunos', verifyTokenAndEntity('alunos'))

// Exemplo de proteção de rota dinâmica (adicione conforme necessário):
// app.get('/alguma-rota-protegida', verifyTokenAndEntity('professores'), (req, res) => { ... })

app.post('/submit', (req, res) => {
    const {email, senha, nome, cpf, telefone, tipoUsuario, plano} = req.body;

    // Verifica se tipoUsuario foi enviado
    if (!tipoUsuario) {
        return res.json({message: 'Selecione o tipo de usuário!'});
    }

    // Adapta o insert para incluir tipoUsuario e plano (se aluno)
    let query, params;
    if (tipoUsuario === 'aluno') {
        // Supondo que a tabela users tem as colunas: userCPF, userName, userEmail, userPassword, userPhone, tipoUsuario, plano
        query = "INSERT INTO alunos (alCPF, alNome, alEmail, alSenha, alTelefone, alPlano) VALUES (?, ?, ?, ?, ?, ?);";
        params = [cpf, nome, email, senha, telefone, plano];
    } 
    else if(tipoUsuario === 'professor') {
        // Professor não precisa de plano
        query = "INSERT INTO professores (prCPF, prNome, prEmail, prSenha, prTelefone) VALUES (?, ?, ?, ?, ?);";
        params = [cpf, nome, email, senha, telefone];
    }

    db.query(query, params, function(err, result){
        if(err){
            console.log(err)
            return res.json({message: 'Erro ao cadastrar usuário: ', err})
        };

        console.log(`${tipoUsuario} cadastrado!`);
        req.session.loggedin = true;
        req.session.email = email;

        let endpoint; 

        switch (tipoUsuario) {
            case 'aluno':
                endpoint = '/';
                req.session.plan = plano;
                req.session.usertype = 'alunos';
                console.log(`Email do usuário: ${req.session.email}\nPlano do usuário: ${req.session.plan}`)
                break;
                
            case 'professor':
                endpoint = '/homeProfessor';
                req.session.usertype = 'professores';
                console.log(`Email do usuário: ${req.session.email}\n`)
                break;
        }

        res.json({message: 'Cadastro efetuado!', rota: endpoint})
    });
});

app.post("/auth", (req, res) => {
    const {tipo, email, senha} = req.body
    
    let query, values;
    if(tipo === 'alunos'){
        query = 'select * from alunos where alEmail = ? and alSenha = ?;'
        values = [email, senha]
    }
    else if(tipo === 'professores'){
        query = 'select * from professores where prEmail = ? and prSenha = ?;'
        values = [email, senha]
    }
    else if(tipo === 'admins'){
        query = 'select * from admins where admEmail = ? and admSenha = ?;'
        values = [email, senha]
    }
    else {
        // tipo inválido
        return res.json({message: 'Tipo de usuário inválido!'});
    }
    db.query(query, values, function(err, results, fields){
        if(err){
            console.log(err)
            throw err;  
        }
        
        if(email && senha){
            if(results.length > 0){
                req.session.loggedin = true;
                req.session.email = email;

                if(tipo === 'alunos'){
                    req.session.plan = results.plano;
                }
                
                let endpoint;
                switch (tipo) {
                    case 'alunos':
                        endpoint = '/';
                        req.session.plan = results.plano;
                        req.session.usertype = 'alunos';
                        console.log(`Email do usuário: ${req.session.email}\nPlano do usuário: ${req.session.plan}\nTipo de usuário: ${req.session.usertype}`)
                        break;

                    case 'professores':
                        endpoint = '../HTML/professores/ProfessorPainel';
                        req.session.usertype = 'professores';
                        console.log(`Email do usuário: ${req.session.email}\nTipo de usuário: ${req.session.usertype}`)
                        break;

                    case 'admins':
                        endpoint = '../HTML/admins/Admin';
                        req.session.usertype = 'admins';
                        console.log(`Email do usuário: ${req.session.email}\nTipo de usuário: ${req.session.usertype}`)
                        break;
                }

                console.log(req.session.email);
                res.json({ok:true, rota: endpoint});
            }
            else{
                const msg = "E-mail e/ou senha incorreto(s)."
                res.json({message: msg});   
            }
        }
        else{
            const msg = 'Insira seu dados para login!'
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
        res.redirect('../HTML/login');
    }
})

app.get('/userInfo', (req, res) => {
    if (!req.session.loggedin) {
        return res.redirect('../HTML/login');
    }

    // Busca o tipo de usuário na sessão (ajuste conforme sua lógica de sessão)
    // Aqui, tentamos buscar primeiro em alunos, depois em professores
    db.query("select * from alunos where alEmail = ?", [req.session.email], function(err, results, fields){
        if(err) return res.status(500).json({error: 'Erro ao buscar aluno'});
        if(results.length > 0){
            return res.json(results);
        } else {
            // Se não for aluno, tenta buscar como professor
            db.query("select * from professores where prEmail = ?", [req.session.email], function(err2, results2, fields2){
                if(err2) return res.status(500).json({error: 'Erro ao buscar professor'});
                if(results2.length > 0){
                    return res.json(results2);
                } else {
                    // (Opcional) Buscar em admins
                    // db.query("select * from admins where adminEmail = ?", [req.session.email], function(err3, results3, fields3){ ... })
                    return res.status(404).json({error: 'Usuário não encontrado'});
                }
            });
        }
    });
});

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


    db.query('DELETE FROM users WHERE userEmail = ? AND userPassword = ?', [req.session.email, userPassword], async function(err, results) {
        if (!results.affectedRows || err ) {
            console.error('Erro ao deletar usuário:', err);
            return

        }
        console.log('User deletado')

        req.session.destroy((err) => {
            if(err){
                console.err('Erro ao destruir sessão: ', err)
            }
        })

      
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


app.post('/getCourseConclusion', (req,res) => {
    const {courseID} = req.body

    db.query('SELECT courseConcluded from courseUsers where courseID_FK = ? AND userEmail_FK = ?', [courseID, req.session.email], (err,results,fields) => {
        if(err) throw err;

        console.log(results);
        res.json(results);
    })
})

app.put('/postCourseConclusion', (req,res) => {
    const {courseID} = req.body

    db.query('update courseUsers set courseConcluded = 1 where userEmail_FK = ? and courseID_FK = ?', [req.session.email, courseID], (err,results,fields) => {
        if(err) throw err;

        console.log(results);
        res.json({message: 'Curso concluído com sucesso!'});
    })
})


app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'HTML', 'home.html'));
});

app.get('/loginScreen', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'HTML', 'login.html'));
});

app.get('/registerScreen', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'HTML', 'register.html'));
});

app.get('/perfil', (req, res) => {
    if(req.session.loggedin){
        res.sendFile(__dirname + '/public/HTML/perfil.html')
    }else{    
        res.sendFile(path.join(__dirname, 'HTML', 'login.html'))
    }
})

app.get('/sobre', (req, res) => {
    res.sendFile(__dirname + '/public/HTML/sobre.html')
})

app.get('/gitModules', function(req, res){
    res.sendFile(__dirname + '/public/HTML/Modules/modulesGit.html');
});

app.get('/htmlModules', function(req, res){
    res.sendFile(__dirname + '/public/HTML/Modules/modulesHtml.html');
});

app.get('/javaModules', function(req, res){
    res.sendFile(__dirname + '/public/HTML/Modules/modulesJava.html');
});

app.get('/Cursos', function(req, res){
    res.sendFile(__dirname + '/public/HTML/Cursos.html');
});

app.get('/CursoGithub', function(req, res){
    res.sendFile(__dirname + '/public/HTML/CursoGithub.html');
});

app.get('/Cursohtml', function(req, res){
    res.sendFile(__dirname + '/public/HTML/CursoHTML.html');
});

app.get('/CursoJS', function(req, res){
    res.sendFile(__dirname + '/public/HTML/CursoJavaScript.html');
});

app.get('/QGitHub', function(req, res){
    res.sendFile(__dirname + '/public/HTML/Question/CourseGit.html');
});

app.get('/QHTML', function(req, res){
    res.sendFile(__dirname + '/public/HTML/Question/CourseHtmlCss.html');
});

app.get('/QJS', function(req, res){
    res.sendFile(__dirname + '/public/HTML/Question/Coursejs.html');
});

app.get('/Certificado', function(req, res){
    res.sendFile(__dirname + '/public/HTML/Certificado.html');
});

app.get('/homeProfessor', (req, res) => {
    res.sendFile(__dirname + '/public/HTML/ProfessorPainel.html')
})

app.get('/mensagensProfessor', (req, res) => {
    res.sendFile(__dirname + '/public/HTML/ProfessorMensagens.html')
})

app.get('/conteudosProfessor', (req, res) => {
    res.sendFile(__dirname + '/public/HTML/ProfessorConteudos.html')
})

app.get('/turmasProfessor', (req, res) => {
    res.sendFile(__dirname + '/public/HTML/ProfessorTurmas.html')
})

// Middleware para proteger rotas de professores e alunos
function verifyTokenAndEntity(entity) {
    return function(req, res, next) {
        if (!req.session.loggedin || !req.session.email) {
            return res.redirect('/loginScreen');
        }
        // Verifica o tipo de usuário na sessão
        if (entity === 'professores') {
            // Checa se o email está na tabela professores
            const query = 'SELECT * FROM professores WHERE prEmail = ?';
            db.query(query, [req.session.email], function(err, results) {
                if (err || results.length === 0) {
                    return res.redirect('/loginScreen');
                }
                next();
            });
        } else if (entity === 'alunos') {
            // Checa se o email está na tabela alunos
            const query = 'SELECT * FROM alunos WHERE alEmail = ?';
            db.query(query, [req.session.email], function(err, results) {
                if (err || results.length === 0) {
                    return res.redirect('/loginScreen');
                }
                next();
            });
        } else {
            return res.redirect('/loginScreen');
        }
    }
}

const alunoRoutes = require('./routes/aluno');
const professorRoutes = require('./routes/professor');
const adminRoutes = require('./routes/admin');

// Disponibiliza a conexão do banco para middlewares
app.set('db', db);

// Usa as rotas organizadas
app.use('/aluno', alunoRoutes);
app.use('/professor', professorRoutes);
app.use('/admin', adminRoutes);

app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});