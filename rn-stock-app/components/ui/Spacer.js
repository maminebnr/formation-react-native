import { View } from 'react-native';
export default function Spacer({ h = 8, w = 0 }) {
    return <View style={{ height: h, width: w }} />;
}