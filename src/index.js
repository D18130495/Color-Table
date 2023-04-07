// message config
Qmsg.config({
    showClose: true,
    autoClose: true,
    timeout: 1500
})

// request
// get colour list
function getColourList() {
    return axios.get("/colours");
}

// get colour by colour Id
function getColourByColourId(colourId) {
    return axios.get("/colours/" + colourId);
}

// create a new colour
function createColour() {
    return axios.post("/colours");
}

// update colour by colour Id
function updateColourByColourId(colourId, colourData) {
    return axios({
        method: 'put',
        url:'/colours/' + colourId,
        data: colourData
    });
}

// delete colour by colour Id
function deleteColourByColourId(colourId) {
    return axios.delete("/colours/" + colourId);
}

// bad request
// update colour with out colour Id
function updateColourWithoutColourId() {
    return axios.put("/colours");
}

// bad request
// delete colour without colour Id
function deleteColourWithoutColourId() {
    return axios.delete("/colours");
}

// axios response interceptor
axios.interceptors.response.use(
    response => {
        if(response.status === 200) {
            if(response.data.status !== 200) {
                Qmsg.error(response.data.message);

                return Promise.reject(response);
            }else {
                return Promise.resolve(response);
            }
        }else {
            Qmsg.error("Request not successful");

            return Promise.reject(response);
        }
    },
    error => {
        Qmsg.error("Oops! Something goes wrong");

        return Promise.reject(error.response);
    }
)





var totalColourNumber = 0
var responseColourList = {}

// initial function
$(document).ready(function() {
    var lastVisitExists = false

    // get cookies
    const cookies = document.cookie.split(';');

    cookies.forEach(cookie => {
        const [name, value] = cookie.trim().split('=');
        
        // set background colour
        if(name === 'background') {
            $("#header").css("background-color", value);
            $("#footer").css("background-color", value);
        }

        // set last visit index
        if(name === 'lastVisit') {
            // start with last visit index
            lastVisitExists = true;
            initialColourPagination(parseInt(value));
        }
    })

    if(!lastVisitExists) {
        // start with index 0
        initialColourPagination(0);
    }
})

// initial pagination
function initialColourPagination(lastVisitIndex) {
    // get all the colour
    getColourList()
        .then(response => {
            // set the colour list length and content
            totalColourNumber = response.data.data.length;
            responseColourList = response.data.data;
            
            // generate pagination, colour card and handle edge page
            if(lastVisitIndex === 0) {
                createPagination(response.data.data, 1, 0, 4);
            }else if(lastVisitIndex === 1) {
                createPagination(response.data.data, 2, 0, 4);
            }else if(lastVisitIndex === (totalColourNumber - 1) || lastVisitIndex === (totalColourNumber - 2)) {
                createPagination(response.data.data, lastVisitIndex + 1, totalColourNumber - 5, totalColourNumber - 1);
            }else {
                createPagination(response.data.data, lastVisitIndex + 1, lastVisitIndex - 2, lastVisitIndex + 2);
            }
        })
}

// generate pagination
function createPagination(colourList, currentPage, startIndex, endIndex) {
    $('.pagination span').text('Page ' + currentPage + ' of ' + colourList.length);
    
    $.each(colourList, function(index, item) {
        if(index >= startIndex && index <= endIndex) {
            if(index + 1 === currentPage) {
                $("<a href=\"#\" class=\"page active\"" + "data-page=\"" + item.colorId + "\"></a>").append(index + 1).insertBefore('.pagination .next');
            }else {
                $("<a href=\"#\" class=\"page\"" + "data-page=\"" + item.colorId + "\"></a>").append(index + 1).insertBefore('.pagination .next');
            }
        }
    })

    setLastVisitCookie(currentPage - 1);

    // find current active page, get colour ID and generate colour card
    colourId = $('.pagination .page').filter(function() {
                    return $(this).hasClass('active');
                }).data('page');
    createColourCard(colourId);
}

// generate colour card
function createColourCard(colourId) {
    getColourByColourId(colourId)
        .then(response => {
            $('#colorId').val(response.data.data.colorId);
            $('#hexString').val(response.data.data.hexString);
            $('#rgb').val('R:' + response.data.data.rgb.r + ' G:' + response.data.data.rgb.g + ' B:' + response.data.data.rgb.b);
            $('#hsl').val('H:' + response.data.data.hsl.h + ' S:' + response.data.data.hsl.s + ' L:' + response.data.data.hsl.l);
            $('#name').val(response.data.data.name);
            $('#displayColour').css('background-color', response.data.data.hexString);
        })
}





