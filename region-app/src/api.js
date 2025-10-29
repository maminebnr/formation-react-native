import { BASE_URL } from './config';

export async function apiLogin(email, password) {
  const r = await fetch(`${BASE_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  if (!r.ok) throw new Error('Échec de connexion');
  return r.json(); // { accessToken, user }
}

export async function apiRegister(name, email, password) {
  const r = await fetch(`${BASE_URL}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password })
  });
  if (!r.ok) throw new Error('Échec d’inscription');
  return r.json(); // { accessToken, user }
}

export async function fetchRegions(token) {
  const r = await fetch(`${BASE_URL}/regions`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {}
  });
  if (!r.ok) throw new Error('Échec de récupération des régions');
  return r.json();
}

export async function fetchRegionById(id, token) {
  const r = await fetch(`${BASE_URL}/regions/${id}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {}
  });
  if (!r.ok) throw new Error('Échec de récupération de la région');
  return r.json();
}

export async function putRegion(region, token) {
  const r = await fetch(`${BASE_URL}/regions/${region.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    },
    body: JSON.stringify(region)
  });
  if (!r.ok) throw new Error('Échec de mise à jour');
  return r.json();
}
