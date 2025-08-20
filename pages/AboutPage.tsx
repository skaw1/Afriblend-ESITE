
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
      <div className="container mx-auto px-6 py-16 md:py-24">
        <div className="max-w-5xl mx-auto">
          {/* Title with custom underline */}
          <h1 className="relative text-4xl md:text-5xl font-serif font-bold text-brand-primary dark:text-dark-text text-center mb-16 pb-4">
            Our Story
            <span className="absolute bottom-0 left-1/2 -translate-x-1/2 h-1 w-24 bg-gradient-to-r from-brand-secondary to-brand-accent dark:from-dark-accent dark:to-brand-secondary"></span>
          </h1>

          {/* Two-column layout */}
          <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center">
            {/* Image Column */}
            <div className="w-full h-96 md:h-[500px] rounded-lg shadow-xl overflow-hidden">
              <img 
                src={ourStory.imageUrl} 
                alt="A weaver working on a traditional loom, creating colorful African fabric." 
                className="w-full h-full object-cover" 
              />
            </div>

            {/* Text Column */}
            <div className="flex flex-col justify-center h-full">
              <p className="text-gray-700 dark:text-dark-subtext leading-relaxed text-lg mb-8">
                {ourStory.text}
              </p>
              <div className="mt-auto pt-4">
                <Link 
                  to="/products" 
                  className="inline-block bg-brand-secondary text-white font-bold py-3 px-12 text-lg hover:bg-brand-primary transition-transform duration-300 hover:scale-105 dark:bg-dark-accent dark:text-dark-bg dark:hover:bg-opacity-90 rounded-md"
                >
                  Shop The Collection
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
