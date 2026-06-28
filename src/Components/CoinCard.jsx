
import React from 'react';

import { TrendingUp, TrendingDown, Star } from 'lucide-react';

import { formatPercentage } from '../services/coinGeckoApi';

import { useCurrency } from '../contexts/CurrencyContext';




const CoinCard = ({ coin, onClick, showFavorite = false, onFavoriteToggle }) => {
  
  const { formatPrice, formatLargeNumber } = useCurrency();
  
  
  const priceChange24h = coin.price_change_percentage_24h || 0;
  
  
  const isPositive = priceChange24h >= 0;

  
  
  const coinData = {
    id: coin.id,                                    
    name: coin.name,                                
    symbol: coin.symbol?.toUpperCase(),             
    image: coin.image || coin.large || coin.thumb, 
    currentPrice: coin.current_price || 0,          
    marketCap: coin.market_cap || 0,                
    marketCapRank: coin.market_cap_rank || 0,       
    priceChange24h: priceChange24h,                 
    volume24h: coin.total_volume || 0,              
    sparklineData: coin.sparkline_in_7d?.price || []
  };

  
  
  const MiniSparkline = ({ data }) => {
    
    if (!data || data.length === 0) return null;

    
    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min;

    
    const points = data.map((price, index) => {
      
      const x = (index / (data.length - 1)) * 100;
      
      const y = range === 0 ? 50 : ((max - price) / range) * 100;
      return `${x},${y}`;
    }).join(' '); 

    return (
      <div className="w-16 h-8 ml-auto"> 
        <svg 
          viewBox="0 0 100 100"           
          className="w-full h-full"      
          preserveAspectRatio="none"     
        >
          
          <polyline
            points={points}                                    
            fill="none"                                       
            stroke={isPositive ? '#10b981' : '#ef4444'}       
            strokeWidth="2"                                   
            vectorEffect="non-scaling-stroke"                
          />
        </svg>
      </div>
    );
  };

  return (
    <div
      
      onClick={() => onClick && onClick(coinData)}
      
      
      
      
      
      
      
      className={`
        bg-gray-900/60 backdrop-blur-sm border border-gray-700 rounded-xl p-4 sm:p-6
        transition-all duration-300 hover:border-blue-500/50 hover:bg-gray-800/60
        ${onClick ? 'cursor-pointer hover:shadow-lg hover:shadow-blue-500/10' : ''}
        group relative overflow-hidden
      `}
    >
      
      
      
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-purple-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      
      <div className="relative z-10">
        
        <div className="flex items-start justify-between mb-3">
          
          <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
            
            <div className="relative flex-shrink-0">
              
              <img
                src={coinData.image}
                alt={coinData.name}
                className="w-8 h-8 sm:w-10 sm:h-10 rounded-full ring-2 ring-gray-700 group-hover:ring-blue-500/50 transition-all duration-300"
                
                onError={(e) => {
                  e.target.src = '/api/placeholder/80/80';
                }}
              />
              
              {coinData.marketCapRank && coinData.marketCapRank <= 10 && (
                <div className="absolute -top-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 bg-yellow-500 rounded-full flex items-center justify-center text-xs font-bold text-black">
                  {coinData.marketCapRank}
                </div>
              )}
            </div>
            
            
            <div className="min-w-0 flex-1"> 
              
              <h3 className="font-semibold text-white group-hover:text-blue-400 transition-colors duration-300 text-sm sm:text-base truncate">
                {coinData.name}
              </h3>
              
              <p className="text-xs sm:text-sm text-gray-400 uppercase tracking-wider">
                {coinData.symbol}
              </p>
            </div>
          </div>

          
          {showFavorite && (
            <button
              onClick={(e) => {
                e.stopPropagation(); 
                onFavoriteToggle && onFavoriteToggle(coinData); 
              }}
              className="p-1 rounded-full hover:bg-gray-700 transition-colors duration-200 flex-shrink-0"
            >
              <Star className="w-4 h-4 text-gray-400 hover:text-yellow-500" />
            </button>
          )}
        </div>

        
        <div className="space-y-2">
          
          {coinData.currentPrice > 0 && (
            <div className="flex items-center justify-between flex-wrap gap-2">
              
              <span className="text-base sm:text-lg font-bold text-white break-words">
                {formatPrice(coinData.currentPrice)}
              </span>
              
              <div className="flex items-center space-x-1 flex-shrink-0">
                
                {isPositive ? (
                  <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 text-green-400" />
                ) : (
                  <TrendingDown className="w-3 h-3 sm:w-4 sm:h-4 text-red-400" />
                )}
                
                <span className={`text-xs sm:text-sm font-medium ${
                  isPositive ? 'text-green-400' : 'text-red-400'
                }`}>
                  {formatPercentage(priceChange24h)}
                </span>
              </div>
            </div>
          )}

          
          {coinData.marketCap > 0 && (
            <div className="flex items-center justify-between text-xs sm:text-sm">
              <span className="text-gray-400">Market Cap</span>
              
              <span className="text-gray-300 font-medium break-words text-right">
                {formatLargeNumber(coinData.marketCap)}
              </span>
            </div>
          )}

          
          {coinData.volume24h > 0 && (
            <div className="flex items-center justify-between text-xs sm:text-sm">
              <span className="text-gray-400">Volume 24h</span>
              
              <span className="text-gray-300 font-medium break-words text-right">
                {formatLargeNumber(coinData.volume24h)}
              </span>
            </div>
          )}

          
          {coinData.sparklineData.length > 0 && (
            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-gray-500">7d trend</span>
              
              <MiniSparkline data={coinData.sparklineData} />
            </div>
          )}
        </div>

        
        
        
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
      </div>
    </div>
  );
};


export default CoinCard;
