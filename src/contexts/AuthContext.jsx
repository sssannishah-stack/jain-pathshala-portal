import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged 
} from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../services/firebase';

const AuthContext = createContext();

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [userData, setUserData] = useState(null);
  const [selectedMember, setSelectedMember] = useState(null);
  const [loading, setLoading] = useState(true);

  async function login(email, password) {
    const result = await signInWithEmailAndPassword(auth, email, password);
    // Store token for API calls
    const token = await result.user.getIdToken();
    localStorage.setItem('authToken', token);
    return result;
  }

  async function logout() {
    localStorage.removeItem('authToken');
    setSelectedMember(null);
    return signOut(auth);
  }

  async function refreshToken() {
    if (currentUser) {
      const token = await currentUser.getIdToken(true);
      localStorage.setItem('authToken', token);
      return token;
    }
    return null;
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      try {
        if (user) {
          // Get fresh token
          const token = await user.getIdToken();
          localStorage.setItem('authToken', token);
          
          // Fetch user data from Firestore
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          
          if (userDoc.exists()) {
            const data = userDoc.data();
            setCurrentUser(user);
            setUserRole(data.role);
            setUserData(data);
            
            // Auto-select if single member
            if (data.members && data.members.length === 1) {
              setSelectedMember(data.members[0]);
            }
          } else {
            // User exists in Auth but not in Firestore
            console.error('User document not found in Firestore');
            await signOut(auth);
          }
        } else {
          setCurrentUser(null);
          setUserRole(null);
          setUserData(null);
          setSelectedMember(null);
          localStorage.removeItem('authToken');
        }
      } catch (error) {
        console.error('Auth state change error:', error);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  // Refresh token periodically (every 50 minutes)
  useEffect(() => {
    if (currentUser) {
      const interval = setInterval(() => {
        refreshToken();
      }, 50 * 60 * 1000);
      
      return () => clearInterval(interval);
    }
  }, [currentUser]);

  const value = {
    currentUser,
    userRole,
    userData,
    selectedMember,
    setSelectedMember,
    login,
    logout,
    refreshToken,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
