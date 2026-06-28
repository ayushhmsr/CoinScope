import React, { useState, useEffect, useCallback } from 'react';
import { Search, TrendingUp, TrendingDown, X, Loader, ArrowLeft } from 'lucide-react';
import { searchCoins, getTopCoins, getGlobalMarketData, getCoinDetails, formatPrice, formatPercentage, formatLargeNumber } from '../services/coinGeckoApi';
import PriceChart from './PriceChart';
import "../index.css";

const Content = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [topCoins, setTopCoins] = useState([]);
  const [globalData, setGlobalData] = useState(null);
  const [selectedCoin, setSelectedCoin] = useState(null);
  const [coinDetails, setCoinDetails] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);

  
  const debouncedSearch = useCallback(
    async (query) => {
      if (!query.trim()) {
        setSearchResults([]);
        setShowSuggestions(false);
        return;
      }

      setIsSearching(true);
      try {
        const results = await searchCoins(query);
        setSearchResults(results.slice(0, 6)); 
        setShowSuggestions(true);
      } catch (error) {
        console.error('Search error:', error);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    },
    []
  );

  
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      debouncedSearch(searchQuery);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, debouncedSearch]);

  
  useEffect(() => {
    const loadInitialData = async () => {
      setIsLoading(true);
      try {
        const [topCoinsData, globalMarketData] = await Promise.all([
          getTopCoins(3), 
          getGlobalMarketData()
        ]);
        
        setTopCoins(topCoinsData);
        setGlobalData(globalMarketData);
      } catch (error) {
        console.error('Error loading initial data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadInitialData();
  }, []);

  
  const handleCoinClick = async (coin) => {
    setSelectedCoin(coin);
    setIsLoadingDetails(true);
    
    try {
      const details = await getCoinDetails(coin.id);
      setCoinDetails(details);
    } catch (error) {
      console.error('Error fetching coin details:', error);
    } finally {
      setIsLoadingDetails(false);
    }
    
    setShowSuggestions(false);
    setSearchQuery('');
  };

  
  const handleBackToHome = () => {
    setSelectedCoin(null);
    setCoinDetails(null);
  };

  
  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
    setShowSuggestions(false);
  };

  
  if (selectedCoin) {
    return (
      <div className="font-intel min-h-screen p-6">
        
        <div className="max-w-6xl mx-auto mb-6">
          <button
            onClick={handleBackToHome}
            className="flex items-center space-x-2 text-gray-400 hover:text-yellow-500 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Home</span>
          </button>
        </div>

        {isLoadingDetails ? (
          <div className="flex items-center justify-center h-64">
            <div className="flex space-x-2">
              <div className="w-3 h-3 bg-yellow-500 rounded-full animate-bounce"></div>
              <div className="w-3 h-3 bg-yellow-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
              <div className="w-3 h-3 bg-yellow-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
            </div>
          </div>
        ) : coinDetails ? (
          <div className="max-w-6xl mx-auto">
            
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
              <div className="flex items-center space-x-4 mb-4 lg:mb-0">
                <img
                  src={coinDetails.image?.large}
                  alt={coinDetails.name}
                  className="w-16 h-16 rounded-full ring-2 ring-yellow-500"
                />
                <div>
                  <h1 className="text-3xl font-bold text-white">
                    {coinDetails.name}
                    <span className="text-xl text-gray-400 ml-2 uppercase">
                      {coinDetails.symbol}
                    </span>
                  </h1>
                  <p className="text-yellow-500">Rank #{coinDetails.market_data?.market_cap_rank}</p>
                </div>
              </div>
              
              
              <div className="text-right">
                <p className="text-3xl font-bold text-white mb-2">
                  {formatPrice(coinDetails.market_data?.current_price?.usd)}
                </p>
                <div className="flex items-center justify-end space-x-2">
                  {coinDetails.market_data?.price_change_percentage_24h >= 0 ? (
                    <TrendingUp className="w-5 h-5 text-green-400" />
                  ) : (
                    <TrendingDown className="w-5 h-5 text-red-400" />
                  )}
                  <span className={`font-medium ${
                    coinDetails.market_data?.price_change_percentage_24h >= 0 ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {formatPercentage(coinDetails.market_data?.price_change_percentage_24h)} (24h)
                  </span>
                </div>
              </div>
            </div>

            
            <div className="mb-8">
              <PriceChart
                coinId={coinDetails.id}
                coinName={coinDetails.name}
                currentPrice={coinDetails.market_data?.current_price?.usd}
              />
            </div>

            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-gray-800 bg-opacity-80 p-6 rounded-lg border-2 border-gray-600 hover:border-yellow-500 transition-all duration-300">
                <h3 className="text-sm font-medium text-gray-400 mb-2">Market Cap</h3>
                <p className="text-2xl font-bold text-white">
                  {formatLargeNumber(coinDetails.market_data?.market_cap?.usd)}
                </p>
              </div>
              
              <div className="bg-gray-800 bg-opacity-80 p-6 rounded-lg border-2 border-gray-600 hover:border-yellow-500 transition-all duration-300">
                <h3 className="text-sm font-medium text-gray-400 mb-2">24h Volume</h3>
                <p className="text-2xl font-bold text-white">
                  {formatLargeNumber(coinDetails.market_data?.total_volume?.usd)}
                </p>
              </div>
              
              <div className="bg-gray-800 bg-opacity-80 p-6 rounded-lg border-2 border-gray-600 hover:border-yellow-500 transition-all duration-300">
                <h3 className="text-sm font-medium text-gray-400 mb-2">Circulating Supply</h3>
                <p className="text-2xl font-bold text-white">
                  {coinDetails.market_data?.circulating_supply?.toLocaleString()}
                </p>
              </div>
              
              <div className="bg-gray-800 bg-opacity-80 p-6 rounded-lg border-2 border-gray-600 hover:border-yellow-500 transition-all duration-300">
                <h3 className="text-sm font-medium text-gray-400 mb-2">All-Time High</h3>
                <p className="text-2xl font-bold text-white">
                  {formatPrice(coinDetails.market_data?.ath?.usd)}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center text-white">Failed to load coin details</div>
        )}
      </div>
    );
  }

  return (
    <div className="font-intel flex flex-col justify-center items-center mt-[120px] px-4">
      
      
      <div className="flex items-center gap-4 mb-8">
        <div id="heading">
          <h1 className="text-4xl lg:text-5xl text-white leading-snug text-center lg:text-left">
            Largest <br /> <span className="text-yellow-500">Crypto Marketplace</span>
          </h1>
        </div>

        <div id="img" className="hidden lg:block">
          <img src="/generated-image-5.png" className="h-[150px] border-none" alt="Crypto Logo" />
        </div>
      </div>

      
      <div className="relative mt-6 w-full max-w-2xl">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search cryptocurrencies (e.g. Bitcoin, Ethereum, BTC...)"
            className="w-full pl-12 pr-12 py-3 bg-gray-800 border-2 border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-yellow-500 transition-colors"
            onFocus={() => searchQuery && setShowSuggestions(true)}
          />
          {searchQuery && (
            <button
              onClick={clearSearch}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
          {isSearching && (
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
              <Loader className="w-5 h-5 text-yellow-500 animate-spin" />
            </div>
          )}
        </div>

        
        {showSuggestions && searchResults.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-gray-800 bg-opacity-95 backdrop-blur-sm border-2 border-gray-600 rounded-lg shadow-xl z-50">
            <div className="p-2">
              {searchResults.map((coin) => (
                <div
                  key={coin.id}
                  onClick={() => handleCoinClick(coin)}
                  className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-700 cursor-pointer transition-colors"
                >
                  <img
                    src={coin.large || coin.thumb}
                    alt={coin.name}
                    className="w-8 h-8 rounded-full"
                  />
                  <div>
                    <p className="font-medium text-white">{coin.name}</p>
                    <p className="text-sm text-gray-400 uppercase">{coin.symbol}</p>
                  </div>
                  {coin.market_cap_rank && (
                    <div className="ml-auto">
                      <span className="text-xs bg-yellow-500 text-black px-2 py-1 rounded-full font-medium">
                        #{coin.market_cap_rank}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      
      {!isLoading && globalData && (
        <div className="w-full max-w-6xl mt-12 mb-8">
          <h2 className="text-2xl font-bold text-white text-center mb-6">Global Market Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-800 bg-opacity-80 p-6 rounded-lg border-2 border-gray-600 hover:border-yellow-500 transition-all duration-300 hover:transform hover:scale-105 shadow-lg">
              <div className="flex items-center space-x-2 mb-2">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <h3 className="text-sm font-medium text-gray-400">Total Market Cap</h3>
              </div>
              <p className="text-2xl font-bold text-white mb-2">
                ${(globalData.total_market_cap?.usd / 1e12).toFixed(2)}T
              </p>
              <div className="flex items-center space-x-1">
                {globalData.market_cap_change_percentage_24h_usd >= 0 ? (
                  <TrendingUp className="w-4 h-4 text-green-400" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-red-400" />
                )}
                <span className={`text-sm ${
                  globalData.market_cap_change_percentage_24h_usd >= 0 ? 'text-green-400' : 'text-red-400'
                }`}>
                  {globalData.market_cap_change_percentage_24h_usd >= 0 ? '+' : ''}
                  {globalData.market_cap_change_percentage_24h_usd?.toFixed(2)}% (24h)
                </span>
              </div>
            </div>

            <div className="bg-gray-800 bg-opacity-80 p-6 rounded-lg border-2 border-gray-600 hover:border-yellow-500 transition-all duration-300 hover:transform hover:scale-105 shadow-lg">
              <div className="flex items-center space-x-2 mb-2">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <h3 className="text-sm font-medium text-gray-400">24h Volume</h3>
              </div>
              <p className="text-2xl font-bold text-white mb-2">
                ${(globalData.total_volume?.usd / 1e9).toFixed(1)}B
              </p>
              <p className="text-sm text-gray-400">
                Active: {globalData.active_cryptocurrencies?.toLocaleString()}
              </p>
            </div>

            <div className="bg-gray-800 bg-opacity-80 p-6 rounded-lg border-2 border-gray-600 hover:border-yellow-500 transition-all duration-300 hover:transform hover:scale-105 shadow-lg">
              <div className="flex items-center space-x-2 mb-2">
                <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                <h3 className="text-sm font-medium text-gray-400">BTC Dominance</h3>
              </div>
              <p className="text-2xl font-bold text-white mb-2">
                {globalData.market_cap_percentage?.btc?.toFixed(1)}%
              </p>
              <p className="text-sm text-gray-400">
                ETH: {globalData.market_cap_percentage?.eth?.toFixed(1)}%
              </p>
            </div>
          </div>
        </div>
      )}

      
      {!isLoading && topCoins.length > 0 && (
        <div className="w-full max-w-6xl">
          <h2 className="text-2xl font-bold text-white text-center mb-6">Top 3 Cryptocurrencies</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {topCoins.map((coin) => (
              <div
                key={coin.id}
                onClick={() => handleCoinClick(coin)}
                className="bg-gray-800 bg-opacity-80 p-6 rounded-lg border-2 border-gray-600 hover:border-yellow-500 transition-all duration-300 hover:transform hover:scale-105 shadow-lg cursor-pointer group"
              >
                <div className="flex items-center space-x-3 mb-4">
                  <img
                    src={coin.image}
                    alt={coin.name}
                    className="w-12 h-12 rounded-full ring-2 ring-gray-600 group-hover:ring-yellow-500 transition-all"
                  />
                  <div>
                    <h3 className="font-semibold text-white group-hover:text-yellow-500 transition-colors">
                      {coin.name}
                    </h3>
                    <p className="text-sm text-gray-400 uppercase">{coin.symbol}</p>
                  </div>
                  <div className="ml-auto">
                    <span className="text-xs bg-yellow-500 text-black px-2 py-1 rounded-full font-medium">
                      #{coin.market_cap_rank}
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-white">
                      {formatPrice(coin.current_price)}
                    </span>
                    <div className="flex items-center space-x-1">
                      {coin.price_change_percentage_24h >= 0 ? (
                        <TrendingUp className="w-4 h-4 text-green-400" />
                      ) : (
                        <TrendingDown className="w-4 h-4 text-red-400" />
                      )}
                      <span className={`text-sm font-medium ${
                        coin.price_change_percentage_24h >= 0 ? 'text-green-400' : 'text-red-400'
                      }`}>
                        {formatPercentage(coin.price_change_percentage_24h)}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">Market Cap</span>
                    <span className="text-gray-300 font-medium">
                      {formatLargeNumber(coin.market_cap)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      
      {isLoading && (
        <div className="flex items-center justify-center h-32 mt-12">
          <div className="flex space-x-2">
            <div className="w-3 h-3 bg-yellow-500 rounded-full animate-bounce"></div>
            <div className="w-3 h-3 bg-yellow-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
            <div className="w-3 h-3 bg-yellow-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Content;