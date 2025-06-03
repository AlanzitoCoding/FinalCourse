const express = require('express');
const router = express.Router();

// Middleware de proteção
const verifyTokenAndEntity = require('../middlewares/verifyTokenAndEntity');

// Exemplo: rota do painel do professor
router.get('/painel', verifyTokenAndEntity('professores'), (req, res) => {
    res.sendFile(__dirname + '/../public/HTML/professores/ProfessorPainel.html');
});

// Exemplo: rota de mensagens do professor
router.get('/mensagens', verifyTokenAndEntity('professores'), (req, res) => {
    res.sendFile(__dirname + '/../public/HTML/professores/ProfessorMensagens.html');
});

// Outras rotas de professor podem ser adicionadas aqui

module.exports = router;
