const multer = require('multer');
const path = require('path');

const storagemovieImages = multer.diskStorage({
    destination : function(req,file,callback){
        callback(null,'public/img/Movies')
    },
    filename : function(req,file,callback){
        callback(null,`${"img-" + Date.now()}${path.extname(file.originalname)}`)
    }
});

const uploadmovieImages = multer({
    storage : storagemovieImages,
    fileFilter: (req, file, cb) => {
        if(!file.originalname.match(/\.(jpg|jpeg|png|gif|webp)$/)){
            req.fileValidationError = "Solo se permite imágenes";
            return cb(null,false,req.fileValidationError);
        }
    
        cb(null, true)
      }
});

module.exports = {
    uploadmovieImages
}