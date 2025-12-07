
import React, { useState, useCallback, useRef } from 'react';
import { GoogleGenAI } from "@google/genai";
import { generateTravelPlan } from './services/geminiService';
import { GroundingChunk } from './types';
import { LoadingSpinner } from './components/LoadingSpinner';
import { Plane, Search, WandSparkles, Link as LinkIcon, MapPin, ExternalLink, Globe } from './components/icons';
import Markdown from './components/Markdown';

const App: React.FC = () => {
    const [destination, setDestination] = useState<string>('');
    const [itinerary, setItinerary] = useState<string | null>(null);
    const [sources, setSources] = useState<GroundingChunk[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const resultsRef = useRef<HTMLDivElement>(null);

    const handleGeneratePlan = useCallback(async (event: React.FormEvent) => {
        event.preventDefault();
        if (!destination.trim()) {
            setError('Please enter a destination.');
            return;
        }

        setIsLoading(true);
        setItinerary(null);
        setSources([]);
        setError(null);

        try {
            const { plan, groundingChunks } = await generateTravelPlan(destination);
            setItinerary(plan);
            setSources(groundingChunks);
            setTimeout(() => {
              resultsRef.current?.scrollIntoView({ behavior: 'smooth' });
            }, 100);
        } catch (e: any) {
            setError(`Failed to generate travel plan. ${e.message}`);
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    }, [destination]);
    
    const handleExampleClick = (exampleDestination: string) => {
        setDestination(exampleDestination);
    };

    return (
        <div className="min-h-screen bg-slate-100 flex flex-col">
            <header className="w-full bg-white shadow-sm p-4 sticky top-0 z-10 backdrop-blur-md bg-opacity-80">
                <div className="container mx-auto flex items-center justify-center">
                    <Plane className="w-8 h-8 text-blue-500 mr-3" />
                    <h1 className="text-2xl font-bold text-slate-800 tracking-tight">AI Travel Planner</h1>
                </div>
            </header>

            <main className="flex-grow container mx-auto p-4 md:p-8">
                <div className="max-w-4xl mx-auto">
                    {!itinerary && !isLoading && (
                         <div className="text-center bg-white p-8 rounded-xl shadow-lg border border-slate-200">
                             <WandSparkles className="w-16 h-16 text-blue-500 mx-auto mb-4" />
                             <h2 className="text-3xl font-extrabold text-slate-900 mb-2">Your Next Adventure Awaits</h2>
                             <p className="text-slate-600 mb-6 max-w-2xl mx-auto">
                                 Enter a destination below and our AI will craft a personalized travel itinerary just for you, complete with attractions, schedules, and local tips.
                             </p>
                             <div className="flex justify-center items-center gap-2 mt-4">
                                <span className="text-slate-500 font-medium">Try:</span>
                                {['Paris', 'Tokyo', 'Bali', 'Rome'].map(d => (
                                    <button 
                                        key={d}
                                        onClick={() => handleExampleClick(d)}
                                        className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-sm font-semibold hover:bg-blue-100 hover:text-blue-600 transition-colors"
                                    >
                                        {d}
                                    </button>
                                ))}
                             </div>
                         </div>
                    )}

                    {error && (
                        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md shadow my-4" role="alert">
                            <p className="font-bold">Error</p>
                            <p>{error}</p>
                        </div>
                    )}
                    
                    <div ref={resultsRef}>
                        {isLoading && <LoadingSpinner />}
                        {itinerary && (
                            <div className="bg-white rounded-xl shadow-lg border border-slate-200 mt-8 animate-fade-in">
                                <div className="p-6 md:p-8 border-b border-slate-200">
                                    <div className="flex items-center">
                                        <MapPin className="w-8 h-8 text-blue-500 mr-4"/>
                                        <div>
                                            <p className="text-sm font-semibold text-blue-600">Your trip to</p>
                                            <h2 className="text-4xl font-extrabold text-slate-900 capitalize">{destination}</h2>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-6 md:p-8">
                                    <Markdown content={itinerary} />
                                </div>
                                {sources.length > 0 && (
                                     <div className="p-6 md:p-8 border-t border-slate-200 bg-slate-50/50 rounded-b-xl">
                                         <div className="flex items-center mb-4">
                                            <Globe className="w-5 h-5 text-slate-500 mr-3" />
                                            <h3 className="text-lg font-bold text-slate-700">Information Sources</h3>
                                         </div>
                                         <ul className="space-y-2">
                                             {/* FIX: Filter out sources without a valid URI to prevent rendering broken links.
                                                 Also, provide a fallback for the link's title and text content to improve UX. */}
                                             {sources.filter(source => source.web?.uri).map((source, index) => (
                                                 <li key={index} className="flex items-start">
                                                      <ExternalLink className="w-4 h-4 text-blue-500 mr-2 mt-1 flex-shrink-0" />
                                                     <a
                                                         href={source.web.uri}
                                                         target="_blank"
                                                         rel="noopener noreferrer"
                                                         className="text-blue-600 hover:underline text-sm truncate"
                                                         title={source.web.title || source.web.uri}
                                                     >
                                                         {source.web.title || source.web.uri}
                                                     </a>
                                                 </li>
                                             ))}
                                         </ul>
                                     </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </main>

            <footer className="sticky bottom-0 bg-white/80 backdrop-blur-sm shadow-top p-4 mt-8 border-t border-slate-200">
                <div className="container mx-auto max-w-4xl">
                    <form onSubmit={handleGeneratePlan} className="flex items-center gap-2 md:gap-4">
                        <div className="relative flex-grow">
                             <MapPin className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                            <input
                                type="text"
                                value={destination}
                                onChange={(e) => setDestination(e.target.value)}
                                placeholder="e.g., Dubai, Tokyo, or New York"
                                disabled={isLoading}
                                className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-full shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition disabled:bg-slate-100"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={isLoading || !destination.trim()}
                            className="flex items-center justify-center px-5 py-3 bg-blue-600 text-white font-semibold rounded-full shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300 disabled:cursor-not-allowed transition-all duration-200"
                        >
                            {isLoading ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Generating...
                                </>
                            ) : (
                                <>
                                    <WandSparkles className="w-5 h-5 mr-2" />
                                    Generate Plan
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </footer>
        </div>
    );
};

export default App;
