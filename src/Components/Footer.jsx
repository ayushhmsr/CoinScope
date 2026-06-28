import React from "react";

const Footer = () => {
  return (
    <footer className="w-full bg-gray-900 bg-opacity-95 text-white text-center py-8 border-t-2 border-yellow-500 border-opacity-50 shadow-lg">
      <div className="max-w-6xl mx-auto px-4">
        <p className="text-gray-300">
          © {new Date().getFullYear()} <span className="text-yellow-500 font-semibold">CoinScope</span>. All rights reserved.
        </p>
        
        <p className="text-sm text-gray-400 mt-2">
          Built with <span className="text-yellow-500">❤️</span> for the crypto community
        </p>
      </div>
    </footer>
  );
};

export default Footer;
