function toggleDarkMode() {
    document.body.classList.toggle("dark-mode");

    if (document.body.classList.contains("dark-mode")) {
        localStorage.setItem("theme", "dark");
    } else {
        localStorage.setItem("theme", "light");
    }
}

window.onload = function () {
    if (localStorage.getItem("theme") === "dark") {
        document.body.classList.add("dark-mode");
    }
}

// ========================================
// ASPI HUB WELCOME INTRO
// ========================================

window.addEventListener("load", function () {

    const welcomeScreen =
        document.getElementById("welcomeScreen");

    if (!welcomeScreen) {
        return;
    }

    setTimeout(function () {

        welcomeScreen.classList.add("hide");

    }, 2500);


    setTimeout(function () {

        welcomeScreen.remove();

    }, 3300);

});
