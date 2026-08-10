// ========================================
// ASPI HUB INTERACTIVE CALENDAR
// ========================================

const events = [

    {
        date: "2026-08-10",
        title: "LLA Quiz 1",
        time: "4:00PM-6:00PM",
        type: "quiz",
        description: "Physical test"
    },

    {
        date: "2026-08-11",
        title: "Bio Quiz 2",
        time: "9:00 AM",
        type: "quiz",
        description: "Biology Chapter 2&3 assessment.(Physical)"
    },

    {
        date: "2026-08-11",
        title: "LR Quiz 1",
        time: "8:00 PM",
        type: "quiz",
        description: "LR Chapter 1&2 assessment.(online)"
    },

    {
        date: "2026-08-11",
        title: "Physics Quiz 2 ",
        time: "8:20PM-9.45PM",
        type: "quiz",
        description: "Physics Chapter 3&4 assessment.(Online)"
    },

    {
        date: "2026-08-13",
        title: "Chemistry Quiz 2",
        time: "8:00PM-10:00PM",
        type: "quiz",
        description: "Chemistry Chapter 2&3 assessment.(Online)"
    },

    {
        date: "2026-08-14",
        title: "Research Quiz 1",
        time: "According to set.",
        type: "quiz",
        description: "Physical test."
    },

    {
        date: "2026-08-13",
        title: "Research Quiz 1",
        time: "According to set.",
        type: "quiz",
        description: "Physical test."
    },

    {
        date: "2026-08-12",
        title: "Research Quiz 1",
        time: "According to set.",
        type: "quiz",
        description: "Physical test."
    }

];


// Current month being displayed

let currentDate = new Date();
currentDate.setDate(1);


// Calendar elements

const calendarGrid = document.getElementById("calendarGrid");
const monthTitle = document.getElementById("monthTitle");


// Month names

const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
];


// Create calendar

function renderCalendar() {

    calendarGrid.innerHTML = "";

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    monthTitle.textContent =
        monthNames[month] + " " + year;


    // First day of month

    const firstDay =
        new Date(year, month, 1).getDay();


    // Number of days

    const daysInMonth =
        new Date(year, month + 1, 0).getDate();


    // Previous month's days

    const previousMonthDays =
        new Date(year, month, 0).getDate();


    // Create previous month cells

    for (let i = firstDay - 1; i >= 0; i--) {

        const day = document.createElement("div");

        day.className = "day other-month";

        day.innerHTML =
            `<span class="day-number">${previousMonthDays - i}</span>`;

        day.addEventListener("click", function () {

    showDateEvents(dateString);

});

        calendarGrid.appendChild(day);

    }


    // Create current month

    for (let dayNumber = 1; dayNumber <= daysInMonth; dayNumber++) {

        const day = document.createElement("div");

        day.className = "day";


        const dateString =
            `${year}-${String(month + 1).padStart(2, "0")}-${String(dayNumber).padStart(2, "0")}`;


        day.innerHTML =
            `<div class="day-number">${dayNumber}</div>`;


        // Check if today

        const today = new Date();

        if (
            dayNumber === today.getDate() &&
            month === today.getMonth() &&
            year === today.getFullYear()
        ) {

            day.classList.add("today");

        }


        // Find events for this date

        const dayEvents =
            events.filter(event => event.date === dateString);


        // Add events

        dayEvents.forEach(event => {

            const eventElement =
                document.createElement("div");

            eventElement.className =
                `event ${event.type}`;

            eventElement.textContent =
                event.title;


            eventElement.addEventListener("click", function(e) {

                e.stopPropagation();

                showEvent(event);

            });


            day.appendChild(eventElement);

        });
day.addEventListener("click", function () {

    showDateEvents(dateString);

});

        calendarGrid.appendChild(day);

    }

}

function showDateEvents(dateString) {

    const selectedEvents =
        events.filter(event => event.date === dateString);


    const dateParts =
        dateString.split("-");

    const formattedDate =
        `${dateParts[2]} / ${dateParts[1]} / ${dateParts[0]}`;


    document.getElementById("eventTitle").textContent =
        `📅 ${formattedDate}`;


    const timeElement =
        document.getElementById("eventTime");

    const descriptionElement =
        document.getElementById("eventDescription");


    if (selectedEvents.length === 0) {

        timeElement.textContent =
            "No events scheduled";

        descriptionElement.textContent =
            "You have no scheduled events for this date.";

    } else {

        timeElement.innerHTML =
            selectedEvents
                .map(event => `🕐 ${event.time} — ${event.title}`)
                .join("<br>");

        descriptionElement.innerHTML =
            selectedEvents
                .map(event => `• ${event.description}`)
                .join("<br>");

    }


    document.getElementById("eventModal").style.display =
        "flex";

}

// Show event popup

function showEvent(event) {

    document.getElementById("eventTitle").textContent =
        event.title;

    document.getElementById("eventTime").textContent =
        event.time;

    document.getElementById("eventDescription").textContent =
        event.description;

    document.getElementById("eventModal").style.display =
        "flex";

}


// Close popup

function closeEvent() {

    document.getElementById("eventModal").style.display =
        "none";

}


// Previous month

document.getElementById("previousMonth")
    .addEventListener("click", function() {

        currentDate.setMonth(
            currentDate.getMonth() - 1
        );

        renderCalendar();

    });


// Next month

document.getElementById("nextMonth")
    .addEventListener("click", function() {

        currentDate.setMonth(
            currentDate.getMonth() + 1
        );

        renderCalendar();

    });

// Today button

document.getElementById("todayButton")
    .addEventListener("click", function() {

        currentDate = new Date();
        currentDate.setDate(1);

        renderCalendar();

    });

// Close popup when clicking outside

window.addEventListener("click", function(event) {

    const modal =
        document.getElementById("eventModal");

    if (event.target === modal) {

        closeEvent();

    }

});


// Start calendar

renderCalendar();

document.getElementById("todayButton").addEventListener("click", function () {

    currentDate = new Date();
    currentDate.setDate(1);

    renderCalendar();

});
