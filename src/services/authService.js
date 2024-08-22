import { auth, db } from '../firebaseConfig';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, GoogleAuthProvider, signInWithPopup, sendPasswordResetEmail } from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc } from "firebase/firestore";

export const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
        const result = await signInWithPopup(auth, provider);
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        // The signed-in user info.
        const user = result.user;

        // Check if user exists in Firestore
        const userDocRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userDocRef);

        let role;
        if (!userDoc.exists()) {
            // Assign default role to new user
            await setDoc(userDocRef, {
                email: user.email,
                role: "user" // Default role
            });
            role = "user";
        } else {
            // Check if the user has a role
            const userData = userDoc.data();
            role = userData.role || "user";
            if (!userData.role) {
                // Assign default role if missing
                await updateDoc(userDocRef, {
                    role: "user" // Default role
                });
            }
        }

        // console.log("User Role:", role); // Log the user role

        // Return the necessary data if needed
        return { user, token, role };
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

        // Assign default role to new user
        await setDoc(doc(db, "users", user.uid), {
            email: user.email,
            role: "user" // Default role
        });
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
        // Fetch user document from Firestore
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
            const userData = userDoc.data();
            // console.log("User Role:", userData.role); // Log the user role
            // Handle the user object and role as needed (e.g., save to state, return to caller)
            return { user, role: userData.role };
        } else {
            // console.log("No such document!");
            throw new Error("User document not found");
        }
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


export const triggerResetEmail = async (email) => {
    try {
        await sendPasswordResetEmail(auth, email);
        // console.log("Password reset email sent")
    } catch (error) {
        const errorCode = error.code;
        const errorMessage = error.message;
        // Handle error appropriately (e.g., show message to user, log for debugging)
        throw new Error(`Error ${errorCode}: ${errorMessage}`);
    }
}


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


// Function to get user details by userId (in userService.js)
export const getUserDetails = async (userId) => {
    const userDoc = doc(db, 'users', userId); // Assuming you have a 'users' collection
    const userSnapshot = await getDoc(userDoc);

    if (userSnapshot.exists()) {
        return userSnapshot.data();
    } else {
        throw new Error('User not found');
    }
};