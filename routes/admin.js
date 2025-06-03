const express = require('express');
const router = express.Router();

// Middleware de proteção
const verifyTokenAndEntity = require('../middlewares/verifyTokenAndEntity');

// Exemplo: rota do painel admin
router.get('/painel', verifyTokenAndEntity('admins'), (req, res) => {
    res.sendFile(__dirname + '/../public/HTML/Admin.html');
});

// Outras rotas de admin podem ser adicionadas aqui

module.exports = router;
