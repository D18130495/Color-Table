// Import required modules
const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const colourRequest = require('./request/request');

// Create an instance of Express app
const app = express();

// Configure middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/'));

// Load the colours.json file
let colours = JSON.parse(fs.readFileSync('./json/colours.json', 'utf8'));

// Define routes
// get all colours
app.get('/colours', (req, res) => {
  if(colours !== 'undefined') {
    res.status(200).send(colours)
  }else {
    res.status(201).send('Can not find colours')
  }
});

// get colour by colourId
app.get('/colours/:colourID', (req, res) => {
  const colourID = parseInt(req.params.colourID);
  const colour = colours.find((colour) => colour.colorId === colourID);
  
  if(colour) {
    res.status(200).send(colour)
  }else {
    res.status(204).send('Can not find this colour')
  }
});

// create a new colour
app.post('/colours', (req, res) => {
  const colorId = colorId.length + 1;
  const hexString = req.body.hexString;
  const rgb = req.body.rgb;
  const hsl = req.body.year;
  const name = req.body.name;

  colours.push({ colorId: colorId, hexString: hexString, rgb: rgb, hsl: hsl, name: name });

});

// update a colour
app.put('/colours/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const colour = colours.find((colour) => colour.id === id);

  colour.hexString = req.body.hexString;
  colour.rgb = req.body.rgb;
  colour.hsl = req.body.year;
  colour.name = req.body.name;

});

// delete a colour by colourId
app.delete('/colours/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const colour = colours.find((colour) => colour.id === id);

});

// invalid delete
app.delete('/colours', (req, res) => {
  
});

// Custom 404 page
app.use((req, res, next) => {
  res.status(404).sendFile('404.html', { root: 'public' });
});

// Start the server
app.listen(9000, () => {
  console.log('Server listening on port 9000');
});