// i18n.js
const translations = {
    en: {
        welcome: "Welcome to PINTAR@Sphere",
        student_dashboard: "Student Dashboard",
        lecturer_dashboard: "Lecturer Dashboard",
        gpa_calculator: "GPA Calculator",
        timetable: "Timetable & Schedule",
        resources: "Learning Resources",
        community: "Community Portal",
        login_title: "UKM Portal Login",
        email_placeholder: "enter @siswa.ukm.edu.my or @ukm.edu.my",
        logout: "Logout"
    },
    ms: {
        welcome: "Selamat Datang ke PINTAR@Sphere",
        student_dashboard: "Papan Pemuka Pelajar",
        lecturer_dashboard: "Papan Pemuka Pensyarah",
        gpa_calculator: "Kalkulator GPA",
        timetable: "Jadual Waktu & Aktiviti",
        resources: "Bahan Pembelajaran",
        community: "Portal Komuniti",
        login_title: "Log Masuk Portal UKM",
        email_placeholder: "masukkan @siswa.ukm.edu.my atau @ukm.edu.my",
        logout: "Log Keluar"
    },
    zh: {
        welcome: "欢迎来到 PINTAR@Sphere",
        student_dashboard: "学生仪表板",
        lecturer_dashboard: "讲师仪表板",
        gpa_calculator: "GPA 计算器",
        timetable: "时间表与日程",
        resources: "学习资源",
        community: "社区门户",
        login_title: "UKM 门户登录",
        email_placeholder: "输入 @siswa.ukm.edu.my 或 @ukm.edu.my",
        logout: "登出"
    },
    ta: {
        welcome: "PINTAR@Sphere-க்கு வரவேற்கிறோம்",
        student_dashboard: "மாணவர் டாஷ்போர்டு",
        lecturer_dashboard: "விரிவுரையாளர் டாஷ்போர்டு",
        gpa_calculator: "GPA கணக்கிடுவான்",
        timetable: "காலஅட்டவணை",
        resources: "கற்றல் வளங்கள்",
        community: "சமூக வலைத்தளம்",
        login_title: "UKM போர்ட்டல் உள்நுழைவு",
        email_placeholder: "@siswa.ukm.edu.my அல்லது @ukm.edu.my உள்ளிடவும்",
        logout: "வெளியேறு"
    }
};

export function setLanguage(lang) {
    localStorage.setItem("preferred_lang", lang);
    const selected = translations[lang] || translations.ms;

    document.querySelectorAll("[data-i18n]").forEach(el => {
        const key = el.getAttribute("data-i18n");
        if (selected[key]) {
            if (el.tagName === "INPUT" && el.hasAttribute("placeholder")) {
                el.placeholder = selected[key];
            } else {
                el.textContent = selected[key];
            }
        }
    });
}

export function initI18n() {
    const savedLang = localStorage.getItem("preferred_lang") || "ms";
    setLanguage(savedLang);
}
