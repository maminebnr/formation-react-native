import React, {
    createContext, useContext, useRef, useState,
    useCallback
} from 'react';
import { Animated, Text, StyleSheet, View, Easing } from'react-native';
const ToastContext = createContext({ show: () => { } });
export const useToast = () => useContext(ToastContext);
export function ToastProvider({ children }) {
    const [msg, setMsg] = useState('');
    const [visible, setVisible] = useState(false);
    const y = useRef(new Animated.Value(-80)).current;
    const show = useCallback((text, duration = 2000) => {
        setMsg(text); setVisible(true);
        Animated.timing(y, {
            toValue: 0, duration: 250, easing:
                Easing.out(Easing.quad), useNativeDriver: true
        }).start(() => {
            setTimeout(() => {
                Animated.timing(y, {
                    toValue: -80, duration: 200, easing:
                        Easing.in(Easing.quad), useNativeDriver: true
                })
                    .start(() => setVisible(false));
            }, duration);
        });
    }, [y]);
    return (
        <ToastContext.Provider value={{ show }}>
            <View style={{ flex: 1 }}>
                {children}
                {visible && (
                    <Animated.View style={[styles.toast, {
                        transform: [{
                            translateY: y
                        }]
                    }]}>
                        <Text style={styles.text}>{msg}</Text>
                    </Animated.View>
                )}
            </View>
        </ToastContext.Provider>
    );
}
const styles = StyleSheet.create({
    toast: {
        position: 'absolute'
        , top: 0, left: 12, right: 12,
        backgroundColor: '#111827'
        , padding: 10, borderRadius: 12
    },
    text: {
        color: '#fff'
        , textAlign: 'center'
        , fontWeight: '600'
    },
});