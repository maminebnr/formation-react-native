import React, { Component } from 'react'
import { Text, View, FlatList, StyleSheet,StatusBar } from 'react-native'
import Card from '../components/ui/Card';

const products = [
    { id: '1', name: 'Produit 1' },
    { id: '2', name: 'Produit 2' },
    { id: '3', name: 'Produit 3' },
];
export default function ListScreen() {

    return (
        <View style={styles.container}>
            <FlatList
                data={products}
                renderItem={({ item }) => (
                    <Card >
                        <Text style={styles.text}>{item.name}</Text>
                    </Card>
                )}
                keyExtractor={(item, index) => index.toString()}
                contentContainerStyle={{ padding: 16 }}
            />
        </View>)
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: StatusBar.currentHeight || 0,
    },
    item: {
        backgroundColor: '#f9c2ff',
        padding: 20,
        marginVertical: 8,
        marginHorizontal: 16,
    },
    title: {
        fontSize: 40,
    }, text: {
        fontSize: 50,
    },
})



