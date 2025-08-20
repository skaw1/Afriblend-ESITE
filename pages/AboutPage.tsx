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
        This is a robust container pattern. 
        - `max-w-7xl` sets the maximum width on large screens.
        - `mx-auto` centers the container.
        - `px-6` provides horizontal padding, crucial for mobile.
        - `w-full` ensures it takes up available width on all screens.
      */}
      <div className="max-w-7xl mx-auto px-6 py-16 md:py-24 w-full">
        {/* 
          Responsive Flexbox Layout:
          - `flex-col` on mobile (default): Stacks image on top of text.
          - `md:flex-row` on medium screens and up: Creates a side-by-side layout.
          - `items-center` vertically aligns content in the row layout.
        */}
        <div className="flex flex-col md:flex-row items-center gap-12 lg:gap-16">
          
          {/* Image Column */}
          <div className="w-full md:w-5/12 flex-shrink-0">
            <div className="rounded-lg shadow-2xl overflow-hidden group aspect-w-3 aspect-h-4">
              <img 
                src={ourStory.imageUrl} 
                alt="Artisan crafting traditional African textiles, representing the heritage of Afriblend." 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
              />
            </div>
          </div>

          {/* Text Column */}
          <div className="w-full md:w-7/12 flex flex-col justify-center text-center md:text-left">
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-brand-primary dark:text-dark-text mb-6">
              {ourStory.title}
            </h1>
            
            {/* Using `break-words` for robust text wrapping, ensuring no overflow */}
            <p className="text-lg text-gray-700 dark:text-dark-subtext leading-relaxed break-words">
              {ourStory.text}
            </p>

            <div className="mt-8">
              <Link 
                to="/products" 
                className="inline-block bg-brand-secondary text-white font-bold py-3 px-10 text-lg hover:bg-brand-primary transition-transform duration-300 hover:scale-105 dark:bg-dark-accent dark:text-dark-bg dark:hover:bg-opacity-90 rounded-md"
              >
                Shop The Collection
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
