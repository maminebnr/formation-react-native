const BASE = 'https://jsonplaceholder.typicode.com';

async function http(path, options = {}) {
    const headers = {
        'Content-Type': 'application/json',
        ...(options.headers || {})
    };
    
    const res = await fetch(BASE + path, { ...options, headers });
    
    if (!res.ok) {
        const txt = await res.text().catch(() => '');
        throw new Error(`API ${res.status}: ${txt}`);
    }
    
    try { 
        return await res.json(); 
    } catch { 
        return {}; 
    }
}

// Liste + recherche + pagination (_page/_limit)
export async function fetchPosts({ page = 1, limit = 10, q = '' } = {}) {
    const url = `/posts?_page=${page}&_limit=${limit}` + 
                (q ? `&q=${encodeURIComponent(q)}` : '');
    return http(url);
}

export async function fetchPost(id) {
    return http(`/posts/${id}`);
}

export async function fetchComments(postId) {
    return http(`/posts/${postId}/comments`);
}

// POST accepté par JSONPlaceholder mais non persistant → on l'utilise pour l'UI optimiste
export async function createPost(payload) {
    return http('/posts', {
        method: 'POST',
        body: JSON.stringify(payload)
    });
}