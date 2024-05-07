let log = console.log;

$(".item").on("mouseenter", function () {
    // $("h1").css("color", 'purple');
    let selectedId = $(this).attr('value');
    log(selectedId);
    $("#b-edit-" + selectedId).removeClass("hidden");
    $("#b-del-" + selectedId).removeClass("hidden");
});


$(".item").on("mouseleave", function () {
    // $("h1").css("color", 'purple');
    let selectedId = $(this).attr('value');
    log(selectedId);
    $("#b-edit-" + selectedId).addClass("hidden");
    $("#b-del-" + selectedId).addClass("hidden");
});

$(".b-edit").on('click', function () {
    let selectedId = $(this).attr('value');
    log(selectedId);
    $("#b-done-" + selectedId).attr('hidden', false);
    $("#text-" + selectedId).attr('hidden', false);
    $("#b-edit-" + selectedId).attr('hidden', true);
    $("#b-del-" + selectedId).attr('hidden', true);
    $("#itemText-" + selectedId).text("");
})

$("#addButton").on('click', function () {
    $("#newItemText").attr('hidden', false);
    $("#newItemButton").attr('hidden', false);
    $("#addButton").attr('hidden', true);
})


$(".itemText").on('dblclick', function () {
    let selectedId = $(this).attr('value');
    log("hello" + selectedId);
    $("#strikeThroughForm-" + selectedId).submit();
    $("#itemText-" + selectedId).toggleClass("strikthrough")

})

// Calender Script code 

let dateLevelSelector = $("#dateLevelSelector");
let forwardButton = $("#forward");
let backwardButton = $("#backward");
let dateParams = document.querySelector("#dateParams");

var currentSelection = dateLevelSelector.attr('value');
document.querySelector('#dateLevelSelector').value = currentSelection;

var currentDate;
var currentWeek;
var currentMonth;
var currentYear;

var currentDateStr = $("#currentDate").attr('value');
currentDate = currentDateStr.replace(" GMT", "").replace("GMT", "").replace("GMT", "").replace("GMT", "") + "-05:00";
currentDate = new Date(currentDate); 
currentWeek = parseInt($("#currentWeek").attr('value'));
currentMonth = parseInt($("#currentMonth").attr('value'));
currentYear = parseInt($("#currentYear").attr('value'));


function resetDate(){
    currentDate = new Date(); 
    currentWeek = current_week();
    currentMonth = currentDate.getMonth();
    currentYear = currentDate.getFullYear();
}

function submitDateParamsForm() {
    dateParams.elements['selection'].value = currentSelection;
    dateParams.elements['date'].value = currentDate;
    dateParams.elements['week'].value = currentWeek;
    dateParams.elements['month'].value = currentMonth;
    dateParams.elements['year'].value = currentYear;
    dateParams.submit();
}

// setCurrentDate();

var months = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"];

getCurrentDate();

dateLevelSelector.change(function () {
    currentSelection = $(this).val();
    log(currentSelection);
    getCurrentDate();
    submitDateParamsForm();
});

$('.btn').click(function () {
    var clickedButton = $(this).attr('id');
    if (clickedButton === 'reset') {
        resetDate();
    }
    else {
        if (clickedButton === 'forward') {
            direction = +1;
        } else if (clickedButton === 'backward') {
            (direction = -1);
        }
        switch (currentSelection) {
            case "date":
                currentDate.setDate(currentDate.getDate() + direction);
                break;
            case "week":
                currentWeek += direction;
                if (currentWeek < 0) {
                    currentWeek = 0;
                }
                if (currentWeek >= 52) {
                    currentWeek = 52;
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
    submitDateParamsForm();
})


function getCurrentDate() {
    
    switch (currentSelection) {
        case 'date':
            date = new Date(currentDate).toDateString(); 
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
