import React, { useState, useEffect } from 'react';
import '../index.css';

const LoadingScreen = ({ onLoadingComplete }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => {
        onLoadingComplete();
      }, 500);
    }, 3000);

    return () => clearTimeout(timer);
  }, [onLoadingComplete]);

  if (!isVisible) {
    return null;
  }

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-500 ${
      isVisible ? 'opacity-100' : 'opacity-0'
    }`}
    style={{
      backgroundColor: '#000000',
      backgroundImage: 'radial-gradient(#ffffff33 1px, #00091d 1px)',
      backgroundSize: '20px 20px'
    }}>
      <div className="flex flex-col items-center justify-center space-y-8">
        <div className="relative animate-elegant-entrance">
          <img
            src="/generated-image.png"
            alt="CoinScope Logo"
            className="h-32 w-auto animate-gentle-float animate-glow-pulse"
          />
        </div>

        <div className="text-center space-y-4">
          <h1 className="font-intel text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 animate-pulse">
            CoinScope
          </h1>
          
          <div className="flex justify-center space-x-2">
            <div className="w-2 h-2 bg-yellow-500 rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
            <div className="w-2 h-2 bg-yellow-500 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
            <div className="w-2 h-2 bg-yellow-500 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
          </div>
          
          <p className="font-intel text-gray-300 text-lg animate-fade-in">
            Loading your crypto universe...
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
