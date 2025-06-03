// Middleware para proteger rotas de professores, alunos e admins
function verifyTokenAndEntity(entity) {
    return function(req, res, next) {
        if (!req.session.loggedin || !req.session.email) {
            return res.redirect('/loginScreen');
        }
        let query;
        if (entity === 'professores') {
            query = 'SELECT * FROM professores WHERE prEmail = ?';
        } else if (entity === 'alunos') {
            query = 'SELECT * FROM alunos WHERE alEmail = ?';
        } else if (entity === 'admins') {
            query = 'SELECT * FROM admins WHERE adminEmail = ?';
        } else {
            return res.redirect('/loginScreen');
        }
        req.app.get('db').query(query, [req.session.email], function(err, results) {
            if (err || results.length === 0) {
                return res.redirect('/loginScreen');
            }
            next();
        });
    }
}

module.exports = verifyTokenAndEntity;
