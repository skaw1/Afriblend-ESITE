import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useOurStory } from '../hooks/useOurStory';

const AboutPage: React.FC = () => {
  const { ourStory } = useOurStory();

  useEffect(() => {
    // --- SEO: Set Meta Tags ---
    document.title = 'Our Story | Afriblend';
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
        metaDescription.setAttribute('content', 'Learn about the mission and passion behind Afriblend. We are committed to fair trade, sustainability, and empowering artisans across Africa.');
    }
  }, []);

  return (
    // Add overflow-x-hidden as a failsafe against any future content breaking the layout.
    <div className="bg-brand-bg dark:bg-dark-bg animate-fade-in overflow-x-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 lg:items-center">
          
          {/* --- Image Column --- */}
          <div className="w-full">
            <img 
              src={ourStory.imageUrl} 
              alt="Artisan crafting traditional African textiles, representing the heritage of Afriblend." 
              className="w-full h-auto max-h-[60vh] object-cover lg:max-h-full lg:rounded-r-lg"
            />
          </div>

          {/* --- Text Column --- */}
          <div className="p-8 md:p-12 lg:p-16">
            {/* Set text alignment to left for better readability on all devices */}
            <div className="text-left">
              <h1 className="text-4xl sm:text-5xl font-serif font-bold text-brand-primary dark:text-dark-text leading-tight break-words">
                {ourStory.title}
              </h1>
              
              {/* Added 'break-words' to prevent long text strings from overflowing their container. */}
              <p className="mt-6 text-lg text-gray-700 dark:text-dark-subtext leading-relaxed max-w-prose break-words">
                {ourStory.text}
              </p>

              <div className="mt-10">
                <Link
                  to="/products" 
                  className="inline-block bg-brand-secondary text-white font-bold py-3 px-10 text-lg hover:bg-brand-primary transition-transform duration-300 hover:scale-105 dark:bg-dark-accent dark:text-dark-bg dark:hover:bg-opacity-90 rounded-md"
                >
                  Explore The Collection
                </Link>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default AboutPage;