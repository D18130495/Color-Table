// Import required modules
const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const colourRouter = require('./utils/router');

// Create an instance of Express app
const app = express();

// Configure middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/'));

// Load the colours.json file
let colours = JSON.parse(fs.readFileSync('./json/colours.json', 'utf8'));

// Define routes using separate module
app.use('/colours', colourRouter(colours));

// Custom 404 page
app.use((req, res, next) => {
  res.status(404).sendFile('404.html', { root: 'public' });
});

// Start the server
app.listen(9000, () => {
  console.log('Server listening on port 9000');
});