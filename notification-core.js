/**
 * notification-core.js
 * Handles Academic Calendar Events and Class Schedule Change Notifications
 */

import { 
    db, 
    collection, 
    addDoc, 
    getDocs, 
    query, 
    where, 
    orderBy, 
    serverTimestamp 
} from './firebase-config.js';

/**
 * Broadcast a new Class Schedule Change / Notification (Lecturers)
 */
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
            targetSets, // e.g. ['Set 1', 'Set 2'] or ['ALL']
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

/**
 * Fetch Class Schedule Change Notices for a Student's Set
 */
export async function getStudentClassNotices(studentSet) {
    try {
        const noticesRef = collection(db, "class_notices");
        const querySnapshot = await getDocs(noticesRef);

        const list = [];
        querySnapshot.forEach(docSnap => {
            const data = docSnap.data();
            // Filter by target set or 'ALL'
            if (data.targetSets.includes('ALL') || data.targetSets.includes(studentSet)) {
                list.push({
                    id: docSnap.id,
                    ...data
                });
            }
        });

        // Sort by newest first
        list.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));

        return list;
    } catch (err) {
        console.error("Ralat mengambil pemberitahuan kelas:", err);
        return [];
    }
}

/**
 * Fetch Academic Calendar Events
 */
export async function getAcademicEvents() {
    try {
        const eventsRef = collection(db, "academic_events");
        const querySnapshot = await getDocs(eventsRef);

        const events = [];
        querySnapshot.forEach(docSnap => {
            events.push({
                id: docSnap.id,
                ...docSnap.data()
            });
        });

        return events;
    } catch (err) {
        console.error("Ralat mengambil kalendar akademik:", err);
        return [];
    }
}
