// Importing Express, our web framework:
const express = require('express');

// Instantiating the Express app:
const app = express();

// ejs: embedded javascript templating
// body-parser: node middleware that can parse incoming request bodies
// pg-promise: a PostgreSQL database interface

/* Routes refer to how an application responds to a client request to a particular endpoint,
which is a URI (or path) and a specific HTTP request method (GET, POST, and so on). */

// Setting view directory and engine:
app.set('view engine', 'ejs');
app.set('views', `${__dirname}/views`);

// Check for a Heroku port or use 3000:
app.set('port', process.env.PORT || 3000);

app.get('/', (req, res) => {
  res.send('index');
});

app.post('/shorten', (req, res) => {
  res.send('Submit here');
});

app.get('/:key', (req, res) => {
  res.send(`Your key was: ${req.key}`);
});

app.listen(app.get('port'));
