/**
 * student-core.js
 * Modul Pengurusan Data Pelajar (Profil, Bahan Pembelajaran, dan GPA)
 */

import { 
    db, 
    doc, 
    getDoc, 
    collection, 
    getDocs, 
    query, 
    where 
} from './firebase-config.js';

export async function getStudentProfile(uid) {
    try {
        const docRef = doc(db, "users", uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            return docSnap.data();
        } else {
            throw new Error("Profil pelajar tidak dijumpai!");
        }
    } catch (error) {
        console.error("Ralat mendapatkan profil pelajar:", error);
        throw error;
    }
}

export async function getStudentResources(studentSet) {
    try {
        const resourcesRef = collection(db, "learning_resources");
        const querySnapshot = await getDocs(resourcesRef);

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

        return list;
    } catch (error) {
        console.error("Ralat mengambil bahan pembelajaran:", error);
        return [];
    }
}

export async function getStudentGPAData(uid) {
    try {
        const gradeDocRef = doc(db, "grades", uid);
        const docSnap = await getDoc(gradeDocRef);

        if (docSnap.exists()) {
            return docSnap.data();
        } else {
            return { subjects: {} };
        }
    } catch (error) {
        console.error("Ralat mengambil markah GPA:", error);
        return { subjects: {} };
    }
}
