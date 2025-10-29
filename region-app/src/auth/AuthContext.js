import { createContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [me, setMe] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const t = await AsyncStorage.getItem('token');
      const u = await AsyncStorage.getItem('user');
      if (t) setToken(t);
      if (u) setMe(JSON.parse(u));
      setLoading(false);
    })();
  }, []);

  const signIn = async ({ accessToken, user }) => {
    setToken(accessToken);
    setMe(user);
    await AsyncStorage.setItem('token', accessToken);
    await AsyncStorage.setItem('user', JSON.stringify(user));
  };

  const signOut = async () => {
    setToken(null);
    setMe(null);
    await AsyncStorage.multiRemove(['token', 'user']);
  };

  return (
    <AuthContext.Provider value={{ token, me, signIn, signOut, loading }}>
      {children}
    </AuthContext.Provider>
  );
}
