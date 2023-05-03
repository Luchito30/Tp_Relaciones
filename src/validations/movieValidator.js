const {check} = require("express-validator");

module.exports = [
    check("title")
        .notEmpty().withMessage("Debe ingresar el titulo de la Pelicula").bail()
        .isLength({min:1,max:80}).withMessage("El titulo debe tener entre 1 y 80 caracteres"),

    check("rating")
        .notEmpty().withMessage("Debe ingresar el Rating").bail()
        .isDecimal({min:1,max:10}).withMessage("Debe ingresar del 1 al 10"),

    check("awards")
        .notEmpty().withMessage("Debe ingresar Premios"),

    check("release_date")
        .notEmpty().withMessage("Debe ingresar la fecha de estreno"),

    check("length")
        .notEmpty().withMessage("Debe ingresar la Duracion")
        .isDecimal().withMessage("Deve ingresar solo numeros"),

    check("genre_id")
    .notEmpty().withMessage("Debe seleccionar un genero")
        


]