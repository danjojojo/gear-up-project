import React, { createContext, useState } from 'react';


const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [profile, setProfile] = useState(null);
    const [loggedIn, setLoggedIn] = useState(false);

    const login = (user) => {
        setProfile(user);
        setLoggedIn(true);
    }

    const logout = () => {
        setProfile(null);
        setLoggedIn(false);
    }

    return (
        <AuthContext.Provider value={{ profile, loggedIn, login, logout }}>
            {children}
        </AuthContext.Provider>
    )
}

export { AuthContext, AuthProvider };