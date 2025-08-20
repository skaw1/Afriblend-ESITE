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
    <div className="bg-brand-bg dark:bg-dark-bg animate-fade-in overflow-x-hidden">
      {/* 
        This container provides consistent padding and centers the content.
        The padding is adjusted for different screen sizes for a balanced look.
      */}
      <div className="container mx-auto px-6 py-16 md:py-24">
        <div className="max-w-7xl mx-auto">
          {/* 
            CORE LAYOUT FIX: Using a robust flexbox layout.
            - `flex-col`: Stacks items vertically on mobile (photo on top, text below), as requested.
            - `md:flex-row`: Switches to a side-by-side layout on medium screens and up.
            - `items-center`: Vertically aligns the image and text when side-by-side.
            - `gap-12 md:gap-16`: Provides appropriate spacing for all screen sizes.
          */}
          <div className="flex flex-col md:flex-row items-center gap-12 md:gap-16">
            
            {/* Image Column: Appears first in markup to be on top on mobile */}
            <div className="w-full md:w-5/12">
              <img 
                src={ourStory.imageUrl} 
                alt="Artisan crafting traditional African textiles, representing the heritage of Afriblend." 
                className="rounded-lg object-cover w-full h-auto shadow-2xl"
              />
            </div>

            {/* Text Column */}
            <div className="w-full md:w-7/12 text-center md:text-left">
              <h1 className="text-4xl sm:text-5xl font-serif font-bold text-brand-primary dark:text-dark-text leading-tight">
                {ourStory.title}
              </h1>
              
              <p className="mt-6 text-lg text-gray-700 dark:text-dark-subtext leading-relaxed max-w-prose mx-auto md:mx-0">
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