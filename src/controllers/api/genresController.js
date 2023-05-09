const db = require('../../database/models')
const sequelize = db.sequelize;


const genresController = {
    'list': async (req, res) => {

        try {
            const genres = await db.Genre.findAll()

            return res.status(200).json({
                ok : true,
                meta : {
                    status: 200,
                    total : genres.length,
                    url : 'api/genres'
                },
                data : genres
            })

        } catch (error) {
            console.log(error);
            return res.status(500).json({
                msg : error.message
            })
        }
    },
    'detail': async (req, res) => {

         try {
            const {id} = req.params
            
             const genre = await db.Genre.findByPk(req.params.id)

            return res.status(200).json({
                ok : true,
                meta : {
                    status: 200,
                    total : 1,
                    url : `api/genres/${id}`
                },
                data : genre
            })
        } catch (error) {
            console.log(error);
            return res.status(500).json({
                msg : error.message
            })
        }
    }

}

module.exports = genresController;