import { TextInput, StyleSheet } from 'react-native';
export default function Input(props) {
    return (
        <TextInput
            style={styles.input}
            placeholderTextColor=
            "#8a8a8a"
            {...props}
        />
    );
}
const styles = StyleSheet.create({
    input: {
        borderWidth: 1,
        borderColor: '#e5e7eb'
        ,
        borderRadius: 10,
        paddingVertical: 12,
        paddingHorizontal: 14,
        fontSize: 16,
        backgroundColor: '#fff'
        ,
    },
});