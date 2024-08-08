import { auth } from '../firebaseConfig';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';


export const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
        const result = await signInWithPopup(auth, provider);
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        // The signed-in user info.
        const user = result.user;

        // Return the necessary data if needed
        return { user, token };
    } catch (error) {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        const email = error.customData?.email;
        const credential = GoogleAuthProvider.credentialFromError(error);

        // You could return an error object or handle the error in another way
        return { errorCode, errorMessage, email, credential };
    }
};

export const registerUser = async (email, password) => {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        // Handle the user object as needed (e.g., save to state, return to caller)
        return user;
    } catch (error) {
        const errorCode = error.code;
        const errorMessage = error.message;
        // Handle error appropriately (e.g., show message to user, log for debugging)
        throw new Error(`Error ${errorCode}: ${errorMessage}`);
    }
};

export const loginUser = async (email, password) => {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        // Handle the user object as needed (e.g., save to state, return to caller)
        return user;
    } catch (error) {
        const errorCode = error.code;
        const errorMessage = error.message;
        // Handle error appropriately (e.g., show message to user, log for debugging)
        throw new Error(`Error ${errorCode}: ${errorMessage}`);
    }
};

export const logoutUser = async () => {
    try {
        await signOut(auth);
        // Handle post-logout actions here (e.g., update UI, redirect to login page)
    } catch (error) {
        // Handle error appropriately if logout fails
        console.error('Logout failed:', error);
    }
};

onAuthStateChanged(auth, (user) => {
    if (user) {
        // User is signed in, handle accordingly
        const uid = user.uid;
        // For example, save UID to your app's state, or pass it to another function
        return uid;
    } else {
        // User is signed out, handle accordingly (e.g., redirect to login page)
    }
});
