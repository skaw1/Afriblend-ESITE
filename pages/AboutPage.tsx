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
    // Ensure the root element of the page does not overflow.
    <div className="bg-brand-bg dark:bg-dark-bg animate-fade-in overflow-x-hidden">
      {/* 
        This is a robust container pattern. 
        - `max-w-7xl` sets the maximum width on large screens.
        - `mx-auto` centers the container.
        - `px-6` provides horizontal padding, crucial for mobile.
        - `w-full` ensures it takes up available width on small screens.
      */}
      <div className="max-w-7xl mx-auto px-6 py-16 md:py-24 w-full">
        {/* Responsive grid: stacks on mobile, two columns on medium screens and up */}
        <div className="grid md:grid-cols-2 gap-12 lg:gap-16 items-center">
          
          {/* Image Column: Appears on top on mobile */}
          <div className="w-full h-80 md:h-full max-h-[500px] rounded-lg shadow-2xl overflow-hidden group">
            <img 
              src={ourStory.imageUrl} 
              alt="Artisan crafting traditional African textiles, representing the heritage of Afriblend." 
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
            />
          </div>

          {/* Text Column: Appears below image on mobile */}
          <div className="flex flex-col justify-center text-left">
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-brand-primary dark:text-dark-text mb-6">
              {ourStory.title}
            </h1>
            
            {/* Using `break-word` for robust text wrapping */}
            <p className="text-lg text-gray-700 dark:text-dark-subtext leading-relaxed break-word">
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
