const express = require('express');
const logger = require('morgan');
const bodyParser = require('body-parser');
const passport = require('passport');
const pe = require('parse-error');
const cors = require('cors');
const path = require('path');
const helmet = require('helmet')

const chargebee = require("chargebee");

const CONFIG = require('./config/config');
const validateEnv = require('./config/validateEnv');
validateEnv();

const v1 = require('./routes/v1');
const superAdminV1 = require('./routes/superadminv1');
const studentV1 = require('./routes/studentv1');
const studentV1Enterprise = require('./routes/studentv1_enterprise');
const generalV1 = require('./routes/generalapi');
const website = require('./routes/website');

const GeneralController = require('./controllers/V1/General/General.controller')
const errorHandler = require('./middleware/errorHandler');

const app = express();
const formidableMiddleware = require('express-formidable');


app.use(logger('dev'));
app.use(function (req, res, next) {

  if (req.get('x-amz-sns-message-type')) {
    req.headers['content-type'] = 'application/json';
  }
  next();
});

app.use(formidableMiddleware({ maxFileSize: 5120 * 1024 * 1024 })); // 5GB
app.use(express.static(__dirname + '/public'))
// app.use('/zoomCss', express.static(__dirname + '/node_modules/@zoomus/websdk/dist/css/'));
// app.use('/js', express.static(__dirname + '/javascript/'));
// app.use('/jquery', express.static(__dirname + '/node_modules/jquery/dist/'));

//Passport
app.use(passport.initialize());

//Set View Engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug')
app.engine('pug', require('pug').__express)

app.use(helmet())
// app.disable('x-powered-by');

//Log Env
console.log("Environment:", CONFIG.app)

//DATABASE
const models = require("./models");
const { error } = require('util');

models.sequelize.authenticate().then(() => {
  console.log('Connected to SQL database:', CONFIG.db_name);
})
  .catch(err => {
    console.log('Unable to connect to SQL database:', CONFIG.db_name, err);
  });

if (CONFIG.app === 'dev') {
  models.sequelize.sync();//creates table if they do not already exist
}


// CORS
app.use(cors());

if (CONFIG.port == 3000) {

  app.use(function (req, res, next) {
    if (req.hostname == 'api.example.com') {

      next()

    } else {

      res.redirect('https://example.com');
    }
  });
}



app.use('/v1/institute', v1);
app.use('/v1/admin', superAdminV1);
app.use('/v1/student', studentV1);
app.use('/v1/studentEnterprise', studentV1Enterprise);
app.use('/v1/website', website);
app.use('/v1', generalV1);


// Chargebee Webhook Integration
app.use('/renewSubscription', async (req, res) => {
  chargebee.configure({
    site: CONFIG.chargebeesite,
    api_key: CONFIG.chargebeeapikey
  })
  let data = res.req.fields;

  let renvData = await GeneralController.renewSubscription(req, res, data);
  res.json({ status: true, message: 'Subscription renewed', data: data });
});


// catch 404
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// Centralized error handler (must be last middleware)
app.use(errorHandler);

module.exports = app;

//This is here to handle all the uncaught promise rejections
process.on('unhandledRejection', error => {

  console.error(error);
  // console.error('Uncaught Error', pe(error));
});