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
    <div className="bg-brand-bg dark:bg-dark-bg animate-fade-in overflow-hidden">
      {/* 
        This new container ensures the content is centered vertically on large screens, 
        creating the "single page" feel the user requested.
      */}
      <div className="container mx-auto px-6 flex items-center justify-center min-h-screen py-20 md:py-32">
        <div className="max-w-7xl w-full">
          {/* 
            A sophisticated grid layout for perfect balance on large screens.
            - `lg:grid-cols-2` creates the side-by-side view.
            - `items-center` ensures vertical alignment.
            - `gap-16 lg:gap-24` provides generous, premium spacing.
          */}
          <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-16 lg:gap-24">
            
            {/* Image Column - now with constrained and styled presentation */}
            <div className="w-full h-full flex items-center justify-center">
              {/* 
                The image is given a max-height to prevent it from becoming too large.
                The shadow adds depth and a premium, tangible feel.
              */}
              <img 
                src={ourStory.imageUrl} 
                alt="Artisan crafting traditional African textiles, representing the heritage of Afriblend." 
                className="rounded-lg object-cover w-full max-h-[600px] shadow-2xl"
              />
            </div>

            {/* Text Column - with enhanced typography and layout */}
            <div className="flex flex-col justify-center text-center lg:text-left">
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif font-bold text-brand-primary dark:text-dark-text leading-tight">
                {ourStory.title}
              </h1>
              
              {/* 
                `max-w-prose` ensures the text has a comfortable reading width, improving legibility.
                `text-lg` and `leading-relaxed` enhance readability for a premium experience.
              */}
              <p className="mt-6 text-lg text-gray-700 dark:text-dark-subtext leading-relaxed max-w-prose mx-auto lg:mx-0">
                {ourStory.text}
              </p>

              <div className="mt-10">
                <Link 
                  to="/products" 
                  className="inline-block bg-brand-secondary text-white font-bold py-4 px-12 text-lg hover:bg-brand-primary transition-transform duration-300 hover:scale-105 dark:bg-dark-accent dark:text-dark-bg dark:hover:bg-opacity-90 rounded-md"
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