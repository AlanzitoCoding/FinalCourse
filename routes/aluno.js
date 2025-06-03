const express = require('express');
const router = express.Router();

// Middleware de proteção
const verifyTokenAndEntity = require('../middlewares/verifyTokenAndEntity');

// Exemplo: rota de perfil do aluno
router.get('/perfil', verifyTokenAndEntity('alunos'), (req, res) => {
    res.sendFile(__dirname + '/../public/HTML/alunos/perfil.html');
});

// Exemplo: rota de cursos do aluno
router.get('/cursos', verifyTokenAndEntity('alunos'), (req, res) => {
    res.sendFile(__dirname + '/../public/HTML/alunos/Cursos.html');
});

// Outras rotas de aluno podem ser adicionadas aqui

module.exports = router;
