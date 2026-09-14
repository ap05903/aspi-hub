// student-core.js
import { db, doc, getDoc, collection, query, where, getDocs } from "./firebase-config.js";

// 1. Dapatkan Profil Pelajar yang Log Masuk
export async function getStudentProfile(uid) {
    const userDoc = await getDoc(doc(db, "users", uid));
    if (userDoc.exists()) {
        return userDoc.data();
    }
    throw new Error("Profil pelajar tidak dijumpai.");
}

// 2. Ambil Bahan Pembelajaran (Filtered by Set & All Sets)
export async function getStudentResources(studentSet, subject = "ALL") {
    const resourcesRef = collection(db, "resources");
    let q;

    if (subject === "ALL") {
        q = query(resourcesRef, where("targetSets", "array-contains-any", [studentSet, "ALL"]));
    } else {
        q = query(resourcesRef, where("subject", "==", subject), where("targetSets", "array-contains-any", [studentSet, "ALL"]));
    }

    const querySnapshot = await getDocs(q);
    const resources = [];
    querySnapshot.forEach(doc => {
        resources.push({ id: doc.id, ...doc.data() });
    });
    return resources;
}

// 3. Ambil Markah & GPA Pelajar
export async function getStudentGPAData(studentUid) {
    const gradeDoc = await getDoc(doc(db, "grades", studentUid));
    if (gradeDoc.exists()) {
        return gradeDoc.data();
    }
    return null; // Belum diisi oleh lecturer
}
