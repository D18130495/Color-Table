// create colour
function initialNewColourForm() {
    $('#newColorId').val(responseColourList.slice(-1)[0].colorId + 1);
    $('#newHexString').val('#ffffff');
    $('#newR').val(0);
    $('#newG').val(0);
    $('#newB').val(0);
    $('#newH').val(0);
    $('#newS').val(0);
    $('#newL').val(0);
    $('#newName').val('');
    $('#color-picker-new').attr('color', '#ffffff');
}

const $colorPickerNew = document.getElementById('color-picker-new');

$colorPickerNew.addEventListener('change', (evt) => {
    $('#newHexString').val(evt.detail.hex);

    const rgb = chromatism.convert(evt.detail.hex).rgb;
    const hsl = chromatism.convert(rgb).hsl;

    $('#newR').val(rgb.r);
    $('#newG').val(rgb.g);
    $('#newB').val(rgb.b);
    
    $('#newH').val(Math.round(hsl.h));
    $('#newS').val(Math.round(hsl.s));
    $('#newL').val(Math.round(hsl.l));
});

$('#newHexString').on('input', function() {
    const inputValue = $('#newHexString').val();
    const hexColorRegex = /^#?([0-9a-fA-F]{6})$/;
    
    if(hexColorRegex.test(inputValue)) {
        $('#newHexString').removeClass('is-invalid');

        // set colour
        $('#color-picker-new').attr('color', inputValue);
    }else {
        $('#newHexString').addClass('is-invalid');
    }
});

$("#newR").on('input', function() {
    changeNewRGB($('#newR').val(), $('#newG').val(), $('#newB').val())
});

$("#newG").on('input', function() {
    changeNewRGB($('#newR').val(), $('#newG').val(), $('#newB').val())
});

$("#newB").on('input', function() {
    changeNewRGB($('#newR').val(), $('#newG').val(), $('#newB').val())
});

function changeNewRGB(r, g, b) {
    const rgbColorRegex = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;

    if(rgbColorRegex.test(r)) {
        $('#newR').removeClass('is-invalid');

        if(rgbColorRegex.test(g)) {
            $('#newG').removeClass('is-invalid');

            if(rgbColorRegex.test(b)) {
                $('#newB').removeClass('is-invalid');
                
                const rgb = {
                    r: parseInt(r),
                    g: parseInt(g),
                    b: parseInt(b)
                };
            
                const hex = chromatism.convert(rgb).hex;
            
                $('#color-picker-new').attr('color', hex);
            }else {
                $('#newB').addClass('is-invalid');
            }
        }else {
            $('#newG').addClass('is-invalid');
        }
    }else {
        $('#newR').addClass('is-invalid');
    }
}

$("#newH").on('input', function() {
    changeNewHSL($('#newH').val(), $('#newS').val(), $('#newL').val())
});

$("#newS").on('input', function() {
    changeNewHSL($('#newH').val(), $('#newS').val(), $('#newL').val())
});

$("#newL").on('input', function() {
    changeNewHSL($('#newH').val(), $('#newS').val(), $('#newL').val())
});

function changeNewHSL(h, s, l) {
    const hColorRegex = /^([0-9]|[1-9][0-9]|[12][0-9]{2}|3[0-5][0-9]|360)(\.[0-9]+)?$/;
    const slColorRegex = /^([0-9]|[1-9][0-9]|100)(\.[0-9]+)?$/;

    if(hColorRegex.test(h)) {
        $('#newH').removeClass('is-invalid');

        if(slColorRegex.test(s)) {
            $('#newS').removeClass('is-invalid');

            if(slColorRegex.test(l)) {
                $('#newL').removeClass('is-invalid');

                const hsl = {
                    h: parseFloat(h),
                    s: parseFloat(s),
                    l: parseFloat(l)
                };
            
                const hex = chromatism.convert(hsl).hex;
            
                $('#color-picker-new').attr('color', hex);
            }else {
                $('#newL').addClass('is-invalid');
            }
        }else {
            $('#newS').addClass('is-invalid');
        }
    }else {
        $('#newH').addClass('is-invalid');
    }
}

