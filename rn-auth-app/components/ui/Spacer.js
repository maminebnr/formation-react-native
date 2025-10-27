import { View } from 'react-native';
export default function Spacer({ h = 8 }) {
    return <View style={{
        height: h
    }} />;
}