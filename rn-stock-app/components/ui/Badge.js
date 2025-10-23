import { View, Text, StyleSheet } from 'react-native';
export default function Badge({ text, style, textStyle }) {
    return (
        <View style={[styles.badge, style]}>
            <Text style={[styles.badgeText,
                textStyle]}>{text}</Text>
        </View>
    );
}
const styles = StyleSheet.create({
    badge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        backgroundColor: '#f3f4f6',
        borderRadius: 999,
        alignSelf: 'flex-start'
        ,

    },
    badgeText: {
        fontSize: 12,
        color: '#111827'
        ,
    },
});