
import React, { useState, useRef, useEffect } from "react";

import "../index.css";

import { Link } from "react-router-dom";

import { useCurrency } from "../contexts/CurrencyContext";

import { Menu, X, ChevronDown } from "lucide-react";


const Navbar = () => {
  
  const { currency, setCurrency, currencyConfig } = useCurrency();
  
  
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  
  const [isCurrencyDropdownOpen, setIsCurrencyDropdownOpen] = useState(false);
  
  
  const dropdownRef = useRef(null);

  
  const handleCurrencyChange = (newCurrency) => {
    setCurrency(newCurrency);           
    setIsCurrencyDropdownOpen(false);   
  };

  
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen); 
  };

  
  
  useEffect(() => {
    
    const handleClickOutside = (event) => {
      
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsCurrencyDropdownOpen(false); 
      }
    };

    
    document.addEventListener('mousedown', handleClickOutside);
    
    
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []); 

  return (
    
    
    <nav className="h-20 bg-gray-900 bg-opacity-95 text-white shadow-lg border-b-[2px] border-yellow-500 border-opacity-50 font-intel backdrop-blur-sm sticky top-0 z-50">
      
      <div className="flex items-center justify-between h-full px-4 sm:px-6 lg:px-10">
        
        <div className="flex items-center flex-shrink-0">
          
          <Link to="/">
            {/* Logo image with responsive sizing:
                h-16 = height on mobile (64px)
                sm:h-20 = height on small screens (80px)
                lg:h-28 = height on large screens (112px)
                w-auto = width adjusts automatically to maintain aspect ratio */}
            <img src="/generated-image.png" alt="Logo" className="h-16 sm:h-20 lg:h-28 w-auto" />
          </Link>
        </div>

        
        
        <ul className="hidden lg:flex items-center gap-x-6 xl:gap-x-10 text-base xl:text-[20px] font-medium">
          <li>
            
            <Link to="/" className="nav-link-hover hover:text-yellow-400 transition-colors">
              Home
            </Link>
          </li>
          <li>
            <Link to="/about" className="nav-link-hover hover:text-yellow-400 transition-colors">
              About
            </Link>
          </li>
          <li>
            <Link to="/features" className="nav-link-hover hover:text-yellow-400 transition-colors">
              Features
            </Link>
          </li>
          <li>
            <Link to="/pricing" className="nav-link-hover hover:text-yellow-400 transition-colors">
              Pricing
            </Link>
          </li>
        </ul>

        
        <div className="flex items-center gap-4">
          
          
          <div className="hidden sm:block relative" ref={dropdownRef}>
            
            <button
              onClick={() => setIsCurrencyDropdownOpen(!isCurrencyDropdownOpen)}
              className="bg-transparent border border-yellow-500 text-white px-3 py-2 rounded-md focus:outline-none focus:border-yellow-400 hover:border-yellow-400 transition-colors flex items-center gap-2 text-sm lg:text-base"
            >
              
              <span>{currencyConfig[currency].symbol}</span>
              
              <span>{currencyConfig[currency].code}</span>
              
              <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isCurrencyDropdownOpen ? 'rotate-180' : ''}`} />
            </button>
            
            
            
            {isCurrencyDropdownOpen && (
              <div className="absolute right-0 top-full mt-1 bg-gray-800 border border-gray-700 rounded-md shadow-lg z-50 min-w-[120px]">
                
                {Object.entries(currencyConfig).map(([key, config]) => (
                  <button
                    key={key}
                    onClick={() => handleCurrencyChange(key)}
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-700 transition-colors flex items-center gap-2 first:rounded-t-md last:rounded-b-md ${
                      currency === key ? 'bg-yellow-500 bg-opacity-20 text-yellow-400' : 'text-white'
                    }`}
                  >
                    
                    <span>{config.symbol}</span>
                    <span>{config.code}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          
          
          <button
            onClick={toggleMobileMenu}
            className="lg:hidden text-white hover:text-yellow-400 transition-colors p-2"
            aria-label="Toggle mobile menu"
          >
            
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      
      
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-gray-800 border-t border-gray-700">
          <div className="px-4 py-4 space-y-4">
            
            <ul className="space-y-3">
              <li>
                
                <Link 
                  to="/" 
                  className="block text-white hover:text-yellow-400 transition-colors font-medium"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Home
                </Link>
              </li>
              <li>
                <Link 
                  to="/about" 
                  className="block text-white hover:text-yellow-400 transition-colors font-medium"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  About
                </Link>
              </li>
              <li>
                <Link 
                  to="/features" 
                  className="block text-white hover:text-yellow-400 transition-colors font-medium"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Features
                </Link>
              </li>
              <li>
                <Link 
                  to="/pricing" 
                  className="block text-white hover:text-yellow-400 transition-colors font-medium"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Pricing
                </Link>
              </li>
            </ul>

            
            
            <div className="sm:hidden border-t border-gray-700 pt-4">
              <div className="text-sm text-gray-400 mb-2">Currency</div>
              <div className="space-y-2">
                
                {Object.entries(currencyConfig).map(([key, config]) => (
                  <button
                    key={key}
                    onClick={() => {
                      handleCurrencyChange(key);    
                      setIsMobileMenuOpen(false);   
                    }}
                    className={`w-full text-left px-3 py-2 rounded-md transition-colors flex items-center gap-3 ${
                      currency === key 
                        ? 'bg-yellow-500 bg-opacity-20 text-yellow-400 border border-yellow-500' 
                        : 'text-white hover:bg-gray-700 border border-gray-600'
                    }`}
                  >
                    
                    <span className="text-lg">{config.symbol}</span>
                    <span className="font-medium">{config.code}</span>
                    <span className="text-sm text-gray-400">({config.name})</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};


export default Navbar;
