// lecturer-core.js
import { db, collection, addDoc, doc, setDoc, getDocs, query, where } from "./firebase-config.js";

// 1. Muat Naik Bahan Pembelajaran (Guna Google Drive Link)
export async function uploadLearningResource(title, subject, driveUrl, targetSets, lecturerName, lecturerEmail) {
    if (!driveUrl.startsWith("http://") && !driveUrl.startsWith("https://")) {
        throw new Error("Sila masukkan pautan (URL) Google Drive yang sah.");
    }

    const resourceData = {
        title: title,
        subject: subject,
        driveUrl: driveUrl,
        targetSets: targetSets, // Array contoh: ["Set 1", "Set 3"] atau ["ALL"]
        uploadedByEmail: lecturerEmail,
        uploadedByName: lecturerName,
        createdAt: new Date().toISOString()
    };

    const docRef = await addDoc(collection(db, "resources"), resourceData);
    return docRef.id;
}

// 2. Dapatkan Senarai Pelajar Mengikut Set (Untuk Lecturer)
export async function getStudentsBySet(setName) {
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("role", "==", "STUDENT"), where("set", "==", setName));
    const querySnapshot = await getDocs(q);
    
    const students = [];
    querySnapshot.forEach(doc => {
        students.push({ id: doc.id, ...doc.data() });
    });
    return students;
}

// 3. Kemaskini / Save Markah GPA Pelajar
export async function updateStudentGrades(studentUid, subject, breakdownScores) {
    const gradeRef = doc(db, "grades", studentUid);
    
    await setDoc(gradeRef, {
        [subject]: breakdownScores,
        updatedAt: new Date().toISOString()
    }, { merge: true });
}
