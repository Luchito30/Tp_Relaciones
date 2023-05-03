const path = require("path");
const { validationResult } = require("express-validator");
const db = require("../database/models");
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
            order: [["title", "ASC"]],
        }).then((movies) => {
            res.render("moviesList.ejs", {
                movies,
                title: "PELÍCULAS",
            });
        });
    },
    detail: (req, res) => {
        db.Movie.findByPk(req.params.id, {
            include: ["genre", "actors"],
        })
            .then((movie) => {
                res.render("moviesDetail", {
                    title: "Detalle Pelicula",
                    movie: {
                        ...movie.dataValues,
                        release_date: movie.release_date.toISOString().split("T")[0],
                    },
                });
            })
            .catch((error) => console.log(error));
    },
    newer: (req, res) => {
        db.Movie.findAll({
            order: [["release_date", "DESC"]],
        })
            .then((movies) => {
                const formattedMovies = movies.map((movie) => {
                    const releaseDate = new Date(movie.release_date);
                    const formattedReleaseDate = releaseDate.toLocaleDateString("es-AR");
                    return {
                        ...movie.dataValues,
                        release_date: formattedReleaseDate,
                    };
                });
                return res.render("newestMovies", {
                    movies: formattedMovies,
                    title: "Peliculas por Fecha",
                });
            })
            .catch((error) => console.log(error));
    },
    recomended: (req, res) => {
        db.Movie.findAll({
            where: {
                rating: { [db.Sequelize.Op.gte]: 8 },
            },
            order: [["rating", "DESC"]],
        }).then((movies) => {
            res.render("recommendedMovies.ejs", {
                movies,
                title: "Ranking",
            });
        });
    },
    search: (req, res) => {
        const { Pelicula } = req.query;
        db.Movie.findAll({
            where: {
                title: {
                    [Op.like]: `%${Pelicula}%`,
                },
            },
        })
            .then((movies) => {
                res.render("moviesList.ejs", {
                    movies,
                    title: "PELÍCULAS",
                    Pelicula,
                });
            })
            .catch((error) => console.log(error));
    },
    add: function (req, res) {
        const allGenres = db.Genre.findAll();

        Promise.all([allGenres])
            .then(([allGenres]) => {
                return res.render("moviesAdd", {
                    allGenres,
                    title: "Agregar pelicula",
                });
            })
            .catch((error) => console.log(error));
    },
    create: function (req, res) {
        const errors = validationResult(req);

        if (req.fileValidationError) {
            errors.errors.push({
              value: "",
              msg: req.fileValidationError,
              param: "image",
              location: "files",
            });
          }
      
          if (errors.isEmpty()) {

        const { title, rating, awards, release_date, length, genre_id } = req.body;
        const image = req.file.filename;
        db.Movie.create({
            title: title.trim(),
            rating,
            awards,
            release_date,
            length,
            image: image,
            genre_id,
        })
            .then((movie) => res.redirect(`/movies`))
            .catch((error) => console.log(error));
        }else{

              const allGenres = db.Genre.findAll();

        Promise.all([allGenres])
            .then(([allGenres]) => {
                return res.render("moviesAdd", {
                    allGenres,
                    title: "Agregar pelicula",
                    errors: errors.mapped(),
                    old: req.body
                });
            })
            .catch((error) => console.log(error));
        }
    },
    edit: function (req, res) {
        const movie = db.Movie.findByPk(req.params.id);
        const allGenres = db.Genre.findAll();

        Promise.all([movie, allGenres])
            .then(([movie, allGenres]) => {
                return res.render("moviesEdit", {
                    Movie: {
                        ...movie.dataValues,
                        release_date: movie.release_date.toISOString().split("T")[0],
                    },
                    allGenres,
                    title: "Edicion",
                });
            })
            .catch((error) => console.log(error));
    },
    update: function (req, res) {
        const errors = validationResult(req);

        if (req.fileValidationError) {
            errors.errors.push({
                value: "",
                msg: req.fileValidationError,
                param: "image",
                location: "files",
            });
        }

        if (errors.isEmpty()) {
            const { id } = req.params;
            const { title, rating, awards, release_date, length, genre_id } = req.body;

            db.Movie.findByPk(id)
                .then((movie) => {
                    if (movie) {
                        let image = movie.image;
                        if (req.file) {
                            image = req.file.filename;
                        }

                        db.Movie.update(
                            {
                                title,
                                rating,
                                awards,
                                release_date,
                                length,
                                genre_id,
                                image,
                            },
                            {
                                where: {
                                    id,
                                },
                            }
                        )
                            .then(() => {
                                res.redirect(`/movies/detail/${id}`);
                            })
                            .catch((error) => console.log(error));
                    }
                }).catch((error) => console.log(error));
        } else {
            const { id } = req.params;


            const movie = db.Movie.findByPk(id);
            const allGenres = db.Genre.findAll();

            Promise.all([movie, allGenres])
                .then(([movie, allGenres]) => {
                    return res.render("moviesEdit", {
                        Movie: {
                            ...movie.dataValues,
                            release_date: movie.release_date.toISOString().split("T")[0],
                        },
                        allGenres,
                        title: "Edicion",
                        errors: errors.mapped(),
                        old: req.body,
                    });
                })
                .catch((error) => console.log(error));
        }
    },
    borrado: function (req, res) {
        db.Movie.findByPk(req.params.id)
            .then((movie) => {
                res.render("moviesDelete", {
                    Movie: movie,
                    title: "Advertencia",
                });
            })
            .catch((error) => console.log(error));
    },
    destroy: function (req, res) {
        db.Movie.destroy({
            where: {
                id: req.params.id,
            },
        })
            .then(() => res.redirect(`/movies`))
            .catch((error) => console.log(error));
    },
};

module.exports = moviesController;
