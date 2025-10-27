import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiFetch } from '../../lib/api';

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children,navigate }) {
    const [token, setToken] = useState(null);
    const [user, setUser] = useState(null);
    const [init, setInit] = useState(true);

    useEffect(() => {
        (async () => {
            const t = await AsyncStorage.getItem('token');
            const u = await AsyncStorage.getItem('user');
            if (t) setToken(t);
            if (u) try { setUser(JSON.parse(u)); } catch { }
            setInit(false);
        })();
    }, []);

    const signIn = async (email, password) => {
        const data = await apiFetch('/login', {
            method: 'POST',
            body: JSON.stringify({ email, password })
        });
        await AsyncStorage.multiSet([
            ['token', data.accessToken],
            ['user', JSON.stringify(data.user)]
        ]);
        setToken(data.accessToken);
        setUser(data.user);
    };

    const signUp = async (params) => {
        const data = await apiFetch('/register', {
            method: 'POST',
            body: JSON.stringify(params)
        });
        console.log(data)
        await AsyncStorage.multiSet([
            ['token', data.accessToken],
            ['user', JSON.stringify(data.user)]
        ]);
        setToken(data.accessToken);
        setUser(data.user);
    };

    const signOut = async () => {
        await AsyncStorage.multiRemove(['token', 'user']);
        setToken(null);
        setUser(null);
        navigate('Login');
    };

    return (
        <AuthContext.Provider value={{
            token,
            user,
            init,
            signIn,
            signUp,
            signOut
        }}>
            {children}
        </AuthContext.Provider>
    );
}