// pagination operations
$(function() {
    // click on the page
    $(document).on('click', '.pagination .page', function(e) {
        // remove a tag redirect
        e.preventDefault();
        
        // change active button and page text
        if(!$(this).hasClass('active')) {
            $('.pagination .page').removeClass('active');
            
            // selected page number
            selectedNumber = parseInt($(this).text());
            
            // handle edge page
            if(selectedNumber === 1) {
                $('.pagination .prev').nextAll().slice(0, 5).remove();
                createPagination(responseColourList, 1, 0, 4);
            }else if(selectedNumber === 2) {
                $('.pagination .prev').nextAll().slice(0, 5).remove();
                createPagination(responseColourList, 2, 0, 4);
            }else if(selectedNumber === totalColourNumber || selectedNumber === (totalColourNumber - 1)) {
                $('.pagination .prev').nextAll().slice(0, 5).remove();
                createPagination(responseColourList, selectedNumber, totalColourNumber - 5, totalColourNumber);
            }else {
                updatePagination(selectedNumber);
            }
        }
    })

    // click on the prev
    $(document).on('click', '.pagination .prev', function(e) {
        // remove a tag redirect
        e.preventDefault();

        // find active page
        var activePage = $('.pagination .page').filter('.active');
        var activePageNumber = parseInt(activePage.text());
        
        // go to prev page and handle edge page
        if(activePageNumber > 1) {
            activePage.removeClass('active');

            if(activePageNumber <= 3) {
                $('.pagination .page').eq(activePageNumber - 2).addClass('active');
                $('.pagination span').text('Page ' + $('.pagination .page').index(activePage) + ' of ' + totalColourNumber);
                setLastVisitCookie(activePageNumber - 1);

                colourId = $('.pagination .page').filter(function() {
                    return $(this).hasClass('active');
                }).data('page');
                createColourCard(colourId);
            }else if(activePageNumber >= totalColourNumber - 1) {
                $('.pagination .page').filter(function() {
                    return parseInt($(this).text()) === (activePageNumber - 1);
                }).addClass('active');
                $('.pagination span').text('Page ' + (activePageNumber - 1) + ' of ' + totalColourNumber);
                setLastVisitCookie(activePageNumber - 1);

                colourId = $('.pagination .page').filter(function() {
                    return $(this).hasClass('active');
                }).data('page');
                createColourCard(colourId);
            }else {
                updatePagination(activePageNumber - 1);
            }
        }
    })

    // click on the next
    $(document).on('click', '.pagination .next', function(e) {
        // remove a tag redirect
        e.preventDefault();
        
        // find active page
        var activePage = $('.pagination .page').filter('.active');
        var activePageNumber = parseInt(activePage.text());
        
        // go to next page and handle edge page
        if(activePageNumber < totalColourNumber) {
            activePage.removeClass('active');

            if(activePageNumber < 3) {
                $('.pagination .page').eq(activePageNumber).addClass('active');
                $('.pagination span').text('Page ' + ($('.pagination .page').index(activePage) + 2) + ' of ' + totalColourNumber);
                setLastVisitCookie(activePageNumber - 1);

                colourId = $('.pagination .page').filter(function() {
                    return $(this).hasClass('active');
                }).data('page');
                createColourCard(colourId)
            }else if(activePageNumber > totalColourNumber - 3) {
                $('.pagination .page').filter(function() {
                    return parseInt($(this).text()) === (activePageNumber + 1);
                }).addClass('active');
                $('.pagination span').text('Page ' + (activePageNumber + 1) + ' of ' + totalColourNumber);
                setLastVisitCookie(activePageNumber - 1);

                colourId = $('.pagination .page').filter(function() {
                    return $(this).hasClass('active');
                }).data('page');
                createColourCard(colourId);
            }else {
                updatePagination(activePageNumber + 1);
            }  
        }
    })

    // go to the specific page
    $(document).on('click', '.pagination .go', function() {
        // get input number
        var inputNumber = parseInt($('.pagination input').val());
        
        // go to page and handle edge page
        if(!isNaN(inputNumber) && inputNumber > 2 && inputNumber < totalColourNumber - 1) {
            $('.pagination .page').filter('.active').removeClass('active');
            updatePagination(inputNumber);
        }else if(inputNumber <= 1) {
            $('.pagination input').val(1);
            $('.pagination .prev').nextAll().slice(0, 5).remove();
            createPagination(responseColourList, 1, 0, 4);
        }else if(inputNumber === 2) {
            $('.pagination .prev').nextAll().slice(0, 5).remove();
            createPagination(responseColourList, inputNumber, inputNumber - 2, inputNumber + 2);
        }else if(inputNumber >= totalColourNumber) {
            $('.pagination input').val(totalColourNumber);
            $('.pagination .prev').nextAll().slice(0, 5).remove();
            createPagination(responseColourList, totalColourNumber, totalColourNumber - 5, totalColourNumber - 1);
        }else if(inputNumber === (totalColourNumber - 1)) {
            $('.pagination .prev').nextAll().slice(0, 5).remove();
            createPagination(responseColourList, totalColourNumber - 1, totalColourNumber - 5, totalColourNumber - 1);
        }
    })

    // press enter for input to trigger click event
    $('.pagination input').on('keyup', function(e) {
        if(e.keyCode === 13) {
            $('.pagination .go').trigger('click');
        }
    })

    // update page number(pagination)
    function updatePagination(selected) {
        getColourList()
            .then(response => {
                $('.pagination .prev').nextAll().slice(0, 5).remove();
                totalColourNumber = response.data.data.length;
                responseColourList = response.data.data;
                createPagination(response.data.data, selected, selected - 3, selected + 1);
            })
    }
})





