import path from 'path' //needed for finding current directory
import multer from 'multer'
import express from 'express'

const router = express.Router()


const storage = multer.diskStorage({

        destination: function(req, file ,cb) {
            cb(null, 'uploads/')
        },
        filename: function(req, file, cb) {
            cb(
                null,
                `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
              ); // Set the file name with timestamp)
        },
    


})



// check file type to prevent uploading of unwanted files
function checkFileType(file, cb){
    //allowed formats using regular exp
    const fileTypes = /jpg|jpeg|png/
    const extname = fileTypes.test(path.extname(file.originalname).toLowerCase())
    //returns true or false
    const mimetype = fileTypes.test(file.mimetype)
    //returns true or false

    if(extname && mimetype){
        return cb(null, true)
        //error = null and 2nd params returns true
    }else {
        cb({message: 'Images only!'})
        //no 2nd params, so here error is returned
    }

}

const upload = multer({
    storage: storage,
})

// app.use(express.json)
// const __dirname = path.resolve()
// app.use('/', express.static(path.join(__dirname, '/uploads')));

//here upload.single() middleware from multer does the work of upload
//and our res.send() sends success response

router.post('/', upload.single('image'), (req, res) => {
    if(req.file){

        //file was uploaded successfully

        //use path.jon to normalize the file path with forward slashes
        const imagePath = path.join('/', req.file.path)

        res.send({
            message: 'Image uploaded successfully',
            image: imagePath,
      
          });

          console.log(req.file)

    }else {
        //handle file upload error
        res.status(500).send({message: "File upload Error" })
    }

  });



// router.post('/', (req,res) => {
//     res.send({
//         message: 'image uploaded',
//         image: '/images/image',
//     })

// })

export default router