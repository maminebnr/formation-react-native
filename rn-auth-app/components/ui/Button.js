import { Pressable, Text, StyleSheet } from 'react-native';
export default function Button({ style, textStyle, children,...props }) {
    return (
        <Pressable style={[styles.btn, style]} {...props}>
            <Text style={[styles.txt, textStyle]}>{children}</Text>
        </Pressable>
    );
}
const styles = StyleSheet.create({
   btn: { backgroundColor: '#2563eb', 
    padding: 12, 
    borderRadius: 6,
    alignItems: 'center' },
    txt: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 16
    }});