function newColour() {
    // get new colour data
    colourId = $('#newColorId').val()
    colourHex = $('#newHexString').val()
    colourR = $('#newR').val()
    colourG = $('#newG').val()
    colourB = $('#newB').val()
    colourH = $('#newH').val()
    colourS = $('#newS').val()
    colourL = $('#newL').val()
    colourName = $('#newName').val()

    // form modify data
    const rgbObj = {
        r: colourR,
        g: colourG,
        b: colourB
    };
    const rgbJson = JSON.stringify(rgbObj);

    const hslObj = {
        h: colourH,
        s: colourS,
        l: colourL
    };
    const hslJson = JSON.stringify(hslObj);
    
    const colourData = {
        colorId: colourId,
        hexString: colourHex,
        rgb: rgbJson,
        hsl: hslJson,
        name: colourName
    };

    createColour(colourData)
        .then(response => {
            ELEMENT.Message.success({
                message: response.data.message,
                showClose: true,
                duration: 1500
            });

            $('#newModal').modal('hide');

            // generate new pagincation and colour card
            getColourList()
                .then(response => {
                    $('.pagination .prev').nextAll().slice(0, 5).remove();
                    totalColourNumber = response.data.data.length;
                    responseColourList = response.data.data;

                    createPagination(response.data.data, totalColourNumber, totalColourNumber - 5, totalColourNumber);
                })

            if($("#colourTableContainer").is(':visible')) {
                $('#mainTable').empty();

                getColourList()
                    .then(response => {
                        totalColourNumber = response.data.data.length;
                        responseColourList = response.data.data;

                        createTable(response.data.data);
                    })
            }
        })
}





// modify colour
function initialModifyColourForm() {
    // get active colour Id
    colourId = $('.pagination .page').filter(function() {
        return $(this).hasClass('active');
    }).data('page');

    getColourByColourId(colourId)
        .then(response => {
            $('#modifyColorId').val(response.data.data.colorId);
            $('#modifyHexString').val(response.data.data.hexString);
            $('#modifyR').val(response.data.data.rgb.r);
            $('#modifyG').val(response.data.data.rgb.g);
            $('#modifyB').val(response.data.data.rgb.b);
            $('#modifyH').val(Math.round(response.data.data.hsl.h));
            $('#modifyS').val(Math.round(response.data.data.hsl.s));
            $('#modifyL').val(Math.round(response.data.data.hsl.l));
            $('#modifyName').val(response.data.data.name);
            $('#color-picker').attr('color', response.data.data.hexString);
        })
}

const $colorPicker = document.getElementById('color-picker');

$colorPicker.addEventListener('change', (evt) => {
    $('#modifyHexString').val(evt.detail.hex);

    const rgb = chromatism.convert(evt.detail.hex).rgb;
    const hsl = chromatism.convert(rgb).hsl;

    $('#modifyR').val(rgb.r);
    $('#modifyG').val(rgb.g);
    $('#modifyB').val(rgb.b);
    
    $('#modifyH').val(Math.round(hsl.h));
    $('#modifyS').val(Math.round(hsl.s));
    $('#modifyL').val(Math.round(hsl.l));
});

$('#modifyHexString').on('input', function() {
    const inputValue = $('#modifyHexString').val();
    const hexColorRegex = /^#?([0-9a-fA-F]{6})$/;
    
    if(hexColorRegex.test(inputValue)) {
        $('#modifyHexString').removeClass('is-invalid');

        // set colour
        $('#color-picker').attr('color', inputValue);
    }else {
        $('#modifyHexString').addClass('is-invalid');
    }
});

$("#modifyR").on('input', function() {
    changeUpdateRGB($('#modifyR').val(), $('#modifyG').val(), $('#modifyB').val())
});

$("#modifyG").on('input', function() {
    changeUpdateRGB($('#modifyR').val(), $('#modifyG').val(), $('#modifyB').val())
});

$("#modifyB").on('input', function() {
    changeUpdateRGB($('#modifyR').val(), $('#modifyG').val(), $('#modifyB').val())
});

function changeUpdateRGB(r, g, b) {
    const rgbColorRegex = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;

    if(rgbColorRegex.test(r)) {
        $('#modifyR').removeClass('is-invalid');

        if(rgbColorRegex.test(g)) {
            $('#modifyG').removeClass('is-invalid');

            if(rgbColorRegex.test(b)) {
                $('#modifyB').removeClass('is-invalid');
                
                const rgb = {
                    r: parseInt(r),
                    g: parseInt(g),
                    b: parseInt(b)
                };
            
                const hex = chromatism.convert(rgb).hex;
            
                $('#color-picker').attr('color', hex);
            }else {
                $('#modifyB').addClass('is-invalid');
            }
        }else {
            $('#modifyG').addClass('is-invalid');
        }
    }else {
        $('#modifyR').addClass('is-invalid');
    }
}

$("#modifyH").on('input', function() {
    changeHSL($('#modifyH').val(), $('#modifyS').val(), $('#modifyL').val())
});

$("#modifyS").on('input', function() {
    changeHSL($('#modifyH').val(), $('#modifyS').val(), $('#modifyL').val())
});

$("#modifyL").on('input', function() {
    changeHSL($('#modifyH').val(), $('#modifyS').val(), $('#modifyL').val())
});

