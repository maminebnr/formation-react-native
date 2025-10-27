import AsyncStorage from '@react-native-async-storage/async-storage';
export const BASE_URL = 'http://192.168.15.133:3000'; // ⚠ Mets l'IP locale si tu testes sur un téléphone
async function authHeader() {
    const t = await AsyncStorage.getItem('token');
    return t ? {
        Authorization:
            `Bearer ${t}`
    } : {};
}
export async function apiFetch(path, options = {}) {
    const headers = {
        'Content-Type': 'application/json'
        , ...(await
            authHeader()), ...(options.headers || {})
    };
    console.log(headers)
    const res = await fetch(`${BASE_URL}${path}`
        , {
            ...options,
            headers
        });
        console.log(res.ok,options)
    if (!res.ok) throw new Error(`Erreur API ${res.status}`);
    try { return await res.json(); } catch { return {}; }
}
export const ProductsApi = {
    list: () => apiFetch('/products'),
    create: (data) => apiFetch('/products', {
        method: 'POST', body:
            JSON.stringify(data)
    }),
    update: (id, data) => apiFetch(`/products/${id}`, {
        method:
            'PATCH', body: JSON.stringify(data)
    }),
    remove: (id) => apiFetch(`/products/${id}`, { method: 'DELETE' }),
};