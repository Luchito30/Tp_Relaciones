const express = require('express');
const router = express.Router();
const {create,destroy,detail,list,update} = require('../../controllers/api/moviesController');


/* /api */
router.get('/movies', list);
router.get('/movies/:id',detail);
//Rutas exigidas para la creación del CRUD
router.post('/movies/create',create);
router.put('/movies/update/:id',update);
router.delete('/movies/delete/:id',destroy);

module.exports = router;