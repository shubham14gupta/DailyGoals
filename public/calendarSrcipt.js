let log = console.log;
let dateLevelSelector = $("#dateLevelSelector");
let forwardButton = $("#forward");
let backwardButton = $("#backward");


var currentSelection = 'date';
var currentDate; 
var currentWeek; 
var currentMonth; 
var currentYear; 

function setCurrentDate (){    
     currentDate = new Date();
     currentWeek = current_week();
     currentMonth = currentDate.getMonth();
     currentYear = currentDate.getFullYear();
}

setCurrentDate(); 

$("h1").css('color', 'purple'); 



var months = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"];

getCurrentDate();

dateLevelSelector.click(function () {
    currentSelection = $(this).val();
    log(currentSelection);
    getCurrentDate();
});

$('.btn').click(function () {
    var clickedButton = $(this).attr('id');
    if(clickedButton==='reset'){
        setCurrentDate(); 
    }
    else{
        if (clickedButton === 'forward') {
            direction = +1;
        } else if(clickedButton==='backward'){
            (direction = -1);
        } 
        switch (currentSelection) {
            case "date":
                currentDate.setDate(currentDate.getDate() + direction);
                break;
            case "week":
                currentWeek += direction;
                if (currentWeek <0){
                    currentWeek = 0; 
                }
                if (currentWeek >=52){
                    currentWeek=52;
                }
                break;
            case "month":
                currentMonth += direction;
                if (currentMonth < 0) {
                    currentMonth = 0;
                }
                break;
            case "year":
                currentYear += direction;
                break;
    
            default:
                break;
        }
    }
    
    getCurrentDate();
})


function getCurrentDate() {
    let date = currentDate.toDateString();
    switch (currentSelection) {
        case 'date':
            date = currentDate.toDateString();
            break;

        case 'week':
            date = "Week " + currentWeek;
            break;

        case 'month':
            date = months[currentMonth];
            break;

        case 'year':
            date = currentYear;
            break;

        default:
            break;
    }
    $('#selectedDate').text(date);
}

function current_week() {
    const d = new Date();
    let yearStart = +new Date(d.getFullYear(), 0, 1);
    let today = +new Date(d.getFullYear(), d.getMonth(), d.getDate());
    let dayOfYear = ((today - yearStart + 1) / 86400000);
    let week = Math.ceil(dayOfYear / 7);
    return week;
}
