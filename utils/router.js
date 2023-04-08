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
    NAME_EXIST: {
        status: 211,
        statusName: "Colour name exist"
    },
    INVALID_HEX: {
        status: 212,
        statusName: "Invalid hex"
    },
    INVALID_RGB: {
        status: 213,
        statusName: "Invalid rgb"
    },
    INVALID_HSL: {
        status: 214,
        statusName: "Invalid hsl"
    },
    COLOUR_NOT_MATCH: {
        status: 215,
        statusName: "Colour not match"
    },
    EMPTY_COLOUR_NAME: {
        status: 216,
        statusName: "Colour name is empty"
    },
    COLOUR_EXIST: {
        status: 217,
        statusName: "Colour is exist"
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
        if(!validator.idValidator(req.params.colourId)) {
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

    // create a new colour
    router.post('/colours', (req, res) => {
         // check valid id
         if(!validator.idValidator(req.body.colorId)) {
            res.result(status.INVALID_ID.status, null, 'Colour id is invalid', status.INVALID_ID.statusName);
            return;
        }

        // check if the name is empty
        if(req.body.name === '') {
            res.result(status.EMPTY_COLOUR_NAME.status, null, 'Colour name is empty', status.EMPTY_COLOUR_NAME.statusName);
            return;
        }

        // check if colour name is exist
        if(validator.nameValidator(req.body.colorId, req.body.name)) {
            res.result(status.NAME_EXIST.status, null, 'Colour name is exist', status.NAME_EXIST.statusName);
            return;
        }

        // check if colour hex is valid
        if(!validator.hexValidator(req.body.hexString)) {
            res.result(status.INVALID_HEX.status, null, 'Colour hex is invalid', status.INVALID_HEX.statusName);
            return;
        }

        // check if colour exist by hex
        if(validator.colourExistValidator(req.body.hexString)) {
            res.result(status.COLOUR_EXIST, null, 'Colour is exist', status.COLOUR_EXIST.statusName);
            return;
        }
        
        // check if colour rgb is valid
        if(!validator.rgbValidator(JSON.parse(req.body.rgb))) {
            res.result(status.INVALID_RGB.status, null, 'Colour rgb is invalid', status.INVALID_RGB.statusName);
            return;
        }
        
        // check if colour hsl is valid
        if(!validator.hslValidator(JSON.parse(req.body.hsl))) {
            res.result(status.INVALID_HSL.status, null, 'Colour hsl is invalid', status.INVALID_HSL.statusName);
            return;
        }

        // check if colour hex is match with rgb and hsl
        if(!validator.matchValidator(req.body.hexString, JSON.parse(req.body.rgb), JSON.parse(req.body.hsl))) {
            res.result(status.COLOUR_NOT_MATCH.status, null, 'Colour hex, rgb and hsl are not match', status.COLOUR_NOT_MATCH.statusName);
            return;
        }

        // create new colour
        colours = JSON.parse(fs.readFileSync('./json/colours.json', 'utf8'));
        
        rgbJson = JSON.parse(req.body.rgb)
        hslJson = JSON.parse(req.body.hsl)

        newColour = {
            colorId: parseInt(req.body.colorId),
            hexString: req.body.hexString,
            rgb: { r: parseInt(rgbJson.r), g: parseInt(rgbJson.g), b: parseInt(rgbJson.b) },
            hsl: { h: parseFloat(hslJson.h), s: parseFloat(hslJson.s), l: parseFloat(hslJson.l) },
            name: req.body.name
        }

        colours.push(newColour)

        fs.writeFile('./json/colours.json', JSON.stringify(colours), (err) => {
            if(err) {
                res.result(status.SERVER_ERROR.status, null, 'Update colour failed with server error', status.SERVER_ERROR.statusName);
                return;
            }

            colours = JSON.parse(fs.readFileSync('./json/colours.json', 'utf8'));

            res.result(status.SUCCESS.status, null, 'Successfully created new colour', status.SUCCESS.statusName);
        });
    })

    // update a colour by colourId
    router.put('/colours/:colourId', (req, res) => {
        // check valid id
        if(!validator.idValidator(req.params.colourId)) {
            res.result(status.INVALID_ID.status, null, 'Colour id is invalid', status.INVALID_ID.statusName);
            return;
        }

        // get old colour
        const colourId = parseInt(req.params.colourId);
        const colour = colours.find((colour) => colour.colorId === colourId);

        // if colour not exist, add a new colour
        if(!colour) {



            return;
        }
        
        // check if the name is empty
        if(req.body.name === '') {
            res.result(status.EMPTY_COLOUR_NAME.status, null, 'Colour name is not exist', status.EMPTY_COLOUR_NAME.statusName);
            return;
        }

        // check if colour name is exist
        if(req.body.name !== colour.name) {
            if(validator.nameValidator(req.body.colorId, req.body.name)) {
                res.result(status.NAME_EXIST.status, null, 'Colour name is exist', status.NAME_EXIST.statusName);
                return;
            }
        }
        
        // check if colour hex is valid
        if(!validator.hexValidator(req.body.hexString)) {
            res.result(status.INVALID_HEX.status, null, 'Colour hex is invalid', status.INVALID_HEX.statusName);
            return;
        }
        
        // check if colour rgb is valid
        if(!validator.rgbValidator(JSON.parse(req.body.rgb))) {
            res.result(status.INVALID_RGB.status, null, 'Colour rgb is invalid', status.INVALID_RGB.statusName);
            return;
        }
        
        // check if colour hsl is valid
        if(!validator.hslValidator(JSON.parse(req.body.hsl))) {
            res.result(status.INVALID_HSL.status, null, 'Colour hsl is invalid', status.INVALID_HSL.statusName);
            return;
        }

        // check if colour hex is match with rgb and hsl
        if(!validator.matchValidator(req.body.hexString, JSON.parse(req.body.rgb), JSON.parse(req.body.hsl))) {
            res.result(status.COLOUR_NOT_MATCH.status, null, 'Colour hex, rgb and hsl are not match', status.COLOUR_NOT_MATCH.statusName);
            return;
        }

        // update colour
        colours = JSON.parse(fs.readFileSync('./json/colours.json', 'utf8'));
        const updateColour = colours.find((colour) => colour.colorId === colourId);

        updateColour.hexString = req.body.hexString;
        rgbJson = JSON.parse(req.body.rgb)
        updateColour.rgb = { r: parseInt(rgbJson.r), g: parseInt(rgbJson.g), b: parseInt(rgbJson.b) };
        hslJson = JSON.parse(req.body.hsl)
        updateColour.hsl = { h: parseFloat(hslJson.h), s: parseFloat(hslJson.s), l: parseFloat(hslJson.l) };
        updateColour.name = req.body.name;

        fs.writeFile('./json/colours.json', JSON.stringify(colours), (err) => {
            if(err) {
                res.result(status.SERVER_ERROR.status, null, 'Update colour failed with server error', status.SERVER_ERROR.statusName);
                return;
            }

            colours = JSON.parse(fs.readFileSync('./json/colours.json', 'utf8'));

            res.result(status.SUCCESS.status, null, 'Successfully updated colour', status.SUCCESS.statusName);
        });
    });

    // delete a colour by colourId
    router.delete('/colours/:colourId', (req, res) => {
        // check valid id
        if(!validator.idValidator(req.params.colourId)) {
            res.result(status.INVALID_ID.status, null, 'Colour id is invalid', status.INVALID_ID.statusName);
            return;
        }

        // get colour index in the JSON file
        const colourId = parseInt(req.params.colourId);
        const colourIndex = colours.findIndex((colour) => parseInt(colour.colorId) === colourId);
        
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