const api = {
    fire: async (opts = {}) => {
        if (typeof window !== 'undefined') {
            const title = opts.title || 'Ação';
            const text = opts.text || '';
            const msg = [title, text].filter(Boolean).join('\n');
            try { window.alert(msg || 'Ação executada.'); } catch (_) {}
        }
        return { isConfirmed: true, isDismissed: false, isDenied: false };
    },
};

export default api;
export const fire = api.fire;