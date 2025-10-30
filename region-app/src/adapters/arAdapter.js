export function normalizeFromArabic(regionDoc) {
  const areas = Array.isArray(regionDoc['المناطق']) ? regionDoc['المناطق'] : [];
  return {
    id: regionDoc.id,
    name: regionDoc.name,
    areas: areas.map(a => ({
      id: a.id,
      name: a.name,
      units: (a['الفرق'] || []).map(u => ({
        id: u.id,
        name: u.name,
        pillars: (u['المراكز'] || []).map(p => ({
          id: p.id,
          name: p.name,
          description: p.description || ''
        }))
      }))
    }))
  };
}

export function normalizeListFromArabic(regions) {
  return (regions || []).map(normalizeFromArabic);
}
