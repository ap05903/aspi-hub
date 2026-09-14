/**
 * lecturer-core.js
 * Modul Pengurusan Operasi Pensyarah PINTAR@Sphere
 */

import { 
    db, 
    collection, 
    addDoc, 
    getDocs, 
    doc, 
    setDoc, 
    getDoc,
    query, 
    where, 
    serverTimestamp 
} from './firebase-config.js';

/**
 * 1. Muat Naik Bahan Pembelajaran (Google Drive / OneDrive Link)
 * @param {string} title - Tajuk bahan pembelajaran
 * @param {string} subject - Nama subjek
 * @param {string} driveUrl - Pautan fail Google Drive / OneDrive
 * @param {Array<string>} targetSets - Senarai Set pelajar (cth: ['Set 1', 'Set 2'] atau ['ALL'])
 * @param {string} lecturerName - Nama pensyarah
 * @param {string} lecturerEmail - E-mel pensyarah
 */
export async function uploadLearningResource(title, subject, driveUrl, targetSets, lecturerName, lecturerEmail) {
    try {
        if (!title || !subject || !driveUrl || targetSets.length === 0) {
            throw new Error("Sila lengkapkan semua maklumat borang!");
        }

        const resourcesRef = collection(db, "learning_resources");
        await addDoc(resourcesRef, {
            title: title,
            subject: subject,
            driveUrl: driveUrl,
            targetSets: targetSets, // Array of set names or ['ALL']
            uploadedBy: lecturerName || 'Pensyarah',
            lecturerEmail: lecturerEmail || '',
            createdAt: serverTimestamp()
        });

        return { success: true, message: "Bahan pembelajaran berjaya dimuat naik!" };
    } catch (error) {
        console.error("Ralat muat naik bahan:", error);
        throw new Error("Gagal memuat naik bahan: " + error.message);
    }
}

/**
 * 2. Ambil Senarai Pelajar Mengikut Set
 * @param {string} setName - Kumpulan Set (cth: 'Set 1', 'Set 2')
 * @returns {Array<Object>} Senarai data pelajar (uid, name, matricNo, email, dll)
 */
export async function getStudentsBySet(setName) {
    try {
        if (!setName) return [];

        const usersRef = collection(db, "users");
        // Mencari pengguna dengan role 'student' dan set yang sepadan
        const q = query(
            usersRef, 
            where("role", "==", "student"),
            where("set", "==", setName)
        );

        const querySnapshot = await getDocs(q);
        const students = [];

        querySnapshot.forEach((docSnap) => {
            students.push({
                uid: docSnap.id,
                ...docSnap.data()
            });
        });

        // Menyusun pelajar mengikut nama (A-Z)
        students.sort((a, b) => (a.name || '').localeCompare(b.name || ''));

        return students;
    } catch (error) {
        console.error("Ralat mengambil senarai pelajar:", error);
        throw new Error("Gagal mengambil senarai pelajar: " + error.message);
    }
}

/**
 * 3. Kemas Kini Gred & Markah Subjek Pelajar
 * @param {string} studentUid - UID pelajar dalam Firestore
 * @param {string} subject - Nama subjek (Biology, Chemistry, etc.)
 * @param {Object} breakdownScores - Objek mengandungi markah (%) bagi setiap komponen
 */
