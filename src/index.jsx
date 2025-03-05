import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { isWordPress } from './config/environment';
import './index.css';

const mount = () => {
    const rootElement = document.getElementById(
        isWordPress() ? 'petfinder-react-root' : 'root'
    );
    
    if (rootElement) {
        // Get WordPress shortcode attributes if they exist
        const attributes = rootElement.dataset.attributes 
            ? JSON.parse(rootElement.dataset.attributes)
            : {};

        const root = createRoot(rootElement);
        root.render(
            <React.StrictMode>
                <App initialAttributes={attributes} />
            </React.StrictMode>
        );
    }
};

// Mount immediately in standalone mode
if (!isWordPress()) {
    mount();
}

// Mount when DOM is ready in WordPress
if (isWordPress()) {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', mount);
    } else {
        mount();
    }
}
