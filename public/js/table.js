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
       
        const row = $("<tr id=" + "tr" + index + " style=\'vertical-align: middle\'></tr>").append(id).append(colour)
            .append(name).append(hex).append(rgb).append(hsl)
            .appendTo("#mainTable");

        row.on("click", function() {
            const selectedPage = index + 1

            // to top
            scrollToTop()

            $('.pagination .prev').nextAll().slice(0, 5).remove();

            if(selectedPage === 1) {
                createPagination(responseColourList, 1, 0, 4);
            }else if(selectedPage === 2) {
                createPagination(responseColourList, 2, 0, 4);
            }else if(selectedPage === totalColourNumber || selectedPage === (totalColourNumber - 1)) {
                createPagination(responseColourList, selectedPage, totalColourNumber - 5, totalColourNumber - 1);
            }else {
                createPagination(responseColourList, selectedPage, index - 2, index + 2);
            }
        });

        row.on("mouseover", function() {
            row.addClass("table-hover");
        });

        row.on("mouseout", function() {
            row.removeClass("table-hover");
        });
    })
}

// go to top
function scrollToTop() {
      var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
      // step
      var step = function () {
        var distance = 0 - scrollTop;
        scrollTop = scrollTop + distance / 1.5;
        if(Math.abs(distance) < 1) {
          window.scrollTo(0, 0);
        }else {
          window.scrollTo(0, scrollTop);
          requestAnimationFrame(step);
        }
      };
      
      step();
}

function rgbConverter(rgb) {
    return `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
}

function hslConverter(hsl) {
    return `hsl(${Math.round(hsl.h)}, ${Math.round(hsl.s)}%, ${Math.round(hsl.l)}%)`;
}