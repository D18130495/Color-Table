const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();
const fs = require("fs");
const validator = require("./validator");

router.use(bodyParser.json());

// Custom return result
function customResult(req, res, next) {
    res.result = function(status, data, message, statusName) {
      res.send({ status: status, data: data, message: message, statusName: statusName });
    }
    
    next();
}

const status = {
    SUCCESS: {
        status: 200,
        statusName: "success"
    },
    SERVER_ERROR: {
        status: 201,
        statusName: "Server error"
    },
    RESOURCE_NOT_FOUND: {
        status: 204,
        statusName: "Resource not found"
    },
    INVALID_ID: {
        status: 210,
        statusName: "Invalid id"
    },
    BAD_REQUEST: {
        status: 400,
        statusName: "Bad request"
    }
}
  
router.use(customResult);

module.exports = (colours) => {
    // get all colours
    router.get('/colours', (req, res) => {
        if(colours !== 'undefined') {
            res.result(status.SUCCESS.status, colours, 'Successfully get colour list', status.SUCCESS.statusName);
        }else {
            res.result(status.RESOURCE_NOT_FOUND.status, null, 'Can not find colour list', status.RESOURCE_NOT_FOUND.statusName);
        }
    });

    // get colour by colourId
    router.get('/colours/:colourId', (req, res) => {
        // check valid id
        if(!validator.idValidator(req.params.id)) {
            res.result(status.INVALID_ID.status, null, 'Colour id is invalid', status.INVALID_ID.statusName);
            return;
        }

        // get colour
        const colourId = parseInt(req.params.colourId);
        const colour = colours.find((colour) => colour.colorId === colourId);

        if(colour) {
            res.result(status.SUCCESS.status, colour, 'Successfully get colour detail', status.SUCCESS.statusName);
        }else {
            res.result(status.RESOURCE_NOT_FOUND.status, null, 'Can not find this colour', status.RESOURCE_NOT_FOUND.statusName);
        }
    });

    // // create a new colour
    // router.post('/colours', (req, res) => {
    //     const colorId = colour.length + 1;
    //     const hexString = req.body.hexString;
    //     const rgb = req.body.rgb;
    //     const hsl = req.body.year;
    //     const name = req.body.name;

    //     colours.push({ colorId: colorId, hexString: hexString, rgb: rgb, hsl: hsl, name: name })

    //     res.status(201).send('Colour created successfully');
    // })

    // update a colour by colourId
    router.put('/colours/:id', (req, res) => {
        const id = parseInt(req.params.id);
        const colour = colours.find((colour) => colour.id === id);

        

        res.status(200).send('Colour updated successfully');
    });

    // delete a colour by colourId
    router.delete('/colours/:id', (req, res) => {
        // check valid id
        if(!validator.idValidator(req.params.id)) {
            res.result(status.INVALID_ID.status, null, 'Colour id is invalid', status.INVALID_ID.statusName);
            return;
        }

        // get colour index in the JSON file
        const id = parseInt(req.params.id);
        const colourIndex = colours.findIndex((colour) => parseInt(colour.colorId) === id);
        
        // if the id equal -1, the colour is not exist
        if(colourIndex !== -1) {
            colours.splice(colourIndex, 1);

            fs.writeFile('./json/colours.json', JSON.stringify(colours), (err) => {
                if(err) {
                    res.result(status.SERVER_ERROR.status, null, 'Delete colour failed with server error', status.SERVER_ERROR.statusName);
                    return;
                }

                colours = JSON.parse(fs.readFileSync('./json/colours.json', 'utf8'));

                res.result(status.SUCCESS.status, null, 'Successfully delete colour', status.SUCCESS.statusName);
            });
        }else {
            res.result(status.RESOURCE_NOT_FOUND.status, null, 'Colour Id does not exist', status.RESOURCE_NOT_FOUND.statusName);
        }
    });

    // invalid update without colour Id
    router.put('/colours', (req, res) => {
        res.result(status.BAD_REQUEST.status, null, 'Bad request, update colour without Colour Id', status.BAD_REQUEST.statusName);
    });

    // invalid delete without colour Id
    router.delete('/colours', (req, res) => {
        res.result(status.BAD_REQUEST.status, null, 'Bad request, delete colour without Colour Id', status.BAD_REQUEST.statusName);
    });

    return router;
};