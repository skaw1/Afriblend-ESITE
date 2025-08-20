import React, { useState } from 'react';
import * as ReactRouterDOM from 'react-router-dom';
import CartIcon from './CartIcon';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../hooks/useTheme';
// import StyleMeModal from './StyleMeModal';
import { Moon, Sun } from 'lucide-react';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  // const [isModalOpen, setIsModalOpen] = useState(false);
  const { isAuthenticated } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const navLinkClasses = ({ isActive }: { isActive: boolean }) =>
    `py-2 text-sm font-medium transition-colors duration-300 ${isActive ? 'text-brand-accent dark:text-dark-accent border-b-2 border-brand-accent dark:border-dark-accent' : 'text-brand-primary dark:text-dark-text hover:text-brand-secondary dark:hover:text-dark-accent'}`;
  
  const buttonClasses = 'py-2 text-sm font-medium transition-colors duration-300 text-brand-primary dark:text-dark-text hover:text-brand-secondary dark:hover:text-dark-accent';

  const closeMenu = () => setIsMenuOpen(false);

  /*
  const handleOpenModal = () => {
    closeMenu();
    setIsModalOpen(true);
  };
  */

  return (
    <>
      <header className="bg-brand-bg/80 dark:bg-dark-card/80 backdrop-blur-md sticky top-0 z-40 shadow-sm dark:shadow-dark-border/20">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <ReactRouterDOM.Link 
            to="/" 
            className="flex-shrink-0"
          >
            <img 
              src="https://res.cloudinary.com/dwwvh34yi/image/upload/v1753865210/Afriblend_uyhbef.png" 
              alt="Afriblend Logo" 
              className="h-10 w-auto" 
            />
          </ReactRouterDOM.Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <ReactRouterDOM.NavLink to="/" className={navLinkClasses}>Home</ReactRouterDOM.NavLink>
            <ReactRouterDOM.NavLink to="/products" className={navLinkClasses}>Shop</ReactRouterDOM.NavLink>
            {/* <button onClick={() => setIsModalOpen(true)} className={buttonClasses}>AI Stylist</button> */}
            <ReactRouterDOM.NavLink to="/about" className={navLinkClasses}>About</ReactRouterDOM.NavLink>
            <ReactRouterDOM.NavLink to="/track" className={navLinkClasses}>Track Order</ReactRouterDOM.NavLink>
            <ReactRouterDOM.NavLink to="/#contact-us" className={navLinkClasses}>Contact</ReactRouterDOM.NavLink>
            {isAuthenticated && (
              <ReactRouterDOM.NavLink to="/admin/dashboard" className={navLinkClasses}>Admin</ReactRouterDOM.NavLink>
            )}
          </nav>

          <div className="flex items-center space-x-4">
            <button onClick={toggleTheme} className="text-brand-primary dark:text-dark-text hover:text-brand-secondary dark:hover:text-dark-accent focus:outline-none" aria-label="Toggle theme">
                {theme === 'light' 
                    ? <Moon className="h-6 w-6" /> 
                    : <Sun className="h-6 w-6" />
                }
            </button>
            <CartIcon />
            <button
              className="md:hidden text-brand-primary dark:text-dark-text focus:outline-none"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Open menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path></svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-brand-bg dark:bg-dark-card pb-4">
            <nav className="flex flex-col items-center space-y-4">
              <ReactRouterDOM.NavLink to="/" className={navLinkClasses} onClick={closeMenu}>Home</ReactRouterDOM.NavLink>
              <ReactRouterDOM.NavLink to="/products" className={navLinkClasses} onClick={closeMenu}>Shop</ReactRouterDOM.NavLink>
              {/* <button onClick={handleOpenModal} className={buttonClasses}>AI Stylist</button> */}
              <ReactRouterDOM.NavLink to="/about" className={navLinkClasses} onClick={closeMenu}>About</ReactRouterDOM.NavLink>
              <ReactRouterDOM.NavLink to="/track" className={navLinkClasses} onClick={closeMenu}>Track Order</ReactRouterDOM.NavLink>
              <ReactRouterDOM.NavLink to="/#contact-us" className={navLinkClasses} onClick={closeMenu}>Contact</ReactRouterDOM.NavLink>
              {isAuthenticated && (
                  <ReactRouterDOM.NavLink to="/admin/dashboard" className={navLinkClasses} onClick={closeMenu}>Admin</ReactRouterDOM.NavLink>
              )}
            </nav>
          </div>
        )}
      </header>
      {/* {isModalOpen && <StyleMeModal onClose={() => setIsModalOpen(false)} />} */}
    </>
  );
};

export default Header;