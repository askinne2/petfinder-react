export const escapeHtml = (unsafe) => {
    if (typeof unsafe !== 'string') return '';
    return unsafe
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
};

export const sanitizeUrl = (url) => {
    if (!url) return '#';
    try {
        const parsed = new URL(url);
        return /^(https?:)?\/\//.test(parsed.href) ? parsed.href : '#';
    } catch (e) {
        return '#';
    }
};