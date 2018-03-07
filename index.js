// Importing Express, our web framework:
const express = require('express');

// Import random-key
// Random-Key Package (Used for generating a random key for each new URL)
const random = require('random-key');

// Import pg-promise, a PostgreSQL database interface
const pg = require('pg-promise')();

// Import body-parser: node middleware that can parse POSTed form data:
const bodyParser = require('body-parser');

// Instantiating the Express app:
const app = express();

// Passing database credentials to pg:
const db = pg(process.env.DATABASE_URL || 'postgres://psql:psql@localhost');

app.use(bodyParser.urlencoded({ extended: false }));

/* Routes refer to how an application responds to a client request to a particular endpoint,
which is a URI (or path) and a specific HTTP request method (GET, POST, and so on). */

// Setting view directory and engine:
// ejs: embedded javascript templating
app.set('view engine', 'ejs');
app.set('views', `${__dirname}/views`);

// Check for a Heroku port or use 3000:
app.set('port', process.env.PORT || 3000);

app.get('/', (req, res) => {
  res.send('index');
});

app.post('/shorten', (req, res) => {
  const url = req.body.url;
  const key = random.generate(6);

  // check that URL has been submitted
  if (typeof url === 'undefined') {
    res.redirect('/');
  }

  // insert the new record, render view with link
  db.none('insert into entry(key, url) values($1, $2)', [key, url]).then((data) => {
    res.render('shorten', { link: `${req.headers.origin}/${key}` });
  });
});

app.get('/:key', (req, res) => {
  res.send(`Your key was: ${req.key}`);
});

app.listen(app.get('port'));
