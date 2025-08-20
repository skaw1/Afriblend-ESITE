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
    <div className="bg-brand-bg dark:bg-dark-bg animate-fade-in">
      {/* 
        This is a robust, mobile-first layout.
        - On mobile (default), it's a single-column grid. The image is first, followed by the padded text container.
        - On large screens (lg:), it becomes a two-column grid for a side-by-side view.
        This structure guarantees the image is full-width on mobile while the text remains contained, solving all previous issues.
      */}
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 lg:items-center">
          
          {/* --- Image Column --- */}
          {/* The image takes up the full width on mobile. On desktop, it's the first column. */}
          <div className="w-full">
            <img 
              src={ourStory.imageUrl} 
              alt="Artisan crafting traditional African textiles, representing the heritage of Afriblend." 
              className="w-full h-auto max-h-[60vh] object-cover lg:max-h-full lg:rounded-r-lg"
            />
          </div>

          {/* --- Text Column --- */}
          {/* This container has padding on all screen sizes to ensure text doesn't touch the edges. */}
          <div className="p-8 md:p-12 lg:p-16">
            <div className="text-center lg:text-left">
              <h1 className="text-4xl sm:text-5xl font-serif font-bold text-brand-primary dark:text-dark-text leading-tight">
                {ourStory.title}
              </h1>
              
              <p className="mt-6 text-lg text-gray-700 dark:text-dark-subtext leading-relaxed max-w-prose mx-auto lg:mx-0">
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