export async function updateStudentGrades(studentUid, subject, breakdownScores) {
    try {
        if (!studentUid || !subject) {
            throw new Error("Sila pilih pelajar dan subjek yang sah!");
        }

        // Penilaian pemberat mengikut komponen subjek (Weightage Settings)
        const totalMarks = calculateTotalSubjectScore(subject, breakdownScores);
        const gradePoint = calculateGradePoint(totalMarks);

        // Rujukan Dokumen Gred Pelajar dalam Firestore: grades/{studentUid}
        const gradeDocRef = doc(db, "grades", studentUid);

        // Semak jika rekod gred pelajar sudah wujud
        const docSnap = await getDoc(gradeDocRef);
        let currentGradesData = {};

        if (docSnap.exists()) {
            currentGradesData = docSnap.data().subjects || {};
        }

        // Kemas kini atau tambah markah bagi subjek terpilih
        currentGradesData[subject] = {
            scores: breakdownScores,
            totalMarks: totalMarks,
            gradePoint: gradePoint,
            updatedAt: new Date().toISOString()
        };

        // Simpan semula ke Firestore (Merge data)
        await setDoc(gradeDocRef, {
            studentUid: studentUid,
            subjects: currentGradesData,
            lastUpdated: serverTimestamp()
        }, { merge: true });

        return { success: true, message: "Markah pelajar berjaya disimpan!" };
    } catch (error) {
        console.error("Ralat mengemas kini markah:", error);
        throw new Error("Gagal menyimpan markah: " + error.message);
    }
}

/**
 * 4. Fungsi Bantuan: Mengira Jumlah Peratusan Markah Mengikut Pemberat Subjek
 */
function calculateTotalSubjectScore(subject, scores) {
    const quiz = Number(scores.quiz) || 0;
    const assignment = Number(scores.assignment) || 0;
    const presentation = Number(scores.presentation) || 0;
    const labReport = Number(scores.labReport) || 0;
    const miniProject = Number(scores.miniProject) || 0;
    const theater = Number(scores.theater) || 0;
    const midSem = Number(scores.midSem) || 0;
    const finalExam = Number(scores.finalExam) || 0;

    let total = 0;

    // Formula Perkiraan Nisbah Pemberat Mengikut Subjek
    switch (subject) {
        case 'Biology':
            // Quiz: 10%, Assignment: 10%, Lab Report: 15%, Presentation: 5%, MidSem: 20%, Final: 40%
            total = (quiz * 0.10) + (assignment * 0.10) + (labReport * 0.15) + (presentation * 0.05) + (midSem * 0.20) + (finalExam * 0.40);
            break;

        case 'Chemistry':
        case 'Physics':
            // Quiz: 10%, Assignment: 10%, Lab Report: 20%, MidSem: 20%, Final: 40%
            total = (quiz * 0.10) + (assignment * 0.10) + (labReport * 0.20) + (midSem * 0.20) + (finalExam * 0.40);
            break;

        case 'Statistics':
            // Quiz: 10%, Assignment: 10%, Mini Project: 20%, MidSem: 20%, Final: 40%
            total = (quiz * 0.10) + (assignment * 0.10) + (miniProject * 0.20) + (midSem * 0.20) + (finalExam * 0.40);
            break;

        case 'Language and Literary Appreciation':
            // Quiz: 10%, Assignment: 15%, Theater: 25%, MidSem: 20%, Final: 30%
            total = (quiz * 0.10) + (assignment * 0.15) + (theater * 0.25) + (midSem * 0.20) + (finalExam * 0.30);
            break;

        case 'Logical Reasoning':
        case 'Jati Diri':
        case 'Research Skills':
        default:
            // Quiz: 15%, Assignment: 25%, MidSem: 20%, Final: 40%
            total = (quiz * 0.15) + (assignment * 0.25) + (midSem * 0.20) + (finalExam * 0.40);
            break;
    }

    return parseFloat(total.toFixed(2));
}

/**
 * 5. Fungsi Bantuan: Menukar Jumlah Markah (%) kepada Point Gred (0.00 - 4.00)
 */
function calculateGradePoint(marks) {
    if (marks >= 80) return 4.00; // A / A+
    if (marks >= 75) return 3.75; // A-
    if (marks >= 70) return 3.50; // B+
    if (marks >= 65) return 3.00; // B
    if (marks >= 60) return 2.75; // B-
    if (marks >= 55) return 2.50; // C+
    if (marks >= 50) return 2.00; // C
    if (marks >= 45) return 1.75; // C-
    if (marks >= 40) return 1.50; // D+
    if (marks >= 35) return 1.00; // D
    return 0.00; // F
}
