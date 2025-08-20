

import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { HeartHandshake, Sparkles, Target, LucideProps } from 'lucide-react';

const AboutPage: React.FC = () => {
  useEffect(() => {
    // --- SEO: Set Meta Tags ---
    document.title = 'Our Story | Afriblend';
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
        metaDescription.setAttribute('content', 'Learn about the mission and passion behind Afriblend. We are committed to fair trade, sustainability, and empowering artisans across Africa.');
    }
  }, []);
  
  const ValueCard = ({ icon: Icon, title, text }: { icon: React.FC<LucideProps>, title: string, text: string }) => (
    <div className="bg-white dark:bg-dark-card p-8 rounded-lg shadow-sm text-center transform hover:-translate-y-2 transition-transform duration-300">
      <div className="inline-block bg-brand-secondary/10 dark:bg-dark-accent/10 p-4 rounded-full mb-4">
        <Icon className="h-10 w-10 text-brand-secondary dark:text-dark-accent" />
      </div>
      <h3 className="text-xl font-serif font-bold text-brand-primary dark:text-dark-text">{title}</h3>
      <p className="mt-2 text-gray-600 dark:text-dark-subtext">{text}</p>
    </div>
  );

  const TimelineItem = ({ seed, title, text, align = 'left' }: { seed: string, title: string, text: string, align?: 'left' | 'right' }) => (
    <div className={`grid md:grid-cols-2 gap-12 items-center`}>
      <div className={`h-80 rounded-lg shadow-xl overflow-hidden ${align === 'right' ? 'md:order-2' : ''}`}>
        <img src={`https://picsum.photos/seed/${seed}/600/800`} alt={title} className="w-full h-full object-cover" />
      </div>
      <div className="md:order-1">
        <h3 className="text-3xl font-serif text-brand-primary dark:text-dark-text mb-4">{title}</h3>
        <p className="text-lg text-gray-700 dark:text-dark-subtext leading-relaxed">{text}</p>
      </div>
    </div>
  );

  return (
    <div className="bg-brand-bg dark:bg-dark-bg animate-fade-in">
      {/* Hero Section */}
      <div className="relative h-[50vh] bg-cover bg-center bg-fixed" style={{ backgroundImage: `url('https://picsum.photos/seed/about-hero/1600/800')` }}>
        <div className="absolute inset-0 bg-brand-primary/60 dark:bg-dark-bg/60"></div>
        <div className="relative h-full flex items-center justify-center">
          <h1 className="text-4xl md:text-6xl font-serif text-white text-center animate-fade-in">Weaving Stories, <br/> Crafting Futures.</h1>
        </div>
      </div>

      {/* Mission Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-6 text-center max-w-4xl">
           <p className="text-2xl md:text-3xl font-serif text-brand-primary dark:text-dark-text leading-snug">
            "Afriblend was born from a desire to bridge timeless African artistry with contemporary global fashion, celebrating the stories and legacies woven into every thread and bead."
          </p>
        </div>
      </section>

      {/* Journey Timeline */}
      <section className="py-16 md:py-24 bg-white dark:bg-dark-card">
         <div className="container mx-auto px-6 max-w-5xl space-y-20">
           <h2 className="text-4xl md:text-5xl font-serif text-center text-brand-primary dark:text-dark-text mb-16">Our Journey</h2>
           <TimelineItem 
              seed="nairobi-market"
              title="The Spark in Nairobi"
              text="Our journey began in the vibrant markets of Nairobi, surrounded by the dazzling colors of Kitenge and the intricate patterns of Ankara. We saw more than just fabrics; we saw stories and a profound sense of identity. We felt a calling to share this beauty with the world."
              align="left"
           />
           <TimelineItem 
              seed="artisan-hands"
              title="Our First Partnership"
              text="We work directly with artisan cooperatives and individual creators, ensuring they receive fair compensation that supports their families and communities. Our first partnership with a small group of Masai beadworkers taught us the power of collaborative, ethical business."
              align="right"
           />
           <TimelineItem 
              seed="global-fashion"
              title="Our Mission Today"
              text="Our mission is twofold: to bring you unique, high-quality fashion that makes a statement, and to empower the talented artisans who create it. When you purchase from Afriblend, you invest in art, support a sustainable livelihood, and carry a story forward."
              align="left"
           />
         </div>
      </section>

      {/* Core Values */}
       <section className="py-16 md:py-24">
         <div className="container mx-auto px-6 max-w-5xl">
            <h2 className="text-4xl md:text-5xl font-serif text-center text-brand-primary dark:text-dark-text mb-16">Our Core Values</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <ValueCard icon={Sparkles} title="Authenticity" text="Honoring the genuine heritage and traditional techniques behind every piece we offer." />
              <ValueCard icon={HeartHandshake} title="Fair Partnership" text="Ensuring artisans are compensated fairly, fostering sustainable livelihoods and community growth." />
              <ValueCard icon={Target} title="Modern Vision" text="Blending timeless artistry with contemporary design to create fashion that is both beautiful and meaningful." />
            </div>
         </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24 bg-cover bg-center" style={{ backgroundImage: `url('https://picsum.photos/seed/about-cta/1600/800')` }}>
         <div className="absolute inset-0 bg-black/50"></div>
         <div className="relative container mx-auto px-6 text-center text-white">
            <h2 className="text-3xl md:text-4xl font-serif mb-4">Be Part of Our Story</h2>
            <p className="max-w-2xl mx-auto mb-8 text-lg">Each piece in our collection carries a legacy. Explore our shop and find the story that speaks to you.</p>
            <Link to="/products" className="inline-block bg-brand-secondary text-white font-bold py-3 px-12 text-lg hover:bg-brand-accent transition-transform duration-300 hover:scale-105 dark:bg-dark-accent dark:text-dark-bg dark:hover:bg-opacity-90">
                Shop The Collection
            </Link>
         </div>
      </section>
    </div>
  );
};

export default AboutPage;
