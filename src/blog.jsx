import React from 'react';
import "./index.css";

const Features = () => {
  const features = [
    {
      title: "Live Price Tracking",
      description: "Monitor real-time cryptocurrency prices with automatic updates and customizable alerts.",
      icon: "📈"
    },
    {
      title: "Portfolio Management",
      description: "Track your investments across multiple wallets and exchanges in one unified dashboard.",
      icon: "💼"
    },
    {
      title: "Market Analytics",
      description: "Advanced charting tools with technical indicators and historical data analysis.",
      icon: "🔍"
    },
    {
      title: "News & Insights",
      description: "Stay informed with the latest cryptocurrency news and market analysis from trusted sources.",
      icon: "📰"
    },
    {
      title: "Security Alerts",
      description: "Get notified about security incidents, smart contract vulnerabilities, and market anomalies.",
      icon: "🔒"
    },
    {
      title: "DeFi Integration",
      description: "Connect to popular DeFi protocols and track your yield farming and staking rewards.",
      icon: "🌾"
    }
  ];

  return (
    <div className="font-intel flex flex-col justify-center items-center mt-[100px] text-white px-10 pb-16">
      <div className="max-w-6xl">
        <h1 className="text-6xl mb-8 leading-tight text-center">
          Platform <span className="text-yellow-500">Features</span>
        </h1>
        
        <p className="text-xl mb-16 text-gray-300 leading-relaxed text-center">
          Discover the powerful tools and features that make CoinScope the ultimate cryptocurrency tracking platform.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-gray-800 bg-opacity-80 p-6 rounded-lg border-2 border-gray-600 hover:border-yellow-500 hover:bg-gray-700 hover:bg-opacity-90 transition-all duration-300 hover:transform hover:scale-105 shadow-lg">
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-2xl font-semibold mb-4 text-yellow-500">{feature.title}</h3>
              <p className="text-gray-200 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Features;