// display or hide colour table
function loadTable() {
    // display or hide table
    $("#colourTableContainer").toggle();

    //  check if the table is currently displayed
    if($("#colourTableContainer").is(':visible')) {
        getColourList()
            .then(response => {
                createTable(response.data.data);
            })

        $("#colourTableButton").text("Hide Colour List Table");
    }else {
        $("#colourTableButton").text("Load Colour List Table");
        $('#mainTable').empty();
    }
}

// create colour table
function createTable(colours) {
    $.each(colours, function(index, item) {
        const id = $("<td></td>").append(item.colorId);
        const colour = $("<td style=\'background-color:" + item.hexString + "\'></td>");
        const name = $("<td></td>").append(item.name);
        const hex = $("<td></td>").append(item.hexString);
        const rgb = $("<td></td>").append(rgbConverter(item.rgb));
        const hsl = $("<td></td>").append(hslConverter(item.hsl));
       
        $("<tr id=" + "tr" + index + " style=\'vertical-align: middle\'></tr>").append(id).append(colour)
            .append(name).append(hex).append(rgb).append(hsl)
            .appendTo("#mainTable");
    })
}

function rgbConverter(rgb) {
    return `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
}

function hslConverter(hsl) {
    return `hsl(${Math.round(hsl.h)}, ${hsl.s}%, ${hsl.l}%)`;
}





// set last visit index cookie
function setLastVisitCookie(lastIndex) {
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + 3);
    document.cookie = 'lastVisit=' + lastIndex + '; expires=' + expirationDate.toUTCString() + '; path=/';
}





// create colour
function initialNewColourForm() {
    $('#newColorId').val(responseColourList.slice(-1)[0].colorId + 1);
}

function newColour() {
    
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
            $('#modifyH').val(response.data.data.hsl.h);
            $('#modifyS').val(response.data.data.hsl.s);
            $('#modifyL').val(response.data.data.hsl.l);
            $('#modifyName').val(response.data.data.name);
            $('#color-picker').attr('color', response.data.data.hexString);
        })
}

const $colorPicker = document.getElementById('color-picker');

$colorPicker.addEventListener('change', (evt) => {
    $('#modifyHexString').val(evt.detail.hex);

    const rgbColor = evt.detail.rgb;
    const rStartIndex = rgbColor.indexOf("(") + 1;
    const rEndIndex = rgbColor.indexOf(",", rStartIndex);
    const redValue = parseInt(rgbColor.substring(rStartIndex, rEndIndex));

    const gStartIndex = rEndIndex + 1;
    const gEndIndex = rgbColor.indexOf(",", gStartIndex);
    const greenValue = parseInt(rgbColor.substring(gStartIndex, gEndIndex));

    const bStartIndex = gEndIndex + 1;
    const bEndIndex = rgbColor.indexOf(")", bStartIndex);
    const blueValue = parseInt(rgbColor.substring(bStartIndex, bEndIndex));

    $('#modifyR').val(redValue);
    $('#modifyG').val(greenValue);
    $('#modifyB').val(blueValue);

    const hslColor = evt.detail.hsl;
    const hStartIndex = hslColor.indexOf("(") + 1;
    const hEndIndex = hslColor.indexOf(",", hStartIndex);
    const hueValue = parseInt(hslColor.substring(hStartIndex, hEndIndex));
    
    const sStartIndex = hEndIndex + 1;
    const sEndIndex = hslColor.indexOf("%", sStartIndex);
    const saturationValue = parseFloat(hslColor.substring(sStartIndex, sEndIndex));
    
    const lStartIndex = sEndIndex + 2;
    const lEndIndex = hslColor.indexOf("%", lStartIndex);
    const lightnessValue = parseFloat(hslColor.substring(lStartIndex, lEndIndex));
    


    $('#modifyH').val(hueValue);
    $('#modifyS').val(saturationValue);
    $('#modifyL').val(lightnessValue);
});

function modifyColour() {
    // get modify colour Id
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

    console.log(colourData)

    updateColourByColourId(colourId, colourData)
        .then(response => {

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
            Qmsg.success(response.data.message);
            
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
                        createTable(response.data.data);
                    })
            }
        })
}





// set background
function selectBackground() {
    // set cookie for background, expire time is three day
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + 3);
    document.cookie = 'background=' + $('#hexString').val() + '; expires=' + expirationDate.toUTCString() + '; path=/';
    
    // set background colour
    $("#header").css("background-color", $('#hexString').val());
    $("#footer").css("background-color", $('#hexString').val());

    // inform message
    Qmsg.success('Successfully set background colour');
}