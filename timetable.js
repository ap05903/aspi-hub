// ========================================
// PINTAR@Sphere - TIMETABLE LOGIC
// ========================================

// Masa Slot Pembelajaran
const timeSlots = [
    "08:00 - 09:00",
    "09:00 - 10:00",
    "10:00 - 11:00",
    "11:00 - 12:00",
    "12:00 - 01:00",
    "01:00 - 02:00", // Rehat / Break
    "02:00 - 03:00",
    "03:00 - 04:00",
    "04:00 - 05:00"
];

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

// Sample Data Jadual Waktu (Set 1 & Template Asas)
const timetableData = {
    "Set 1": {
        "Monday": {
            "08:00 - 09:00": { title: "Biology", info: "Lecture · DK1", type: "type-lecture" },
            "09:00 - 10:00": { title: "Biology", info: "Lecture · DK1", type: "type-lecture" },
            "10:00 - 11:00": { title: "Chemistry", info: "Lab · Lab A", type: "type-lab" },
            "11:00 - 12:00": { title: "Chemistry", info: "Lab · Lab A", type: "type-lab" },
            "02:00 - 03:00": { title: "Research", info: "Class · CR101", type: "type-research" }
        },
        "Tuesday": {
            "09:00 - 10:00": { title: "Physics", info: "Lecture · DK2", type: "type-lecture" },
            "10:00 - 11:00": { title: "Physics", info: "Lecture · DK2", type: "type-lecture" },
            "02:00 - 03:00": { title: "Logical Reasoning", info: "Class · CR102", type: "type-reasoning" },
            "03:00 - 04:00": { title: "Logical Reasoning", info: "Class · CR102", type: "type-reasoning" }
        },
        "Wednesday": {
            "08:00 - 09:00": { title: "Statistics", info: "Class · Lab PC", type: "type-statistics" },
            "09:00 - 10:00": { title: "Statistics", info: "Class · Lab PC", type: "type-statistics" },
            "11:00 - 12:00": { title: "LLA", info: "Lecture · DK1", type: "type-lla" },
            "02:00 - 03:00": { title: "Jati Diri", info: "Activity · Dewan", type: "type-activity" }
        },
        "Thursday": {
            "10:00 - 11:00": { title: "Biology", info: "Lab · Lab Bio 2", type: "type-lab" },
            "11:00 - 12:00": { title: "Biology", info: "Lab · Lab Bio 2", type: "type-lab" },
            "02:00 - 03:00": { title: "Physics", info: "Tutorial · CR201", type: "type-lab" }
        },
        "Friday": {
            "08:00 - 09:00": { title: "Research", info: "Lecture · DK3", type: "type-research" },
            "09:00 - 10:00": { title: "LLA", info: "Class · CR105", type: "type-lla" }
        }
    }
};

// Pilihan simpanan Laluan Set untuk Set 2 sehingga Set 11 (Fallback Dynamic Generator)
function getSetData(setName) {
    if (timetableData[setName]) {
        return timetableData[setName];
    }
    // Jika data spesifik belum diisi, paparkan struktur jadual templat secara automatik
    return timetableData["Set 1"];
}

// Render Jadual ke HTML
function renderTimetable(selectedSet) {
    const tbody = document.getElementById("timetableBody");
    const selectedSetText = document.getElementById("selectedSetText");

    if (!tbody) return;

    if (selectedSetText) {
        selectedSetText.textContent = selectedSet;
    }

    const data = getSetData(selectedSet);
    tbody.innerHTML = "";

    timeSlots.forEach(slot => {
        const tr = document.createElement("tr");

        // Sel Masa
        const timeTd = document.createElement("td");
        timeTd.className = "time-cell";
        timeTd.textContent = slot;
        tr.appendChild(timeTd);

        // Sel Rehat (12:00 - 01:00)
        if (slot === "12:00 - 01:00") {
            const breakTd = document.createElement("td");
            breakTd.className = "break-cell";
            breakTd.setAttribute("colspan", "5");
            breakTd.textContent = "LUNCH / BREAK";
            tr.appendChild(breakTd);
        } else {
            // Sel Hari (Isnin - Jumaat)
            days.forEach(day => {
                const td = document.createElement("td");
                td.className = "class-cell";

                const classInfo = data[day] && data[day][slot];

                if (classInfo) {
                    td.innerHTML = `
                        <div class="class-card ${classInfo.type}">
                            <span class="class-title">${classInfo.title}</span>
                            <span class="class-info">${classInfo.info}</span>
                        </div>
                    `;
                } else {
                    td.classList.add("empty-cell");
                }

                tr.appendChild(td);
            });
        }

        tbody.appendChild(tr);
    });
}

// Inisialisasi Event Listener
document.addEventListener("DOMContentLoaded", () => {
    const setSelect = document.getElementById("setSelect");

    // Dapatkan pilihan set dari localStorage atau guna 'Set 1' sebagai default
    const savedSet = localStorage.getItem("selectedSet") || "Set 1";

    if (setSelect) {
        setSelect.value = savedSet;

        setSelect.addEventListener("change", (e) => {
            const chosenSet = e.target.value;
            localStorage.setItem("selectedSet", chosenSet);
            renderTimetable(chosenSet);
        });
    }

    renderTimetable(savedSet);
});
