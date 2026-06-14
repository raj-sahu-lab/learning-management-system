/**
 * testApp.js
 * Builds a minimal Express app suitable for supertest — no real DB, no CronJob side effects.
 * Models and config are already mocked via __tests__/setup.js (loaded by Jest).
 */

const express = require('express');
const passport = require('passport');
const bodyParser = require('body-parser');

// Build app
const app = express();

// Parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Fake req.fields so controllers using express-formidable still work
app.use((req, res, next) => {
  req.fields = req.body || {};
  next();
});

// Passport init
app.use(passport.initialize());

// Mount institute routes
const v1 = require('../../routes/v1');
app.use('/v1/institute', v1);

// Mount general routes
const generalV1 = require('../../routes/generalapi');
app.use('/v1', generalV1);

// 404 catch-all
app.use((req, res) => {
  res.status(404).json({ status: false, message: 'Not found' });
});

// Error handler
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({ status: false, message: err.message || 'Error' });
});

module.exports = app;
