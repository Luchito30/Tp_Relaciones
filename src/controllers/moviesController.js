const path = require('path');
const db = require('../database/models');
const sequelize = db.sequelize;
const { Op } = require("sequelize");


//Aqui tienen una forma de llamar a cada uno de los modelos
// const {Movies,Genres,Actor} = require('../database/models');

//Aquí tienen otra forma de llamar a los modelos creados
const Movies = db.Movie;
const Genres = db.Genre;
const Actors = db.Actor;


const moviesController = {
    list: (req, res) => {
        db.Movie.findAll({
            order: [["title","ASC"]]
        })
            .then(movies => {
                res.render('moviesList.ejs', {
                    movies,
                    title: "PELÍCULAS"
                })
            })
    },
    detail: (req, res) => {
        db.Movie.findByPk(req.params.id,{
            include : ["genre","actors"]
        })
            .then(movie => {
                res.render('moviesDetail', {
                    title: "Detalle Pelicula",
                    movie:{
                        ...movie.dataValues,
                        release_date : movie.release_date.toISOString().split('T')[0]
                    }
                   
                });
            }).catch(error => console.log(error));
    },
    new: (req, res) => {
        db.Movie.findAll({
          order : [
            ['release_date', 'DESC']
          ],
        })
        .then(movies => {
          const formattedMovies = movies.map(movie => {
            const releaseDate = new Date(movie.release_date);
            const formattedReleaseDate = releaseDate.toLocaleDateString('es-AR');
            return {
              ...movie.dataValues,
              release_date: formattedReleaseDate
            };
          });
          return res.render('newestMovies', {
            movies: formattedMovies,
            title: "Peliculas por Fecha"
          });
        })
        .catch(error => console.log(error))
      },
    recomended: (req, res) => {
        db.Movie.findAll({
            where: {
                rating: {[db.Sequelize.Op.gte] : 8}
            },
            order: [
                ['rating', 'DESC']
            ]
        })
            .then(movies => {
                res.render('recommendedMovies.ejs', {
                    movies,
                    title: "Ranking"
                });
            });
    },
    search: (req, res) => {
        const { Pelicula } = req.query;
        db.Movie.findAll({
          where: {
              title: {
              [Op.like] : `%${Pelicula}%`
            }}
        })
        .then(movies => {
            res.render('moviesList.ejs', {
                movies,
                title: "PELÍCULAS",
                Pelicula
          });
        }).catch(error => console.log(error)) 
      },
    add: function (req, res) {
        const allGenres = db.Genre.findAll()

        Promise.all([allGenres])
            .then(([allGenres])=>{
                return res.render('moviesAdd',{allGenres})
            })
            .catch(error => console.log(error))
    },
    create: function (req,res) {
        db.Movie.create(
            {...req.body}
        )
        .then(() => res.redirect(`/movies`))
        .catch((error) => console.log(error))
    },
    edit: function(req,res) {
        const movie = db.Movie.findByPk(req.params.id)
        const allGenres = db.Genre.findAll()

        Promise.all([movie,allGenres])
            .then(([movie,allGenres])=>{
                return res.render('moviesEdit',{
                    Movie : {
                        ...movie.dataValues,
                        release_date : movie.release_date.toISOString().split('T')[0]
                    },
                    allGenres
                })
            })
            .catch(error => console.log(error))
        
    },
    update: function (req,res) {
        db.Movie.update(
            {
                ...req.body
            },
            {
                where : {
                    id : req.params.id
                }
            }
        ).then(() => res.redirect(`/movies/detail/${req.params.id}`))
        .catch((error) => console.log(error))
    },
    delete: function (req,res) {
        db.Movie.findByPk(req.params.id)
            .then(movie => {
                res.render('moviesDelete', {Movie:movie});
            })
            .catch((error) => console.log(error))
    },
    destroy: function (req,res) {
        db.Movie.destroy(
            {
                where : {
                    id : req.params.id
                }
            }
        ).then(() => res.redirect(`/movies`))
        .catch((error) => console.log(error))
    }
}

module.exports = moviesController;