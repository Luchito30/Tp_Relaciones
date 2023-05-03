const express = require('express');
const router = express.Router();
const {add,create,destroy,detail,edit,list,recomended,search,update,borrado,newer} = require('../controllers/moviesController');
const { uploadmovieImages } = require('../middlewares/upload');


router.get('/movies',list);
router.get('/search',search);
router.get('/movies/new',newer);
router.get('/movies/recommended',recomended);
router.get('/movies/detail/:id',detail);
//Rutas exigidas para la creación del CRUD
router.get('/movies/add',add);
router.post('/movies/create',uploadmovieImages.single("image"),create);
router.get('/movies/edit/:id',edit);
router.put('/movies/update/:id',update);
router.get('/movies/delete/:id',borrado);
router.delete('/movies/delete/:id',destroy);

module.exports = router;