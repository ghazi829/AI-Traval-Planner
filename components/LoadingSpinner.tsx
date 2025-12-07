
import React from 'react';

export const LoadingSpinner: React.FC = () => {
    const phrases = [
        "Consulting global maps...",
        "Packing virtual bags...",
        "Checking flight patterns...",
        "Asking locals for the best spots...",
        "Translating travel guides...",
        "Crafting your perfect adventure...",
    ];
    const [phrase, setPhrase] = React.useState(phrases[0]);

    React.useEffect(() => {
        let index = 0;
        const intervalId = setInterval(() => {
            index = (index + 1) % phrases.length;
            setPhrase(phrases[index]);
        }, 2500);

        return () => clearInterval(intervalId);
    }, []);

    return (
        <div className="flex flex-col items-center justify-center p-8 text-center my-8">
            <div className="relative w-24 h-24">
                <div className="absolute inset-0 border-4 border-blue-200 rounded-full"></div>
                <div className="absolute inset-0 border-t-4 border-blue-500 rounded-full animate-spin"></div>
            </div>
            <p className="mt-6 text-lg font-semibold text-slate-700 transition-opacity duration-500">{phrase}</p>
        </div>
    );
};
