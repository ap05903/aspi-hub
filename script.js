/**
 * script.js
 * Logik UI Am, Pengurusan Mod Gelap (Dark Mode) & Navigasi Client
 */

// Semak tetapan Dark Mode daripada localStorage semasa halaman dimuatkan
document.addEventListener('DOMContentLoaded', () => {
    const isDarkMode = localStorage.getItem('pintar_dark_mode') === 'true';
    if (isDarkMode) {
        document.body.classList.add('dark-mode');
    }
});

/**
 * Tukar Mod Gelap / Cerah secara global
 */
window.toggleDarkMode = function () {
    const body = document.body;
    body.classList.toggle('dark-mode');
    const isDark = body.classList.contains('dark-mode');
    localStorage.setItem('pintar_dark_mode', isDark);
};
