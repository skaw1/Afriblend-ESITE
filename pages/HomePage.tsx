import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useProducts } from '../hooks/useProducts';
import ProductCard from '../components/ProductCard';
import { useSettings } from '../hooks/useSettings';
import { ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react';
import { useFaqs } from '../hooks/useFaqs';
import { useOurStory } from '../hooks/useOurStory';
import { useContact } from '../hooks/useContact';
import { IconMap } from '../components/IconMap';
import { convertGoogleDriveUrl } from '../utils/imageUtils';

const FaqItemComponent: React.FC<{ q: string; a: string }> = ({ q, a }) => (
    <details className="group border-b border-gray-200 dark:border-dark-border py-4 last:border-none">
        <summary className="flex justify-between items-center cursor-pointer list-none">
            <span className="font-semibold text-brand-primary dark:text-dark-text">{q}</span>
            <span className="group-open:rotate-180 transition-transform duration-300">
                <ChevronDown />
            </span>
        </summary>
        <p className="mt-3 text-gray-600 dark:text-dark-subtext leading-relaxed">{a}</p>
    </details>
);

const HomePage: React.FC = () => {
    const [currentImage, setCurrentImage] = useState(0);
    const { products } = useProducts();
    const { settings } = useSettings();
    const { faqs } = useFaqs();
    const { ourStory } = useOurStory();
    const { contactInfo } = useContact();
    const sliderImages = settings.heroSlides || [];
    const productsToShow = products.filter(p => p.isVisible !== false).slice(0, 10);
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);

    useEffect(() => {
        // --- SEO: Set Meta Tags ---
        document.title = 'Afriblend - Modern African Fashion, Handcrafted with Heritage';
        const metaDescription = document.querySelector('meta[name="description"]');
        if (metaDescription) {
            metaDescription.setAttribute('content', 'Discover authentic African fashion at Afriblend. Shop modern dresses, accessories, and home decor handcrafted by artisans, blending traditional style with contemporary design.');
        }

        // --- SEO: Add Schema.org JSON-LD ---
        const organizationSchema = {
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "Afriblend",
            "url": window.location.origin,
            "logo": "https://res.cloudinary.com/dwwvh34yi/image/upload/v1753865210/Afriblend_uyhbef.png",
            "contactPoint": {
                "@type": "ContactPoint",
                "telephone": contactInfo.contactFields.find(f => f.icon === 'Phone')?.value || '',
                "contactType": "Customer Service"
            },
            "sameAs": contactInfo.socialLinks.map(link => link.url)
        };

        const faqSchema = {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": faqs.map(faq => ({
                "@type": "Question",
                "name": faq.q,
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": faq.a
                }
            }))
        };

        const script = document.createElement('script');
        script.type = 'application/ld+json';
        script.id = 'home-schema';
        script.innerHTML = JSON.stringify([organizationSchema, faqSchema]);
        document.head.appendChild(script);

        return () => {
            const scriptTag = document.getElementById('home-schema');
            if (scriptTag) {
                document.head.removeChild(scriptTag);
            }
        };
    }, [faqs, contactInfo]);

    const nextSlide = useCallback(() => {
        setCurrentImage(prev => (prev + 1) % sliderImages.length);
    }, [sliderImages.length]);

    const prevSlide = () => {
        setCurrentImage(prev => (prev - 1 + sliderImages.length) % sliderImages.length);
    };

    useEffect(() => {
        if (sliderImages.length === 0 || !isAutoPlaying) return;
        const timer = setInterval(nextSlide, 5000); // Change image every 5 seconds
        return () => clearInterval(timer);
    }, [sliderImages.length, isAutoPlaying, nextSlide]);

    const handleManualNavigation = (direction: 'next' | 'prev' | number) => {
        setIsAutoPlaying(false); // Stop autoplay on any manual interaction
        if (direction === 'next') {
            nextSlide();
        } else if (direction === 'prev') {
            prevSlide();
        } else {
            setCurrentImage(direction);
        }
    };

    if (sliderImages.length === 0) {
        return (
            <div className="bg-gray-200 dark:bg-dark-card h-[45vh] min-h-[380px] flex items-center justify-center">
                <p className="text-brand-primary dark:text-dark-text">Hero section content not configured.</p>
            </div>
        )
    }

    return (
        <div className="animate-fade-in">
            {/* Unified Hero Section */}
            <section className="relative h-[45vh] min-h-[380px] w-full overflow-hidden group">
                {sliderImages.map((image, index) => (
                    <div
                        key={image.id}
                        className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentImage ? 'opacity-100' : 'opacity-0'}`}
                    >
                        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${convertGoogleDriveUrl(image.src)})` }}></div>
                        <div className="absolute inset-0 bg-black/50"></div>
                    </div>
                ))}
                
                <div className="relative h-full flex items-center justify-center text-center text-white px-6">
                    {/* The content animates with a key change */}
                    <div className="transition-all duration-700 ease-out" key={sliderImages[currentImage].id}>
                         <h1 className="text-4xl md:text-6xl font-serif font-bold leading-tight animate-fade-in">{sliderImages[currentImage].title}</h1>
                        <p className="mt-4 text-lg md:text-xl max-w-3xl mx-auto animate-fade-in animation-delay-300">{sliderImages[currentImage].subtitle}</p>
                        <Link
                            to={sliderImages[currentImage].link}
                            className="mt-8 inline-block bg-brand-secondary text-white font-bold py-3 px-8 text-lg hover:bg-brand-accent transition-transform duration-300 hover:scale-105 dark:bg-dark-accent dark:text-dark-bg dark:hover:bg-opacity-90 animate-fade-in animation-delay-500"
                        >
                            Shop Now
                        </Link>
                    </div>
                </div>

                {/* Mobile Navigation Arrows */}
                <button 
                    onClick={() => handleManualNavigation('prev')}
                    className="md:hidden absolute top-1/2 left-2 -translate-y-1/2 bg-black/30 text-white p-2 rounded-full hover:bg-black/50 active:bg-black/60 transition-colors"
                    aria-label="Previous Slide"
                >
                    <ChevronLeft size={24} />
                </button>
                 <button 
                    onClick={() => handleManualNavigation('next')}
                    className="md:hidden absolute top-1/2 right-2 -translate-y-1/2 bg-black/30 text-white p-2 rounded-full hover:bg-black/50 active:bg-black/60 transition-colors"
                    aria-label="Next Slide"
                >
                    <ChevronRight size={24} />
                </button>

                 {/* Desktop Navigation Dots */}
                 <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex space-x-3">
                    {sliderImages.map((_, index) => (
                        <button key={index} onClick={() => handleManualNavigation(index)} className={`w-3 h-3 rounded-full transition-colors ${index === currentImage ? 'bg-white' : 'bg-white/50 hover:bg-white/75'}`}></button>
                    ))}
                </div>
            </section>

            {/* Products Section */}
            <section className="py-8 bg-white dark:bg-dark-card">
                <div className="container mx-auto px-6">
                    <h2 className="text-3xl font-serif text-center text-brand-primary dark:text-dark-text mb-8">Shop Our Collection</h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-x-6 gap-y-12">
                        {productsToShow.map(product => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                    <div className="text-center mt-16">
                        <Link to="/products" className="inline-block bg-brand-primary text-white font-bold py-3 px-12 text-lg hover:bg-brand-secondary transition-colors dark:bg-dark-accent dark:text-dark-bg dark:hover:bg-opacity-90">
                            View All Products
                        </Link>
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section id="faq" className="py-16 md:py-24 bg-brand-bg dark:bg-dark-bg">
                 <div className="container mx-auto px-6 max-w-3xl">
                    <h2 className="text-3xl md:text-4xl font-serif text-center text-brand-primary dark:text-dark-text mb-12">Frequently Asked Questions</h2>
                    <div className="space-y-2">
                         {faqs.map(faq => (
                            <FaqItemComponent key={faq.id} q={faq.q} a={faq.a} />
                         ))}
                    </div>
                </div>
            </section>

            {/* Contact Us Section */}
            <section id="contact-us" className="py-16 md:py-24 bg-white dark:bg-dark-card">
                <div className="container mx-auto px-6 text-center">
                    <h2 className="text-3xl md:text-4xl font-serif text-brand-primary dark:text-dark-text mb-4">{contactInfo.title}</h2>
                    <p className="max-w-2xl mx-auto text-gray-600 dark:text-dark-subtext mb-12">
                        {contactInfo.subtitle}
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
                        {contactInfo.contactFields.map(field => {
                            const IconComponent = IconMap[field.icon];
                            const linkHref = field.icon === 'Mail' ? `mailto:${field.value}` : field.icon === 'Phone' ? `tel:${field.value}` : '#';
                            const isClickable = field.icon === 'Mail' || field.icon === 'Phone';
                            const Wrapper = isClickable ? 'a' : 'div';

                            return (
                                <div key={field.id} className="flex flex-col items-center">
                                    <IconComponent className="h-10 w-10 text-brand-secondary dark:text-dark-accent mb-3"/>
                                    <h3 className="font-semibold text-lg">{field.label}</h3>
                                    <Wrapper 
                                        href={isClickable ? linkHref : undefined} 
                                        className={`text-gray-600 dark:text-dark-subtext ${isClickable ? 'hover:text-brand-primary dark:hover:text-dark-text' : ''}`}
                                    >
                                        {field.value}
                                    </Wrapper>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default HomePage;