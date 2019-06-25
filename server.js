require('dotenv').config()
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
let helmet = require('helmet') // protection des vulnerabilites
let path = require('path')
let imageDownloadRouter = require('./api/routes/imageDownload')



// Set up mongoose connection
mongoose.connect('mongodb://' + process.env.DB_HOST + ':' + process.env.DB_PORT + '/' + process.env.DB_NAME, { useNewUrlParser: true });
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.Promise = global.Promise
// END


const app = express();


// Enable-cors frome https://enable-cors.org/server_expressjs.html
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use(helmet());
app.use(bodyParser.json());

require('./config/passport') //passpott require


app.use('/uploads', imageDownloadRouter)

const auth = require('./api/routes/auth')
app.use('/auth', auth)


const admin = require('./api/routes/admin')
app.use('/admin', admin)

const client = require('./api/routes/Agence')
app.use('/Agence', client)

const resto = require('./api/routes/Car')
app.use('/Car', resto)

// error handler
app.use(function (err, req, res, next) {
  console.log(err)
  if (err.name === 'UnauthorizedError') {
    return res.status(err.status).send({ code: err.status, message: 'you dont have permission to access'})
  }
  // render the error page
  res.status(err.status || 500)
  res.render('error')
})

app.listen(process.env.PORT, () => {
  console.log('server is running on port  ' + process.env.PORT);
})
