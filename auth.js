// auth.js
import { 
    auth, 
    db, 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    signOut, 
    onAuthStateChanged,
    doc, 
    setDoc, 
    getDoc 
} from "./firebase-config.js";

// Penentu Peranan Berdasarkan E-mel UKM
function getRoleFromEmail(email) {
    const cleanEmail = email.trim().toLowerCase();
    if (cleanEmail.endsWith("@siswa.ukm.edu.my")) {
        return { role: "STUDENT", domainValid: true };
    } else if (cleanEmail.endsWith("@ukm.edu.my")) {
        return { role: "LECTURER", domainValid: true };
    }
    return { role: null, domainValid: false };
}

// 1. Fungsi Pendaftaran (Register)
export async function registerUser(email, password, name, matricNo = "", assignedSet = "Set 1", subjectsTaught = []) {
    const { role, domainValid } = getRoleFromEmail(email);

    if (!domainValid) {
        throw new Error("E-mel tidak sah! Gunakan @siswa.ukm.edu.my (Pelajar) atau @ukm.edu.my (Pensyarah).");
    }

    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Simpan Profil Pengguna ke Cloud Firestore
        const userData = {
            uid: user.uid,
            name: name,
            email: email,
            role: role,
            createdAt: new Date().toISOString()
        };

        if (role === "STUDENT") {
            userData.matricNo = matricNo;
            userData.set = assignedSet; // Penetapan Set (Contoh: Set 3)
        } else if (role === "LECTURER") {
            userData.subjectsTaught = subjectsTaught; // Senarai Subjek Diajar
        }

        await setDoc(doc(db, "users", user.uid), userData);
        return { user, role };
    } catch (error) {
        throw error;
    }
}

// 2. Fungsi Log Masuk (Login)
export async function loginUser(email, password) {
    const { role, domainValid } = getRoleFromEmail(email);

    if (!domainValid) {
        throw new Error("E-mel mesti berakhir dengan @siswa.ukm.edu.my atau @ukm.edu.my");
    }

    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Ambil Data Profil dari Firestore
        const userDoc = await getDoc(doc(db, "users", user.uid));
        
        if (userDoc.exists()) {
            const profile = userDoc.data();
            localStorage.setItem("userRole", profile.role);
            localStorage.setItem("userName", profile.name);
            if (profile.set) localStorage.setItem("userSet", profile.set);
            
            // Redirect Mengikut Peranan
            redirectUserByRole(profile.role);
            return profile;
        } else {
            throw new Error("Profil pengguna tidak dijumpai dalam rekod Firestore.");
        }
    } catch (error) {
        throw error;
    }
}

// 3. Fungsi Log Keluar (Logout)
export async function logoutUser() {
    await signOut(auth);
    localStorage.clear();
    window.location.href = "login.html";
}

// 4. Semakan Akses & Protection Halaman
export function checkAuthProtection(requiredRole = null) {
    onAuthStateChanged(auth, async (user) => {
        if (!user) {
            if (!window.location.pathname.endsWith("login.html")) {
                window.location.href = "login.html";
            }
        } else {
            const userDoc = await getDoc(doc(db, "users", user.uid));
            if (userDoc.exists()) {
                const profile = userDoc.data();
                if (requiredRole && profile.role !== requiredRole) {
                    alert("Akses dilarang! Anda tidak mempunyai kebenaran untuk halaman ini.");
                    redirectUserByRole(profile.role);
                }
            }
        }
    });
}

// Redirect Helper
function redirectUserByRole(role) {
    if (role === "STUDENT") {
        window.location.href = "dashboard-student.html";
    } else if (role === "LECTURER") {
        window.location.href = "dashboard-lecturer.html";
    }
}
