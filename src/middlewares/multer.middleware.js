import multer from './multer';


// this get the file 
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "./public/temp");
    },
    filename: function (req, file, cb) {
      const uniquesuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      console.log(file);
      cb(null, Date.now() + '-' + file.originalname + uniquesuffix);
    }
});


export const upload = multer({storage});