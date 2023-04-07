// request
function getColourList() {
    return axios.get("/colours")
}

function getColourByColourId(colourId) {
    return axios.get("/colours/" + colourId)
}

function deleteColourByColourId(colourId) {
    return axios.delete("/colours/" + colourId)
}

axios.interceptors.response.use(
    response => {
        if (response.status === 200) {
            return Promise.resolve(response)
        }else {
            return Promise.reject(response)
        }
    },
    error => {
        return Promise.reject(error)
    }
)





var totalColourNumber = 0
var responseColourList = {}

// initial function
$(document).ready(function() {
    var lastVisitExists = false

    // get cookies
    const cookies = document.cookie.split(';')

    cookies.forEach(cookie => {
        const [name, value] = cookie.trim().split('=')
        
        // set background colour
        if(name === 'background') {
            $("#header").css("background-color", value)
            $("#footer").css("background-color", value)
        }

        // set last visit index
        if(name === 'lastVisit') {
            // start with last visit index
            lastVisitExists = true
            initialColourPagination(parseInt(value))
        }
    })

    if(!lastVisitExists) {
        // start with index 0
        initialColourPagination(0)
    }
})

// initial pagination
function initialColourPagination(lastVisitIndex) {
    // get all the colour
    getColourList()
        .then(response => {
            // set the colour list length and content
            totalColourNumber = response.data.data.length
            responseColourList = response.data.data
            
            // generate pagination and colour card
            if(lastVisitIndex === 0) {
                createPagination(response.data.data, 1, 0, 4)
            }else if(lastVisitIndex === 1) {
                createPagination(response.data.data, 2, 0, 4)
            }else if(lastVisitIndex === (totalColourNumber - 1) || lastVisitIndex === (totalColourNumber - 2)) {
                createPagination(response.data.data, lastVisitIndex + 1, totalColourNumber - 5, totalColourNumber - 1)
            }else {
                createPagination(response.data.data, lastVisitIndex + 1, lastVisitIndex - 2, lastVisitIndex + 2)
            }
        })
}

// generate pagination
function createPagination(colourList, currentPage, startIndex, endIndex) {
    $('.pagination span').text('Page ' + currentPage + ' of ' + colourList.length)
    // $('.pagination input').attr('max', colourList.length)
    // $('.pagination input').attr('value', currentPage)
    console.log()
    $.each(colourList, function(index, item) {
        if(index >= startIndex && index <= endIndex) {
            if(index + 1 === currentPage) {
                $("<a href=\"#\" class=\"page active\"" + "data-page=\"" + item.colorId + "\"></a>").append(index + 1).insertBefore('.pagination .next')
            }else {
                $("<a href=\"#\" class=\"page\"" + "data-page=\"" + item.colorId + "\"></a>").append(index + 1).insertBefore('.pagination .next')
            }
        }
    })

    setLastVisitCookie(currentPage - 1)

    // find current active page, get colour ID and generate colour card
    colourId = $('.pagination .page').filter(function() {
                    return $(this).hasClass('active')
                }).attr('data-page')
    createColourCard(colourId)
}

// generate colour card
function createColourCard(colourId) {
    getColourByColourId(colourId)
        .then(response => {
            $('#colorId').val(response.data.data.colorId)
            $('#hexString').val(response.data.data.hexString)
            $('#rgb').val('R:' + response.data.data.rgb.r + ' G:' + response.data.data.rgb.g + ' B:' + response.data.data.rgb.b)
            $('#hsl').val('H:' + response.data.data.hsl.h + ' S:' + response.data.data.hsl.s + ' L:' + response.data.data.hsl.l)
            $('#name').val(response.data.data.name)
            $('#displayColour').css('background-color', response.data.data.hexString)
        })
}





// alert element and style
const alertPlaceholder = document.getElementById('liveAlertPlaceholder')

