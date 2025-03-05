export const isWordPress = () => {
    return typeof window !== 'undefined' && 
           typeof window.petfinderReactVars !== 'undefined';
};

export const getApiConfig = () => {
    if (isWordPress()) {
        return {
            apiKey: window.petfinderReactVars.apiKey,
            apiSecret: window.petfinderReactVars.apiSecret,
            isWP: true
        };
    }
    
    return {
        apiKey: import.meta.env.VITE_API_KEY,
        apiSecret: import.meta.env.VITE_API_SECRET,
        isWP: false
    };
};