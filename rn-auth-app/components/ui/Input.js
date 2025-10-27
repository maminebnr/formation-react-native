import { TextInput, StyleSheet } from 'react-native';
export default function Input(props) {
    return <TextInput style={styles.input}
        placeholderTextColor=
        "#8a8a8a" {...props} />;
}
const styles = StyleSheet.create({
    input: {
        borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 10,
        padding: 12, fontSize: 16, backgroundColor: '#fff'
    },
});