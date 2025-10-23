import { Pressable, Text, StyleSheet } from 'react-native';

export default function Button({ style, textStyle, children,
    ...props }) {
    return (
        <Pressable style={[styles.btn, style]} {...props}>
            <Text style={[styles.txt, textStyle]}>{children}</Text>
        </Pressable>
    );
}
const styles = StyleSheet.create({
    btn: {
        backgroundColor: '#2563eb',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 10,
        alignItems: 'center'
        ,
        justifyContent: 'center'

    },
    txt: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 16,
    },
});