

import React, { useEffect } from 'react';

const AboutPage: React.FC = () => {
  useEffect(() => {
    // --- SEO: Set Meta Tags ---
    document.title = 'Our Story | Afriblend';
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
        metaDescription.setAttribute('content', 'Learn about the mission and passion behind Afriblend. We are committed to fair trade, sustainability, and empowering artisans across Africa.');
    }
  }, []);

  return (
    <div className="bg-white dark:bg-dark-bg animate-fade-in">
      {/* Hero Section */}
      <div className="relative h-[50vh] bg-cover bg-center" style={{ backgroundImage: `url('https://picsum.photos/seed/about-hero/1600/800')` }}>
        <div className="absolute inset-0 bg-brand-primary/60 dark:bg-dark-bg/60"></div>
        <div className="relative h-full flex items-center justify-center">
          <h1 className="text-4xl md:text-6xl font-serif text-white text-center">Our Story</h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-16 md:py-24 max-w-4xl">
        <div className="space-y-10 text-lg text-gray-700 dark:text-dark-subtext leading-relaxed">
          <p className="text-xl font-semibold text-brand-primary dark:text-dark-text">
            Afriblend was born from a desire to bridge worlds: the world of timeless African artistry with the world of contemporary global fashion.
          </p>
          <p>
            Our journey began in the vibrant markets of Nairobi, Kenya, surrounded by the dazzling colors of Kitenge, the intricate patterns of Ankara, and the symbolic beauty of Masai beadwork. We saw more than just fabrics and accessories; we saw stories, legacies, and a profound sense of identity woven into every thread and bead. We felt a calling to share this beauty with the world, not as a fleeting trend, but as an enduring celebration of culture.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-3xl font-serif text-brand-primary dark:text-dark-text mb-4">Our Mission</h2>
              <p>
                Our mission is twofold: to bring you unique, high-quality fashion that makes a statement, and to empower the talented artisans who create it. We believe in fair trade, sustainable practices, and creating a platform that honors the skill and heritage behind each product. We work directly with artisan cooperatives and individual creators, ensuring they receive fair compensation that supports their families and communities.
              </p>
            </div>
            <img src="https://picsum.photos/seed/artisans/600/400" alt="African artisans at work" className="rounded-lg shadow-lg object-cover w-full h-full" />
          </div>

          <p>
            When you purchase from Afriblend, you're not just buying a piece of clothing or decor. You're investing in a piece of art, supporting a sustainable livelihood, and carrying a story forward. Thank you for being a part of our journey.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;