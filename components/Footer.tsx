import React from 'react';
import { Link } from 'react-router-dom';
import { useCategories } from '../hooks/useCategories';
import { useContact } from '../hooks/useContact';

const Footer: React.FC = () => {
  const { categories } = useCategories();
  const { contactInfo } = useContact();
  const shopCategories = categories.slice(0, 4);
  const socialLinks = contactInfo.socialLinks || [];

  return (
    <footer className="bg-brand-primary dark:bg-dark-card text-brand-bg dark:text-dark-text">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-serif font-bold mb-4">Afriblend</h3>
            <p className="text-xs text-gray-300 dark:text-dark-subtext">Celebrating the richness of African design and fashion.</p>
            <div className="flex space-x-4 mt-4">
              {socialLinks.map(link => {
                  if (!link.iconUrl) return null;
                  return (
                    <a key={link.id} href={link.url} target="_blank" rel="noopener noreferrer" className="text-gray-300 dark:text-dark-subtext hover:text-brand-accent dark:hover:text-dark-accent transition-colors">
                      <div
                          className="h-6 w-6"
                          style={{
                              backgroundColor: 'currentColor',
                              maskImage: `url(${link.iconUrl})`,
                              WebkitMaskImage: `url(${link.iconUrl})`,
                              maskSize: 'contain',
                              WebkitMaskSize: 'contain',
                              maskRepeat: 'no-repeat',
                              WebkitMaskRepeat: 'no-repeat',
                              maskPosition: 'center',
                              WebkitMaskPosition: 'center',
                          }}
                          aria-label={`${link.name} icon`}
                      />
                    </a>
                  );
              })}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 md:col-span-2">
            <div>
              <h4 className="text-base font-semibold mb-4">Shop</h4>
              <ul className="space-y-2 text-xs">
                <li><Link to="/products" className="hover:text-brand-accent dark:hover:text-dark-accent">All Products</Link></li>
                {shopCategories.map(category => (
                   <li key={category.id}><Link to={`/products?categoryId=${category.id}`} className="hover:text-brand-accent dark:hover:text-dark-accent">{category.name}</Link></li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-base font-semibold mb-4">About</h4>
              <ul className="space-y-2 text-xs">
                <li><Link to="/about" className="hover:text-brand-accent dark:hover:text-dark-accent">Our Story</Link></li>
                <li><Link to="/track" className="hover:text-brand-accent dark:hover:text-dark-accent">Track Your Order</Link></li>
                <li><Link to="/#contact-us" className="hover:text-brand-accent dark:hover:text-dark-accent">Contact Us</Link></li>
                <li><Link to="/#faq" className="hover:text-brand-accent dark:hover:text-dark-accent">FAQs</Link></li>
              </ul>
            </div>
          </div>
          
          <div>
            <h4 className="text-base font-semibold mb-4">Stay Connected</h4>
            <p className="text-xs text-gray-300 dark:text-dark-subtext mb-2">Join our newsletter for exclusive offers and new arrivals.</p>
            <form className="flex">
              <input type="email" placeholder="Your Email" className="bg-white/20 dark:bg-dark-bg/50 text-white dark:text-dark-text placeholder-gray-300 dark:placeholder-dark-subtext px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-brand-accent dark:focus:ring-dark-accent" />
              <button type="submit" className="bg-brand-secondary hover:bg-brand-accent dark:bg-dark-accent dark:text-dark-bg dark:hover:bg-opacity-80 text-white font-semibold px-4 py-2 transition-colors">Sign Up</button>
            </form>
          </div>
        </div>
        <div className="border-t border-white/20 dark:border-dark-border mt-10 pt-6 text-center text-xs text-gray-400 dark:text-dark-subtext">
          <p className="flex justify-center items-center space-x-3 flex-wrap">
            <Link to="/admin/login" className="hover:text-brand-accent dark:hover:text-dark-accent transition-colors">Admin</Link>
            <span>&copy; 2025 Afriblend</span>
            <span className="text-gray-500" aria-hidden="true">|</span>
            <span>
              Store by <a href="https://kaste.brand" target="_blank" rel="noopener noreferrer" className="font-semibold text-brand-accent dark:text-dark-accent hover:underline">Kaste Brands</a>
            </span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;