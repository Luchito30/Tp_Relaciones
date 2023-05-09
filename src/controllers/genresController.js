const db = require('../database/models');
const sequelize = db.sequelize;


const genresController = {
    'list': (req, res) => {
        db.Genre.findAll()
            .then(genres => {
                res.render('genresList.ejs', {
                    genres,
                    title: "Generos"
                })
            }) .catch((error) => console.log(error));
    },
    'detail': (req, res) => {
        db.Genre.findByPk(req.params.id,{
            include: ['movies']
        })
            .then(genre => {
                res.render('genresDetail.ejs', {
                    genre,
                    title:"Detalle Genero"
                });
            }) .catch((error) => console.log(error));
    }

}

module.exports = genresController;