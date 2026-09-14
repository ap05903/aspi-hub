const translations = {
  en: { welcome: "Welcome to PINTAR@Sphere", gpaCalc: "GPA Calculator" },
  ms: { welcome: "Selamat Datang ke PINTAR@Sphere", gpaCalc: "Kalkulator GPA" },
  zh: { welcome: "欢迎来到 PINTAR@Sphere", gpaCalc: "GPA 计算器" },
  ta: { welcome: "PINTAR@Sphere-க்கு வரவேற்கிறோம்", gpaCalc: "GPA கணக்கிடுவான்" }
};

function setLanguage(lang) {
  localStorage.setItem('pref_lang', lang);
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (translations[lang][key]) el.textContent = translations[lang][key];
  });
}
