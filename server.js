const dotenv = require('dotenv')
const path = require('path');
const express = require('express');
const bird_router = require('./routers/bird_router');
const image_router = require('./routers/image_router');
// const Message = require('./models/dbSchema')
const fileUpload = require('express-fileupload');


/* load .env */
dotenv.config();

/* create Express app *///
const app = express();

/* setup Express middleware */
app.use('/', express.static(path.resolve(__dirname, 'public')));

// Pug for SSR (static site rendering)
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// TODO: middleware for parsing POST body
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }))

// default options
app.use(fileUpload());

app.post('/upload', function (req, res) {
    let sampleFile;
    let uploadPath;

    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send('No files were uploaded.');
    }

    // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
    sampleFile = req.files.sampleFile;
    uploadPath = __dirname + '/somewhere/on/your/server/' + sampleFile.name;

    // Use the mv() method to place the file somewhere on your server
    sampleFile.mv(uploadPath, function (err) {
        if (err)
            return res.status(500).send(err);

        res.send('File uploaded!');
    });
});

/* host static resources (.css, .js, ...) */
app.use('/images/', image_router);
app.use('/', express.static(path.resolve(__dirname, 'public/')));

/* redirect root route `/` to `/birds/` */
app.get('/', (req, res) => {
    res.redirect('/birds/');
});

app.use('/birds/', bird_router);

//404 Error 
app.get('*', (request, response) => {
    response.status(404)
    response.sendFile(path.resolve(__dirname, 'public/404.html'));
});

// TODO: connect to a database
const mongoose = require("mongoose");
const user = process.env.ATLAS_USER;
const password = process.env.ATLAS_PASSWORD;
const db_url = `mongodb+srv://${user}:${password}@cluster0.caycfd1.mongodb.net/assignment2`
const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}
mongoose.connect(db_url, options).then(() => {
    console.log('successfully connected!')
}).catch((e) => {
    console.error(e, 'could not connect!')
});

/* start the server */
const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server is live http://localhost:${PORT}`);
});
