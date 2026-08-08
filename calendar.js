// ========================================
// ASPI HUB INTERACTIVE CALENDAR
// ========================================

const events = [

    {
        date: "2026-09-20",
        title: "Research Assignment",
        time: "11:59 PM",
        type: "assignment",
        description: "Submit your Research proposal."
    },

    {
        date: "2026-09-24",
        title: "Chemistry Quiz",
        time: "2:00 PM",
        type: "quiz",
        description: "Chemistry Chapter 1–3 assessment."
    },

    {
        date: "2026-09-28",
        title: "Physics Lab",
        time: "9:00 AM",
        type: "lab",
        description: "Physics laboratory session."
    },

    {
        date: "2026-11-10",
        title: "Final Examination",
        time: "9:00 AM",
        type: "exam",
        description: "Final examination period begins."
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


        calendarGrid.appendChild(day);

    }

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
