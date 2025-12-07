
import React, { createElement, useEffect, useState } from 'react';

// This is a simplified approach to use a CDN-loaded library.
// In a real build setup, you would use `import ReactMarkdown from 'react-markdown';`
declare const ReactMarkdown: any;

interface MarkdownProps {
    content: string;
}

const Markdown: React.FC<MarkdownProps> = ({ content }) => {
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        const checkLibrary = () => {
            if (typeof ReactMarkdown !== 'undefined') {
                setIsLoaded(true);
            } else {
                setTimeout(checkLibrary, 100);
            }
        };
        checkLibrary();
    }, []);

    if (!isLoaded) {
        return <div className="prose prose-slate max-w-none animate-pulse"><p>Loading content...</p></div>;
    }

    const CustomH1 = ({ node, ...props }: any) => <h1 className="text-3xl font-extrabold text-slate-800 border-b pb-2 mb-4" {...props} />;
    const CustomH2 = ({ node, ...props }: any) => <h2 className="text-2xl font-bold text-slate-800 border-b pb-2 mb-4" {...props} />;
    const CustomH3 = ({ node, ...props }: any) => <h3 className="text-xl font-semibold text-slate-700 mt-6 mb-3" {...props} />;

    return createElement(ReactMarkdown, {
        children: content,
        className: "prose prose-slate max-w-none prose-headings:font-sans prose-a:text-blue-600 hover:prose-a:text-blue-700",
        components: {
             h1: CustomH1,
             h2: CustomH2,
             h3: CustomH3,
        }
    });
};

export default Markdown;
