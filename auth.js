/**
 * auth.js
 * Modul Pengesahan Pengguna (Login/Register) berasaskan Domain UKM
 */

import { 
    auth, 
    db, 
    signInWithEmailAndPassword, 
    createUserWithEmailAndPassword, 
    signOut, 
    doc, 
    setDoc, 
    getDoc, 
    serverTimestamp 
} from './firebase-config.js';

/**
 * Mendaftar Pengguna Baharu (Pelajar atau Pensyarah)
 */
export async function registerUser(email, password, name, matricNo, role, setGroup) {
    try {
        const isUkmEmail = email.toLowerCase().endsWith('@ukm.edu.my') || email.toLowerCase().endsWith('@siswa.ukm.edu.my');
        if (!isUkmEmail) {
            throw new Error("Sila gunakan e-mel rasmi UKM (@ukm.edu.my atau @siswa.ukm.edu.my)!");
        }

        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Simpan data profil pengguna dalam Firestore
        await setDoc(doc(db, "users", user.uid), {
            uid: user.uid,
            name: name,
            email: email,
            matricNo: matricNo || '',
            role: role, // 'STUDENT' atau 'LECTURER'
            set: setGroup || 'Set 1',
            createdAt: serverTimestamp()
        });

        return { success: true, user: user };
    } catch (error) {
        console.error("Ralat Pendaftaran:", error);
        throw error;
    }
}

/**
 * Log Masuk Pengguna
 */
export async function loginUser(email, password) {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Ambil maklumat peranan (role) dari Firestore
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
            const userData = userDoc.data();
            return { success: true, user: user, role: userData.role };
        } else {
            throw new Error("Rekod profil pengguna tidak dijumpai!");
        }
    } catch (error) {
        console.error("Ralat Log Masuk:", error);
        throw error;
    }
}

/**
 * Log Keluar Sistem
 */
export async function logoutUser() {
    try {
        await signOut(auth);
        window.location.href = 'login.html';
    } catch (error) {
        console.error("Ralat Log Keluar:", error);
    }
}
