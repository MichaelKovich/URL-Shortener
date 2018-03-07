// Import Express, our web framework:
const express = require('express');

// Import body-parser, node middleware that can parse POSTed form data:
const bodyParser = require('body-parser');

// Import random-key, a package used for generating a random key for each new URL:
const random = require('random-key');

// Import pg-promise, a PostgreSQL database interface
const pg = require('pg-promise')();

// Instantiating the Express app:
const app = express();

// Passing database credentials to pg:
const db = pg(process.env.DATABASE_URL || 'postgres://psql:psql@localhost');

// Setting view directory and engine:
// ejs: embedded javascript templating
app.set('view engine', 'ejs');
app.set('views', `${__dirname}/views`);

// Telling Express where our static files are located so it can serve them to the user:
app.use(express.static(`${__dirname}/public`));

// More details here: https://github.com/expressjs/body-parser
app.use(bodyParser.urlencoded({extended: false}));

/* Routes refer to how an application responds to a client request to a particular endpoint,
which is a URI (or path) and a specific HTTP request method (GET, POST, and so on). */

// Check for a Heroku port or use 3000:
app.set('port', process.env.PORT || 3000);

app.get('/', (req, res) => {
  res.render('index');
});

app.post('/shorten', (req, res) => {
  // Grab the URL from the body of the request:
  const {url} = req.body;
  // Generate a random key using the random-key package:
  const key = random.generate(6);

  // Check that a URL has been submitted, otherwise redirect to /:
  if (typeof url === 'undefined') {
    res.redirect('/');
  }

  // Insert a new record into the database.
  // None indicates that we are not expecting any rows to be returned.
  // Content between () is simply a SQL query:
  db.none('insert into entry(key, url) values($1, $2)', [key, url]).then((data) => {
    // Add comments here.
    res.render('shorten', {link: `${req.headers.origin}/${key}`});
  });
});

app.get('/:key', (req, res) => {
  // Check for a key and then redirect the user:
  db
    // one indicates that we're expecting a record to be returned
    .one('select * from entry where key = $1', req.params.key)
    .then((entry) => {
      // redirect to the appropriate url
      res.redirect(entry.url);
    })
    .catch(() => {
      // if no entry found, redirect home
      res.redirect('/');
    });
});

// Listen on the port defined above.
app.listen(app.get('port'));
