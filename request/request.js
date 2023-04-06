const express = require('express')
const router = express.Router()

module.exports = (colours) => {
    // get all colours
    router.get('/', (req, res) => {
        if(colours !== 'undefined') {
            res.status(200).send(colours)
        }else {
            res.status(201).send('Can not find colours')
        }
    });

    // get colour by colourId
    router.get('/:colourID', (req, res) => {
        const colourID = parseInt(req.params.colourID);
        const colour = colours.find((colour) => colour.colorId === colourID)

        if(colour) {
            res.status(200).send(colour)
        }else {
            res.status(204).send('Can not find this colour')
        }
    });

    // create a new colour
    router.post('/', (req, res) => {
        const colorId = colour.length + 1;
        const hexString = req.body.hexString;
        const rgb = req.body.rgb;
        const hsl = req.body.year;
        const name = req.body.name;

        colours.push({ colorId: colorId, hexString: hexString, rgb: rgb, hsl: hsl, name: name });

        res.status(201).send('Colour created successfully');
    });

    // update a colour
    router.put('/:id', (req, res) => {
        const id = parseInt(req.params.id);
        const colour = colours.find((colour) => colour.id === id);

        colour.hexString = req.body.hexString;
        colour.rgb = req.body.rgb;
        colour.hsl = req.body.year;
        colour.name = req.body.name;

        res.status(200).send('Colour updated successfully');
    });

    // delete a colour by colourId
    router.delete('/:id', (req, res) => {
        const id = parseInt(req.params.id);
        const colourIndex = colours.findIndex((colour) => colour.id === id);

        if(colourIndex >= 0) {
            colours.splice(colourIndex, 1);
            res.status(200).send('Colour deleted successfully');
        } else {
            res.status(204).send('Can not find this colour');
        }
    });

    // invalid delete
    router.delete('/', (req, res) => {
        res.status(400).send('Invalid request');
    });

    return router;
};