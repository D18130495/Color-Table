const fs = require('fs');
const chromatism = require('chromatism');

// validate if the Id is integer
function idValidator(id) {
    // check if id is empty or not a number
    if(!id || isNaN(id)) {
      return false;
    }
   
    // convert id to a number
    const idNumber = parseInt(id);
  
    // check if id is a positive integer
    if(!Number.isInteger(idNumber) || idNumber < 0) {
      return false;
    }

    return true;
}

// validate if the name is exist
function nameValidator(colorId, name) {
    // read file
    colours = JSON.parse(fs.readFileSync('./json/colours.json', 'utf8'));

    // check the name
    for(let i = 0; i < colours.length; i++) {
        if(colours[i].colorId === colorId) {
            continue;
        }
        
        if(colours[i].name === name) {
          return true;
        }
    }

    return false;
}

// validate if the colour is exist
function colourExistValidator(hex) {
    // read file
    colours = JSON.parse(fs.readFileSync('./json/colours.json', 'utf8'));
    
    // check the hex
    for(let i = 0; i < colours.length; i++) {
        if(colours[i].hexString === hex) {
            return true;
        }
    }

    return false;
}

// validate colour hex
function hexValidator(hex) {
    return /^#([A-Fa-f0-9]{3}){1,2}$/.test(hex);
}

// validate colour rgb
function rgbValidator(rgb) {
    const r = parseInt(rgb.r);
    const g = parseInt(rgb.g);
    const b = parseInt(rgb.b);
    
    // check that each value is within the valid range of 0 - 255
    if(isNaN(r) || r < 0 || r > 255) {
        return false;
    }
    if(isNaN(g) || g < 0 || g > 255) {
        return false;
    }
    if(isNaN(b) || b < 0 || b > 255) {
        return false;
    }

    return true;
}

// validate colour hsl
function hslValidator(hsl) {
    const h = parseFloat(hsl.h);
    const s = parseFloat(hsl.s);
    const l = parseFloat(hsl.l);
  
    // check that hue is within the valid range of 0 - 360
    if(isNaN(h) || h < 0 || h > 360) {
      return false;
    }
  
    // check that saturation and lightness are within the valid range of 0 - 100
    if(isNaN(s) || s < 0 || s > 100) {
      return false;
    }
    if(isNaN(l) || l < 0 || l > 100) {
      return false;
    }
  
    return true;
}

// validate if colour hex, rgb and hsl match
function matchValidator(hex, rgb, hsl) {
    const r = parseInt(rgb.r);
    const g = parseInt(rgb.g);
    const b = parseInt(rgb.b);

    const h = parseInt(Math.round(hsl.h));
    const s = parseInt(Math.round(hsl.s));
    const l = parseInt(Math.round(hsl.l));

    // convert hex color to RGB and HSL
    const hexRgb = chromatism.convert(hex).rgb;
    const hexHsl = chromatism.convert(hex).hsl;

    // compare hex color to rgb color
    if(hexRgb.r !== r || hexRgb.g !== g || hexRgb.b !== b) {
        return false;
    }

    // compare hex color to hsl color
    if(parseInt(Math.round(hexHsl.h)) !== h || parseInt(Math.round(hexHsl.s)) !== s || parseInt(Math.round(hexHsl.l)) !== l) {
        return false;
    }
    
    return true;
}

module.exports = {
    idValidator: idValidator,
    nameValidator: nameValidator,
    colourExistValidator: colourExistValidator,
    hexValidator: hexValidator,
    rgbValidator: rgbValidator,
    hslValidator: hslValidator,
    matchValidator: matchValidator
};