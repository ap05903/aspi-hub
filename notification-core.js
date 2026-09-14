/**
 * notification-core.js
 * Modul Notifikasi Tukar Kelas & Kalendar Akademik
 */

import { 
    db, 
    collection, 
    addDoc, 
    getDocs, 
    serverTimestamp 
} from './firebase-config.js';

export async function broadcastClassNotice(data) {
    try {
        const { title, subject, originalTime, newTime, venue, targetSets, lecturerName, note } = data;

        if (!title || !subject || !newTime || targetSets.length === 0) {
            throw new Error("Sila isi semua maklumat utama pemberitahuan!");
        }

        const noticesRef = collection(db, "class_notices");
        await addDoc(noticesRef, {
            title,
            subject,
            originalTime: originalTime || "Jadual Asal",
            newTime,
            venue: venue || "Bilik Kuliah Asal",
            targetSets,
            lecturerName: lecturerName || "Pensyarah Subjek",
            note: note || "",
            createdAt: serverTimestamp()
        });

        return { success: true, message: "Pemberitahuan perubahan kelas berjaya dihantar!" };
    } catch (err) {
        console.error("Ralat menghantar pemberitahuan:", err);
        throw err;
    }
}

export async function getStudentClassNotices(studentSet) {
    try {
        const noticesRef = collection(db, "class_notices");
        const querySnapshot = await getDocs(noticesRef);

        const list = [];
        querySnapshot.forEach(docSnap => {
            const data = docSnap.data();
            if (data.targetSets.includes('ALL') || data.targetSets.includes(studentSet)) {
                list.push({
                    id: docSnap.id,
                    ...data
                });
            }
        });

        list.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));

        return list;
    } catch (err) {
        console.error("Ralat mengambil pemberitahuan kelas:", err);
        return [];
    }
}
