import React, { useState } from 'react';
import { generateImages } from '../services/geminiService';
import { Download, LoaderCircle, Wand2, ImageOff } from 'lucide-react';

const AdminImageGeneratorPage: React.FC = () => {
    const [prompt, setPrompt] = useState<string>('A photorealistic image of a futuristic African city, with flying cars and buildings inspired by traditional tribal patterns.');
    const [numberOfImages, setNumberOfImages] = useState<number>(1);
    const [aspectRatio, setAspectRatio] = useState<string>('1:1');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [generatedImages, setGeneratedImages] = useState<string[]>([]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!prompt.trim()) {
            setError('Please enter a prompt.');
            return;
        }

        setIsLoading(true);
        setError(null);
        setGeneratedImages([]);

        try {
            const images = await generateImages(prompt, numberOfImages, aspectRatio);
            setGeneratedImages(images);
        } catch (err: any) {
            setError(err.message || 'An unknown error occurred.');
        } finally {
            setIsLoading(false);
        }
    };
    
    const aspectRatios = ["1:1", "16:9", "9:16", "4:3", "3:4"];

    const formInputStyles = "block w-full border-gray-300 rounded-md shadow-sm p-2 bg-gray-100 focus:border-brand-accent focus:ring focus:ring-brand-accent focus:ring-opacity-50 transition-all duration-200 dark:bg-dark-bg dark:border-dark-border dark:text-dark-text";

    return (
        <div className="space-y-8">
            <div className="bg-white dark:bg-dark-card p-6 rounded-lg shadow-lg">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="prompt" className="block text-sm font-medium text-gray-700 dark:text-dark-subtext">Image Prompt</label>
                        <textarea
                            id="prompt"
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            placeholder="e.g., A robot holding a red skateboard."
                            rows={3}
                            className={formInputStyles}
                            disabled={isLoading}
                        />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="aspectRatio" className="block text-sm font-medium text-gray-700 dark:text-dark-subtext">Aspect Ratio</label>
                            <select
                                id="aspectRatio"
                                value={aspectRatio}
                                onChange={(e) => setAspectRatio(e.target.value)}
                                className={formInputStyles}
                                disabled={isLoading}
                            >
                                {aspectRatios.map(ratio => (
                                    <option key={ratio} value={ratio}>{ratio}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="numberOfImages" className="block text-sm font-medium text-gray-700 dark:text-dark-subtext">Number of Images ({numberOfImages})</label>
                            <input
                                id="numberOfImages"
                                type="range"
                                min="1"
                                max="4"
                                step="1"
                                value={numberOfImages}
                                onChange={(e) => setNumberOfImages(Number(e.target.value))}
                                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-brand-secondary dark:accent-dark-accent"
                                disabled={isLoading}
                            />
                        </div>
                    </div>
                    <div>
                        <button
                            type="submit"
                            className="w-full bg-brand-primary text-white font-bold py-3 px-4 rounded-md hover:bg-brand-secondary transition-colors flex items-center justify-center disabled:bg-gray-400 dark:bg-dark-accent dark:text-dark-bg dark:hover:bg-opacity-90 dark:disabled:bg-gray-600"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <LoaderCircle className="animate-spin -ml-1 mr-3 h-5 w-5" />
                                    Generating...
                                </>
                            ) : (
                                <>
                                    <Wand2 className="mr-2 h-5 w-5" />
                                    Generate Images
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>

            {error && (
                <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md" role="alert">
                    <p className="font-bold">Error</p>
                    <p>{error}</p>
                </div>
            )}
            
            {generatedImages.length > 0 && (
                <div className="bg-white dark:bg-dark-card p-6 rounded-lg shadow-lg">
                    <h3 className="text-xl font-serif font-bold text-brand-primary dark:text-dark-text mb-4">Generated Images</h3>
                    <div className={`grid gap-6 grid-cols-1 ${numberOfImages > 1 ? 'md:grid-cols-2' : ''} ${numberOfImages > 2 ? 'lg:grid-cols-3' : ''} ${numberOfImages > 3 ? 'xl:grid-cols-4' : ''}`}>
                        {generatedImages.map((imgSrc, index) => (
                            <div key={index} className="group relative border dark:border-dark-border rounded-lg overflow-hidden shadow-sm">
                                <img src={imgSrc} alt={`Generated image ${index + 1}`} className="w-full h-auto object-contain bg-gray-100 dark:bg-dark-bg" />
                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <a
                                        href={imgSrc}
                                        download={`afriblend-generated-${Date.now()}-${index + 1}.jpeg`}
                                        className="bg-white/80 text-black font-bold py-2 px-4 rounded-md hover:bg-white flex items-center"
                                    >
                                        <Download className="mr-2 h-5 w-5" />
                                        Download
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
            
            {isLoading && (
                 <div className="text-center py-10">
                    <LoaderCircle className="mx-auto h-12 w-12 text-brand-secondary dark:text-dark-accent animate-spin" />
                    <p className="mt-4 text-gray-600 dark:text-dark-subtext">The AI is creating your images, this may take a moment...</p>
                </div>
            )}

            {!isLoading && generatedImages.length === 0 && (
                 <div className="text-center py-10 border-2 border-dashed border-gray-300 dark:border-dark-border rounded-lg">
                    <ImageOff className="mx-auto h-12 w-12 text-gray-400 dark:text-dark-subtext" />
                    <p className="mt-4 text-gray-500 dark:text-dark-subtext">Your generated images will appear here.</p>
                </div>
            )}
        </div>
    );
};

export default AdminImageGeneratorPage;