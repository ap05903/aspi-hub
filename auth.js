/**
 * auth.js - Pengurusan Autentikasi Utama (Log Masuk, Daftar & Log Keluar)
 * PINTAR@Sphere System
 */
import { 
    auth, 
    db, 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    signOut, 
    doc, 
    setDoc, 
    getDoc 
} from './firebase-config.js';

// ==========================================
// 1. FUNGSI DAFTAR AKAUN BAHARU (REGISTER)
// ==========================================
export async function registerUser(email, password, name, role, matricNo = '', set = '') {
    try {
        // Cipta akaun pengguna baharu di Firebase Auth
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Simpan perincian profil pengguna ke dalam Firestore Database
        await setDoc(doc(db, "users", user.uid), {
            uid: user.uid,
            name: name,
            email: email,
            role: role,
            matricNo: role === 'student' ? matricNo : '',
            set: role === 'student' ? set : '',
            createdAt: new Date().toISOString()
        });

        return user;
    } catch (error) {
        console.error("Ralat semasa pendaftaran:", error.message);
        throw error;
    }
}

// ==========================================
// 2. FUNGSI LOG MASUK (LOGIN)
// ==========================================
export async function loginUser(email, password) {
    try {
        // Log masuk pengguna menggunakan Firebase Auth
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Semak rekod dan peranan (Role) pengguna dari Firestore
        const userDocRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userDocRef);
        
        if (userDoc.exists()) {
            const userData = userDoc.data();
            alert(`Log masuk berjaya! Selamat datang, ${userData.name}.`);

            // Dihala (Redirect) ke halaman dashboard mengikut peranan
            if (userData.role === 'lecturer') {
                window.location.href = 'dashboard-lecturer.html';
            } else {
                window.location.href = 'dashboard-student.html';
            }
        } else {
            alert('Maklumat profil pengguna tidak wujud dalam database!');
        }
    } catch (error) {
        console.error("Ralat log masuk:", error);
        let errorMsg = "Log Masuk Gagal: Sila semak e-mel dan kata laluan anda.";
        if (error.code === 'auth/user-not-found') errorMsg = "Akaun tidak dijumpai. Sila daftar terlebih dahulu.";
        if (error.code === 'auth/wrong-password') errorMsg = "Kata laluan salah. Sila cuba lagi.";
        alert(errorMsg);
    }
}

// ==========================================
// 3. FUNGSI LOG KELUAR (LOGOUT)
// ==========================================
export async function logoutUser() {
    try {
        await signOut(auth);
        window.location.href = 'login.html';
    } catch (error) {
        console.error("Ralat semasa log keluar:", error);
        alert("Gagal untuk log keluar. Sila cuba lagi.");
    }
}

// Menjadikan fungsi boleh dipanggil terus dari HTML jika perlu
window.loginUser = loginUser;
window.logoutUser = logoutUser;
