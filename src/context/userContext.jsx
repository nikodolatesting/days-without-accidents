"use client";

import { useState, useEffect, useContext, createContext } from "react";
import { 
    signInWithEmailAndPassword,
    signOut,
    sendPasswordResetEmail,
    updatePassword,
    createUserWithEmailAndPassword, 
    sendEmailVerification, 
    onAuthStateChanged,
    deleteUser,
    signInWithPopup
} from "firebase/auth";
import { auth, provider } from '@/firebase';
import { db } from '@/firebase';
import { setDoc, doc, collection, deleteDoc, getDoc } from "firebase/firestore";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

export const UserContext = createContext();

export function WrapFunction({ children }) {
    const [user, setUser] = useState(null);
    const [error, setError] = useState(null);
    const [userVerify, setUserVerify] = useState(false);
    const [lastPasswordChange, setLastPasswordChange] = useState(null);
    const router = useRouter();

    useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
        if (currentUser) {
          // Fetch user data from Firestore
          const docRef = doc(db, 'users', currentUser.uid);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            const userData = docSnap.data();
            setUser({
              uid: currentUser.uid,
              email: currentUser.email,
              user_name: currentUser.displayName,

            });
            setUserVerify(currentUser.emailVerified);
          } else {
            // User document does not exist, create it
            setUser({
              uid: currentUser.uid,
              email: currentUser.email,
              user_name: currentUser.displayName || 'Anonymous',

            });
            localStorage.setItem('userId', currentUser.uid);
          }

          Cookies.set('user_id', currentUser.uid, { expires: 365 * 20, path: '/' }); 
        } else {
          // Clear user data and cookies if logged out
          Cookies.remove('user_id', { path: '/' });
          setUser(null);
          setUserVerify(false);
          localStorage.removeItem('userId');
        }
      });

      // Cleanup on unmount
      return () => unsubscribe();
    }, []);


    // Sign up with email
    const signUpWithEmail = async (email, pass, confirmPass) => {
      if (pass !== confirmPass) {
        setError('Passwords do not match');
      } else if (pass.length <= 9) {
        setError('Password needs to be at least 9 characters');
      } else {
        try {
          const result = await createUserWithEmailAndPassword(auth, email, pass);
          await sendEmailVerification(result.user);

 

          setUser(result.user);
          setError(null);
        } catch (error) {
          console.error("Sign-up failed", error);
          setError(getErrorMessage(error.code));
        }
      }
    };

    // Handle login
    const login = async (email, password) => {
      try {
        const result = await signInWithEmailAndPassword(auth, email, password);
        if (result.user.emailVerified) {
          const docRef = doc(db, 'users', result.user.uid);
          const docSnap = await getDoc(docRef);
          const userData = docSnap.data();
          setUser({
            uid: result.user.uid,
            email: result.user.email,
            user_name: result.user.displayName,
            profilePicture: userData.profilePicture
          });
          setUserVerify(true);
        } else {
          setError('Email not verified. A verification link has been sent to your inbox.');
          await sendEmailVerification(result.user);
        }
      } catch (error) {
        console.error("Login failed", error);
        setError(getErrorMessage(error.code));
      }
    };

    // Handle logout
    const logout = async () => {
      try {
        await signOut(auth); 
        router.push('/login');
      } catch (error) {
        console.error("Logout failed", error);
      }
    };

    // Handle Google sign-in
    const googleSign = async () => {
      try {
        const result = await signInWithPopup(auth, provider.google);
        const user = result.user;
      } catch (error) {
        console.error("Error signing in with Google: ", error);
      }
    };

    // Handle GitHub sign-in
    const gitHubSign = async () => {
      try {
        const result = await signInWithPopup(auth, provider.gitHub);
        const user = result.user;
      
      } catch (error) {
        console.error("Error signing in with GitHub: ", error);
      }
    };

    // Handle password reset
    const resetPassword = async (email) => {
      sendPasswordResetEmail(auth, email);
    };

    // Change password
    const changePassword = async (newPassword) => {
      if (!user) {
        setError('User is not authenticated.');
        return;
      }

      const currentTime = Date.now();
      const cooldownPeriod = 5 * 60 * 1000; // 5 minutes

      if (lastPasswordChange && currentTime - lastPasswordChange < cooldownPeriod) {
        setError('Please wait before attempting to change your password again.');
        return;
      }

      try {
        await updatePassword(user, newPassword);
        setLastPasswordChange(currentTime);
        setError(null);
      } catch (error) {
        console.error("Failed to update password", error);
        setError(getErrorMessage(error.code));
      }
    };

    // Delete user account
    const deleteUsers = async () => {
      const docRef = doc(db, 'users', user.uid);
      await deleteDoc(docRef);
      deleteUser(user);
    };

    // Helper function for displaying error messages
    const getErrorMessage = (code) => {
      switch (code) {
        case 'auth/email-already-in-use':
          return 'Email already in use';
        case 'auth/weak-password':
          return 'Password needs to be at least 9 characters';
        case 'auth/invalid-credential':
          return 'Wrong email or password';
        case 'auth/requires-recent-login':
          return 'Please log in again to update your password.';
        default:
          return 'An unexpected error occurred. Please try again.';
      }
    };

    return (
      <UserContext.Provider value={{
        user,
        signUpWithEmail,
        error,
        logout,
        deleteUsers,
        userVerify,
        login,
        changePassword,
        setError,
        resetPassword,
        googleSign,
        gitHubSign
      }}>
        {children}
      </UserContext.Provider>
    );
}

export function useUser() {
  return useContext(UserContext);
}