const alert = (message, type) => {
    const wrapper = document.createElement('div')
    
    wrapper.innerHTML = [
        `<div class="alert alert-${type} alert-dismissible" style="margin:0 auto; margin-bottom: 25px; width: 65%;" role="alert">`,
        `   <div>${message}</div>`,
        '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
        '</div>'
    ].join('')

    alertPlaceholder.append(wrapper)
}





// pagination operations
$(function() {
    // click on the page
    $(document).on('click', '.pagination .page', function(e) {
        // remove a tag redirect
        e.preventDefault()
        
        // change active button and page text
        if(!$(this).hasClass('active')) {
            $('.pagination .page').removeClass('active')
            
            // selected page number
            selectedNumber = parseInt($(this).text())
            
            if(selectedNumber === 1) {
                $('.pagination .prev').nextAll().slice(0, 5).remove()
                createPagination(responseColourList, 1, 0, 4)
            }else if(selectedNumber === 2) {
                $('.pagination .prev').nextAll().slice(0, 5).remove()
                createPagination(responseColourList, 2, 0, 4)
            }else if(selectedNumber === totalColourNumber || selectedNumber === (totalColourNumber - 1)) {
                $('.pagination .prev').nextAll().slice(0, 5).remove()
                createPagination(responseColourList, selectedNumber, totalColourNumber - 5, totalColourNumber)
            }else {
                updatePagination(selectedNumber)
            }
        }
    })

    // click on the prev
    $(document).on('click', '.pagination .prev', function(e) {
        // remove a tag redirect
        e.preventDefault()

        // find active page
        var activePage = $('.pagination .page').filter('.active')
        var activePageNumber = parseInt(activePage.text())
        
        // go to prev page
        if(activePageNumber > 1) {
            activePage.removeClass('active')

            if(activePageNumber <= 3) {
                $('.pagination .page').eq(activePageNumber - 2).addClass('active')
                $('.pagination span').text('Page ' + $('.pagination .page').index(activePage) + ' of ' + totalColourNumber)
                setLastVisitCookie(activePageNumber - 1)

                colourId = $('.pagination .page').filter(function() {
                    return $(this).hasClass('active')
                }).data('page')
                createColourCard(colourId)
            }else if(activePageNumber >= totalColourNumber - 1) {
                $('.pagination .page').filter(function() {
                    return parseInt($(this).text()) === (activePageNumber - 1)
                }).addClass('active')
                $('.pagination span').text('Page ' + (activePageNumber - 1) + ' of ' + totalColourNumber)
                setLastVisitCookie(activePageNumber - 1)

                colourId = $('.pagination .page').filter(function() {
                    return $(this).hasClass('active')
                }).data('page')
                createColourCard(colourId)
            }else {
                updatePagination(activePageNumber - 1)
            }
        }
    })

    // click on the next
    $(document).on('click', '.pagination .next', function(e) {
        // remove a tag redirect
        e.preventDefault();
        
        // find active page
        var activePage = $('.pagination .page').filter('.active')
        var activePageNumber = parseInt(activePage.text())
        
        // go to next page
        if(activePageNumber < totalColourNumber) {
            activePage.removeClass('active')

            if(activePageNumber < 3) {
                $('.pagination .page').eq(activePageNumber).addClass('active')
                $('.pagination span').text('Page ' + ($('.pagination .page').index(activePage) + 2) + ' of ' + totalColourNumber)
                setLastVisitCookie(activePageNumber - 1)

                colourId = $('.pagination .page').filter(function() {
                    return $(this).hasClass('active')
                }).data('page')
                createColourCard(colourId)
            }else if(activePageNumber > totalColourNumber - 3) {
                $('.pagination .page').filter(function() {
                    return parseInt($(this).text()) === (activePageNumber + 1)
                }).addClass('active')
                $('.pagination span').text('Page ' + (activePageNumber + 1) + ' of ' + totalColourNumber)
                setLastVisitCookie(activePageNumber - 1)

                colourId = $('.pagination .page').filter(function() {
                    return $(this).hasClass('active')
                }).data('page')
                createColourCard(colourId)
            }else {
                updatePagination(activePageNumber + 1)
            }  
        }
    })

    // go to the specific page
    $(document).on('click', '.pagination .go', function() {
        // get input number
        var inputNumber = parseInt($('.pagination input').val())
        
        // go to page
        if(!isNaN(inputNumber) && inputNumber > 2 && inputNumber < totalColourNumber - 1) {
            $('.pagination .page').filter('.active').removeClass('active')
            updatePagination(inputNumber)
        }else if(inputNumber <= 1) {
            $('.pagination input').val(1)
            $('.pagination .prev').nextAll().slice(0, 5).remove()
            createPagination(responseColourList, 1, 0, 4)
        }else if(inputNumber === 2) {
            $('.pagination .prev').nextAll().slice(0, 5).remove()
            createPagination(responseColourList, inputNumber, inputNumber - 2, inputNumber + 2)
        }else if(inputNumber >= totalColourNumber) {
            $('.pagination input').val(totalColourNumber)
            $('.pagination .prev').nextAll().slice(0, 5).remove()
            createPagination(responseColourList, totalColourNumber, totalColourNumber - 5, totalColourNumber - 1)
        }else if(inputNumber === (totalColourNumber - 1)) {
            $('.pagination .prev').nextAll().slice(0, 5).remove()
            createPagination(responseColourList, totalColourNumber - 1, totalColourNumber - 5, totalColourNumber - 1)
        }
    })

    // press enter for input to trigger click event
    $('.pagination input').on('keyup', function(e) {
        if(e.keyCode === 13) {
            $('.pagination .go').trigger('click')
        }
    })

    // update page number(pagination)
    function updatePagination(selected) {
        getColourList()
            .then(response => {
                $('.pagination .prev').nextAll().slice(0, 5).remove()
                totalColourNumber = response.data.data.length
                responseColourList = response.data.data
                createPagination(response.data.data, selected, selected - 3, selected + 1)
            })
    }
})





