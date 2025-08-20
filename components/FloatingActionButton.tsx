
import React, { useState } from 'react';
import { useSettings } from '../hooks/useSettings';
import { useContact } from '../hooks/useContact';
import { X } from 'lucide-react';

const FloatingActionButton: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { settings } = useSettings();
    const { contactInfo } = useContact();

    // Conditionally render the button based on settings
    if (!settings.fab?.enabled) {
        return null;
    }
    
    // Find the primary phone number from the dynamic fields
    const phoneField = contactInfo.contactFields?.find(f => f.icon === 'Phone');
    const phone = phoneField ? phoneField.value : '';

    const { iconUrl, whatsappIconUrl, callIconUrl } = settings.fab;

    // Sanitize phone number for different link types
    const whatsappPhone = phone.replace(/[^0-9]/g, ''); // For wa.me, typically just numbers
    const callPhone = phone.replace(/[^0-9+]/g, ''); // For tel:, can include +
    
    const whatsappMessage = encodeURIComponent("Hello! I have a question about your products.");
    const whatsappUrl = `https://wa.me/${whatsappPhone}?text=${whatsappMessage}`;
    const callUrl = `tel:${callPhone}`;

    const toggle = () => setIsOpen(!isOpen);

    const actionButtonClasses = "group relative flex items-center justify-center w-14 h-14 text-white rounded-full shadow-lg transition-all duration-300 transform hover:scale-110";
    const actionButtonTooltipClasses = "absolute right-full mr-4 px-3 py-1.5 text-sm font-semibold bg-gray-800 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none";

    return (
        <div className="fixed bottom-20 md:bottom-6 right-6 z-30">
            <div className="relative flex flex-col items-center gap-y-4">
                {/* Options - appear when open */}
                <div 
                    className={`flex flex-col items-center gap-y-4 transition-all duration-300 ease-in-out ${
                        isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
                    }`}
                >
                    <a 
                        href={whatsappUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className={`${actionButtonClasses} bg-green-500 hover:bg-green-600`}
                        aria-label="Chat on WhatsApp"
                    >
                        <img src={whatsappIconUrl} alt="WhatsApp" className="h-7 w-7 object-contain"/>
                        <span className={actionButtonTooltipClasses}>
                            WhatsApp
                        </span>
                    </a>
                    <a 
                        href={callUrl} 
                        className={`${actionButtonClasses} bg-blue-500 hover:bg-blue-600`}
                        aria-label="Call us"
                    >
                        <img src={callIconUrl} alt="Call" className="h-7 w-7 object-contain" />
                         <span className={actionButtonTooltipClasses}>
                            Call Us
                        </span>
                    </a>
                </div>

                {/* Main toggle button */}
                <button
                    onClick={toggle}
                    className="relative w-16 h-16 bg-brand-secondary dark:bg-dark-accent text-white rounded-full shadow-xl hover:bg-brand-primary dark:hover:bg-opacity-80 focus:outline-none focus:ring-4 focus:ring-brand-accent/50 dark:focus:ring-dark-accent/50 flex items-center justify-center transition-transform duration-300 transform hover:scale-105"
                    aria-label={isOpen ? "Close contact options" : "Open contact options"}
                    aria-expanded={isOpen}
                >
                    <img 
                        src={iconUrl} 
                        alt="Contact" 
                        className={`absolute w-9 h-9 object-contain transition-all duration-300 ${isOpen ? 'opacity-0 rotate-45 scale-50' : 'opacity-100 rotate-0 scale-100'}`}
                    />
                    <X className={`absolute transition-all duration-300 ${isOpen ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-45 scale-50'}`} size={32} />
                </button>
            </div>
        </div>
    );
};

export default FloatingActionButton;