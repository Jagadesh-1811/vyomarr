import { createContext, useContext, useState, useEffect } from 'react'
import {
    onAuthStateChanged,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signInWithPopup,
    GoogleAuthProvider,
    signOut,
    updateProfile,
    sendPasswordResetEmail
} from 'firebase/auth'
import { auth } from '../config/firebase'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user)
            setLoading(false)
        })
        return unsubscribe
    }, [])

    const login = async (email, password) => {
        return signInWithEmailAndPassword(auth, email, password)
    }

    const register = async (email, password, displayName) => {
        const result = await createUserWithEmailAndPassword(auth, email, password)
        if (displayName) {
            await updateProfile(result.user, { displayName })
        }
        return result
    }

    const loginWithGoogle = async () => {
        const provider = new GoogleAuthProvider()
        return signInWithPopup(auth, provider)
    }



    const logout = async () => {
        return signOut(auth)
    }

    const resetPassword = async (email) => {
        return sendPasswordResetEmail(auth, email)
    }

    const value = {
        user,
        loading,
        login,
        register,
        loginWithGoogle,
        logout,
        resetPassword
    }

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}
