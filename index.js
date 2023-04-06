var totalColourNumber = 0
var responseColourList = {}

$(document).ready(function() {
    alert(123, 'danger')
    initialColourPagination()
   
});

function initialColourPagination() {
    $.ajax({
        url: "/colours",
        method: "GET",
        success: function(response) {
            totalColourNumber = response.length
            responseColourList = response
            createPagination(response, 1, 0, 4)
            createColourCard(0)
        },
        error: function(error) {
            alert(error, 'danger')
        }
    })
}

function createPagination(colourList, currentPage, startIndex, endIndex) {
    $('.pagination span').text('Page ' + currentPage + ' of ' + colourList.length)
    // $('.pagination input').attr('max', colourList.length)
    // $('.pagination input').attr('value', currentPage)

    $.each(colourList, function(index, item) {
        if(index >= startIndex && index <= endIndex) {
            if(index + 1 === currentPage) {
                $("<a href=\"#\" class=\"page active\"" + "data-page=\"" + item.colorId + "\"></a>").append(index + 1).insertBefore('.pagination .next')
            }else {
                $("<a href=\"#\" class=\"page\"" + "data-page=\"" + item.colorId + "\"></a>").append(index + 1).insertBefore('.pagination .next')
            }
        }
    })
}

// display or hide colour table
function loadTable() {
    // display or hide table
    $("#colourTableContainer").toggle()

    //  check if the table is currently displayed
    if($("#colourTableContainer").is(':visible')) {
        $.ajax({
            url: "/colours",
            method: "GET",
            success: function(response) {
                createTable(response)
            },
            error: function(error) {
                alert(error, 'danger')
            }
        });

        $("#colourTableButton").text("Hide Table")
    }else {
        $("#colourTableButton").text("Load Table")
        $('#mainTable').empty()
    }
}

// create color card
function createColourCard(colourId) {
    $.ajax({
        url: "/colours/" + colourId,
        method: "GET",
        success: function(response) {
            $('#colorId').val(response.colorId)
            $('#hexString').val(response.hexString)
            $('#rgb').val('R:' + response.rgb.r + ' G:' + response.rgb.g + ' B:' + response.rgb.b)
            $('#hsl').val('H:' + response.hsl.h + ' S:' + response.hsl.s + ' L:' + response.hsl.l)
            $('#name').val(response.name)
        },
        error: function(error) {
            console.log(error)
        }
    });
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

// pagination
$(function() {
    $(document).on('click', '.pagination .page', function(e) {
        // remove a tag redirect
        e.preventDefault()
        
        // change active button and page text
        if(!$(this).hasClass('active')) {
            $('.pagination .page').removeClass('active')
            $(this).addClass('active')
            $('.pagination span').text('Page ' + $(this).text() + ' of ' + totalColourNumber)
        }
    })

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
            }else if(activePageNumber >= totalColourNumber - 1) {
                $('.pagination .page').filter(function() {
                    return parseInt($(this).text()) === (activePageNumber - 1)
                }).addClass('active')
                $('.pagination span').text('Page ' + (activePageNumber - 1) + ' of ' + totalColourNumber)
            }else {
                updatePagination(activePageNumber - 1)
            }
        }
    })

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
            }else if(activePageNumber > totalColourNumber - 3) {
                $('.pagination .page').filter(function() {
                    return parseInt($(this).text()) === (activePageNumber + 1)
                }).addClass('active')
                $('.pagination span').text('Page ' + (activePageNumber + 1) + ' of ' + totalColourNumber)
            }else {
                updatePagination(activePageNumber + 1)
            }  
        }
    })

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

    // update page number
    function updatePagination(selected) {
        if(selected >= 3) {
            $.ajax({
                url: "/colours",
                method: "GET",
                success: function(response) {
                    $('.pagination .prev').nextAll().slice(0, 5).remove()
                    totalColourNumber = response.length
                    responseColourList = response
                    createPagination(response, selected, selected - 3, selected + 1)
                },
                error: function(error) {
                    alert(error, 'danger')
                }
            })
        }
    }
})

