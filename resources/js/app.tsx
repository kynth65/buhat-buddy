import '../css/app.css';

import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';
import { initializeTheme } from './hooks/use-appearance';

// Ensure CSRF token is sent with all mutating requests (POST, PUT, PATCH, DELETE)
const csrfToken = (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement | null)?.content;
if (typeof window !== 'undefined' && window.fetch && csrfToken) {
    const originalFetch = window.fetch.bind(window);
    window.fetch = (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
        const requestInit: RequestInit = { ...(init || {}) };
        const url = typeof input === 'string' ? input : (input as Request).url;

        const isSameOrigin = url.startsWith('/') || url.startsWith(window.location.origin);
        const method = (requestInit.method || 'GET').toUpperCase();
        const isMutating = ['POST', 'PUT', 'PATCH', 'DELETE'].includes(method);

        if (isSameOrigin && isMutating) {
            const headers = new Headers(requestInit.headers || {});
            headers.set('X-CSRF-TOKEN', csrfToken);
            headers.set('X-Requested-With', 'XMLHttpRequest');
            requestInit.headers = headers;
            if (!requestInit.credentials) requestInit.credentials = 'same-origin';
        }

        return originalFetch(input as any, requestInit);
    };
}

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

createInertiaApp({
    title: (title) => (title ? `${title} - ${appName}` : appName),
    resolve: (name) => resolvePageComponent(`./pages/${name}.tsx`, import.meta.glob('./pages/**/*.tsx')),
    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(<App {...props} />);
    },
    progress: {
        color: '#4B5563',
    },
});

// This will set light / dark mode on load...
initializeTheme();
