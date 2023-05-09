const express = require('express');
const router = express.Router();
const genresController = require('../../controllers/api/genresController');

/* /api */
router.get('/genres', genresController.list);
router.get('/genres/:id', genresController.detail);


module.exports = router;