function changeHSL(h, s, l) {
    const hColorRegex = /^([0-9]|[1-9][0-9]|[12][0-9]{2}|3[0-5][0-9]|360)(\.[0-9]+)?$/;
    const slColorRegex = /^([0-9]|[1-9][0-9]|100)(\.[0-9]+)?$/;

    if(hColorRegex.test(h)) {
        $('#modifyH').removeClass('is-invalid');

        if(slColorRegex.test(s)) {
            $('#modifyS').removeClass('is-invalid');

            if(slColorRegex.test(l)) {
                $('#modifyL').removeClass('is-invalid');

                const hsl = {
                    h: parseFloat(h),
                    s: parseFloat(s),
                    l: parseFloat(l)
                };
            
                const hex = chromatism.convert(hsl).hex;
            
                $('#color-picker').attr('color', hex);
            }else {
                $('#modifyL').addClass('is-invalid');
            }
        }else {
            $('#modifyS').addClass('is-invalid');
        }
    }else {
        $('#modifyH').addClass('is-invalid');
    }
}

function modifyColour() {
    // get modify colour data
    colourId = $('#modifyColorId').val()
    colourHex = $('#modifyHexString').val()
    colourR = $('#modifyR').val()
    colourG = $('#modifyG').val()
    colourB = $('#modifyB').val()
    colourH = $('#modifyH').val()
    colourS = $('#modifyS').val()
    colourL = $('#modifyL').val()
    colourName = $('#modifyName').val()

    // form modify data
    const rgbObj = {
        r: colourR,
        g: colourG,
        b: colourB
    };
    const rgbJson = JSON.stringify(rgbObj);

    const hslObj = {
        h: colourH,
        s: colourS,
        l: colourL
    };
    const hslJson = JSON.stringify(hslObj);
    
    const colourData = {
        colorId: colourId,
        hexString: colourHex,
        rgb: rgbJson,
        hsl: hslJson,
        name: colourName
    };

    updateColourByColourId(colourId, colourData)
        .then(response => {
            ELEMENT.Message.success({
                message: response.data.message,
                showClose: true,
                duration: 1500
            });

            $('#modifyModal').modal('hide');

            // get active colour page number
            activePageNumber = $('.pagination .page').filter(function() {
                return $(this).hasClass('active');
            }).text();
            activePageNumber = parseInt(activePageNumber);

            // generate new pagincation and colour card
            getColourList()
                .then(response => {
                    $('.pagination .prev').nextAll().slice(0, 5).remove();
                    totalColourNumber = response.data.data.length;
                    responseColourList = response.data.data;

                    // handle edge page
                    if(activePageNumber === 1) {
                        createPagination(response.data.data, 1, 0, 4);
                    }else if(activePageNumber === 2) {
                        createPagination(response.data.data, 2, 0, 4);
                    }else if(activePageNumber > (totalColourNumber) - 2) {
                        createPagination(response.data.data, activePageNumber, totalColourNumber - 5, totalColourNumber);
                    }else {
                        createPagination(response.data.data, activePageNumber, activePageNumber - 3, activePageNumber + 1);
                    }
                })

            if($("#colourTableContainer").is(':visible')) {
                $('#mainTable').empty();

                getColourList()
                    .then(response => {
                        totalColourNumber = response.data.data.length;
                        responseColourList = response.data.data;

                        createTable(response.data.data);
                    })
            }
        })
}





// remove colour
function removeColour() {
    // get active colour Id
    colourId = $('.pagination .page').filter(function() {
        return $(this).hasClass('active');
    }).data('page');

    // get active colour page number
    activePageNumber = $('.pagination .page').filter(function() {
        return $(this).hasClass('active');
    }).text();
    activePageNumber = parseInt(activePageNumber);
    
    deleteColourByColourId(colourId)
        .then(response => {
            // inform message
            ELEMENT.Message.success({
                message: response.data.message,
                showClose: true,
                duration: 1500
            });
            
            // generate new pagincation and colour card
            getColourList()
                .then(response => {
                    $('.pagination .prev').nextAll().slice(0, 5).remove();
                    totalColourNumber = response.data.data.length;
                    responseColourList = response.data.data;

                    // handle edge page
                    if(activePageNumber === 1) {
                        createPagination(response.data.data, 1, 0, 4);
                    }else if(activePageNumber === 2) {
                        createPagination(response.data.data, 2, 0, 4);
                    }else if(activePageNumber > (totalColourNumber) - 2) {
                        createPagination(response.data.data, activePageNumber - 1, totalColourNumber - 5, totalColourNumber);
                    }else {
                        createPagination(response.data.data, activePageNumber, activePageNumber - 3, activePageNumber + 1);
                    }
                })

            if($("#colourTableContainer").is(':visible')) {
                $('#mainTable').empty();

                getColourList()
                    .then(response => {
                        totalColourNumber = response.data.data.length;
                        responseColourList = response.data.data;

                        createTable(response.data.data);
                    })
            }
        })
}





// set background
function selectBackground() {
    setBackgroundCookie()
    
    // set background colour
    $("#header").css("background-color", $('#hexString').val());
    $("#footer").css("background-color", $('#hexString').val());

    // inform message
    ELEMENT.Message.success({
        message: 'Successfully set background colour',
        showClose: true,
        duration: 1500
    });
}