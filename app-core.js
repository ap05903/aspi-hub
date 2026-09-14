/**
 * app-core.js
 * Modul Pengurusan Utama Pelajar, Pensyarah, Bahan & Dark Mode
 */
import { db, doc, getDoc, collection, getDocs, addDoc, serverTimestamp } from './firebase-config.js';

// --- DARK MODE LOGIC ---
document.addEventListener('DOMContentLoaded', () => {
    if (localStorage.getItem('pintar_dark_mode') === 'true') {
        document.body.classList.add('dark-mode');
    }
});

export function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('pintar_dark_mode', document.body.classList.contains('dark-mode'));
}
window.toggleDarkMode = toggleDarkMode;

// --- PROFIL PELAJAR & BAHAN ---
export async function getStudentProfile(uid) {
    const docSnap = await getDoc(doc(db, "users", uid));
    if (docSnap.exists()) return docSnap.data();
    throw new Error("Profil tidak dijumpai!");
}

export async function getStudentResources(studentSet) {
    const querySnapshot = await getDocs(collection(db, "learning_resources"));
    const list = [];
    querySnapshot.forEach(docSnap => {
        const data = docSnap.data();
        if (data.targetSets.includes('ALL') || data.targetSets.includes(studentSet)) {
            list.push({ id: docSnap.id, ...data });
        }
    });
    return list;
}

// --- PENSYARAH LOGIC ---
export async function uploadLearningResource(title, subject, driveUrl, targetSets, lecturerName) {
    return await addDoc(collection(db, "learning_resources"), {
        title, subject, driveUrl, targetSets, lecturerName, createdAt: serverTimestamp()
    });
}
