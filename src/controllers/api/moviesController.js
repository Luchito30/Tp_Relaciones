const path = require("path");
const db = require("../../database/models");
const sequelize = db.sequelize;
const { Op } = require("sequelize");
const moment = require("moment");

//Aqui tienen otra forma de llamar a cada uno de los modelos
const Movies = db.Movie;

const moviesController = {
  list: async (req, res) => {
    try {
      const moviesAll = await db.Movie.findAll({
          include: [
                     {
                      association: "genre",
                      attributes: ["name"],
                    }
          ] 
        });

      return res.status(200).json({
        ok: true,
        meta: {
          status: 200,
          total: moviesAll.length,
          url: "api/movies",
        },
        data: moviesAll,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        msg: error.message,
      });
    }
  },
  detail: async (req, res) => {
    try {
      const { id } = req.params;

      const movieDetail = await db.Movie.findByPk(req.params.id, {
        include: [
          {
            association: "genre",
            attributes: ["name"],
          },
          {
            association: "actors",
            attributes: ["first_name","last_name"],
          }
        ] 
      });

      return res.status(200).json({
        ok: true,
        meta: {
          status: 200,
          total: 1,
          url: `/api/movies/${id}`,
        },
        data: movieDetail,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        msg: error.message,
      });
    }
  },
  create: async function (req, res) {
    try {
      const { title, rating, awards, release_date, length, genre_id } = req.body;

      const movienow = await Movies.create({
        title: title,
        rating: rating,
        awards: awards,
        release_date: release_date,
        length: length,
        genre_id: genre_id,
      });
      return res.status(200).json({
        ok: true,
        meta: {
          status: 200,
          total: 1,
          url: `/api/movies/${movienow.id}`,
        },
        data: movienow,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        msg: error.message,
      });
    }
  },
  update: async function (req, res) {
    try {
      const {id} = req.params;
      const { title, rating, awards, release_date, length, genre_id } = req.body;

      const movie = await db.Movie.findByPk(id);

      movie.title = title;
      movie.rating = rating;
      movie.awards = awards;
      movie.release_date = release_date;
      movie.length = length;
      movie.genre_id = genre_id;

      await movie.save();

      res.status(200).json({
        ok: true,
        meta: {
          status: 200,
          total: 1,
          url: `/api/movies/${id}`,
        },
        data: movie,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        msg: error.message,
      });
    }
  },
  destroy: async function (req, res) {
    try {
      let {id} = req.params;

      const movie = await db.Movie.findByPk(id);

      await movie.destroy()

      res.status(200).json({
        ok: true,
        meta: {
          status: 200,
          total: 1,
          eliminated: true,
        },
        data: movie,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        msg: error.message,
      });
    }
  },
};

module.exports = moviesController;
