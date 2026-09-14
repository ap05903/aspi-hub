// auth.js
import { 
    auth, 
    db, 
    doc, 
    setDoc, 
    getDoc, 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    signOut 
} from './firebase-config.js';

/**
 * Register a new user and save their profile details to Firestore
 */
export async function registerUser(email, password, name, role, matricNo = '', set = '') {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Save extended user profile to Firestore
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
}

/**
 * Log in an existing user and route them based on their role
 */
export async function loginUser(email, password) {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Retrieve user data to determine role
    const docRef = doc(db, "users", user.uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        const userData = docSnap.data();
        if (userData.role === 'lecturer') {
            window.location.href = 'dashboard-lecturer.html';
        } else {
            window.location.href = 'dashboard-student.html';
        }
    } else {
        window.location.href = 'dashboard-student.html';
    }

    return user;
}

/**
 * Log out the current user
 */
export async function logoutUser() {
    await signOut(auth);
    window.location.href = 'login.html';
}

/**
 * Update user profile details in Firestore
 */
export async function updateUserProfile(uid, updatedData) {
    const userRef = doc(db, "users", uid);
    await setDoc(userRef, updatedData, { merge: true });
}