// display or hide colour table
function loadTable() {
    // display or hide table
    $("#colourTableContainer").toggle()

    //  check if the table is currently displayed
    if($("#colourTableContainer").is(':visible')) {
        getColourList()
            .then(response => {
                createTable(response.data.data)
            })
        

        $("#colourTableButton").text("Hide Table")
    }else {
        $("#colourTableButton").text("Load Table")
        $('#mainTable').empty()
    }
}

// create colour table
function createTable(colours) {
    $.each(colours, function(index, item) {
        const id = $("<td></td>").append(item.colorId)
        const colour = $("<td style=\'background-color:" + item.hexString + "\'></td>")
        const name = $("<td></td>").append(item.name)
        const hex = $("<td></td>").append(item.hexString)
        const rgb = $("<td></td>").append(rgbConverter(item.rgb))
        const hsl = $("<td></td>").append(hslConverter(item.hsl))
       
        $("<tr id=" + "tr" + index + " style=\'vertical-align: middle\'></tr>").append(id).append(colour)
            .append(name).append(hex).append(rgb).append(hsl)
            .appendTo("#mainTable")
    })
}

function rgbConverter(rgb) {
    return `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`
}

function hslConverter(hsl) {
    return `hsl(${Math.round(hsl.h)}, ${hsl.s}%, ${hsl.l}%)`
}





function setLastVisitCookie(lastIndex) {
    const expirationDate = new Date()
    expirationDate.setDate(expirationDate.getDate() + 3)
    document.cookie = 'lastVisit=' + lastIndex + '; expires=' + expirationDate.toUTCString() + '; path=/'
}

function newColour() {

}

function modifyColour() {

}

function removeColour() {
    
}

function selectBackground() {
    // set cookie for background, expire time is three day
    const expirationDate = new Date()
    expirationDate.setDate(expirationDate.getDate() + 3)
    document.cookie = 'background=' + $('#hexString').val() + '; expires=' + expirationDate.toUTCString() + '; path=/'
    
    // set background colour
    $("#header").css("background-color", $('#hexString').val())
    $("#footer").css("background-color", $('#hexString').val())
}