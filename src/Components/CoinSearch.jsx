import React, { useState, useEffect, useCallback } from 'react';
import { Search, TrendingUp, X, Loader, Star, Filter } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { searchCoins, getTopCoins, getTrendingCoins, getGlobalMarketData } from '../services/coinGeckoApi';
import CoinCard from './CoinCard';

const CoinSearch = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [topCoins, setTopCoins] = useState([]);
  const [trendingCoins, setTrendingCoins] = useState([]);
  const [globalData, setGlobalData] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('all');
  
  const navigate = useNavigate();

  const filterOptions = [
    { label: 'All', value: 'all' },
    { label: 'Top 50', value: 'top50' },
    { label: 'Trending', value: 'trending' }
  ];

  
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
        setSearchResults(results.slice(0, 8)); 
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
        const [topCoinsData, trendingData, globalMarketData] = await Promise.all([
          getTopCoins(50),
          getTrendingCoins(),
          getGlobalMarketData()
        ]);
        
        setTopCoins(topCoinsData);
        setTrendingCoins(trendingData);
        setGlobalData(globalMarketData);
      } catch (error) {
        console.error('Error loading initial data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadInitialData();
  }, []);

  const handleCoinClick = (coin) => {
    navigate(`/crypto/${coin.id}`, { state: { coin } });
    setShowSuggestions(false);
    setSearchQuery('');
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
    setShowSuggestions(false);
  };

  const getDisplayCoins = () => {
    switch (selectedFilter) {
      case 'top50':
        return topCoins;
      case 'trending':
        return trendingCoins.map(trend => trend.item);
      default:
        return topCoins;
    }
  };

  
  const GlobalStats = () => {
    if (!globalData) return null;

    const marketCapChange = globalData.market_cap_change_percentage_24h_usd || 0;
    const isPositive = marketCapChange >= 0;

    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
          <div className="flex items-center space-x-2 mb-2">
            <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
            <h3 className="text-sm font-medium text-gray-400">Total Market Cap</h3>
          </div>
          <p className="text-2xl font-bold text-white">
            ${(globalData.total_market_cap?.usd / 1e12).toFixed(2)}T
          </p>
          <div className="flex items-center space-x-1 mt-2">
            <TrendingUp className={`w-4 h-4 ${isPositive ? 'text-green-400' : 'text-red-400'}`} />
            <span className={`text-sm ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
              {isPositive ? '+' : ''}{marketCapChange.toFixed(2)}% (24h)
            </span>
          </div>
        </div>

        <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
          <div className="flex items-center space-x-2 mb-2">
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            <h3 className="text-sm font-medium text-gray-400">24h Volume</h3>
          </div>
          <p className="text-2xl font-bold text-white">
            ${(globalData.total_volume?.usd / 1e9).toFixed(1)}B
          </p>
          <p className="text-sm text-gray-400 mt-2">
            Active Cryptocurrencies: {globalData.active_cryptocurrencies?.toLocaleString()}
          </p>
        </div>

        <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
          <div className="flex items-center space-x-2 mb-2">
            <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
            <h3 className="text-sm font-medium text-gray-400">BTC Dominance</h3>
          </div>
          <p className="text-2xl font-bold text-white">
            {globalData.market_cap_percentage?.btc?.toFixed(1)}%
          </p>
          <p className="text-sm text-gray-400 mt-2">
            ETH: {globalData.market_cap_percentage?.eth?.toFixed(1)}%
          </p>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900/20 to-purple-900/20 p-4">
      <div className="max-w-7xl mx-auto">
        
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            Crypto<span className="text-blue-400">Scope</span>
          </h1>
          <p className="text-xl text-gray-300">
            Discover, track, and analyze cryptocurrency markets in real-time
          </p>
        </div>

        
        <div className="relative max-w-2xl mx-auto mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search cryptocurrencies (e.g. Bitcoin, Ethereum, BTC, ETH...)"
              className="w-full pl-12 pr-12 py-4 bg-gray-900/60 backdrop-blur-sm border border-gray-700 rounded-xl
                       text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20
                       transition-all duration-300"
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
                <Loader className="w-5 h-5 text-blue-400 animate-spin" />
              </div>
            )}
          </div>

          
          {showSuggestions && searchResults.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-gray-900/95 backdrop-blur-sm border border-gray-700 rounded-xl shadow-xl z-50">
              <div className="p-2">
                {searchResults.map((coin) => (
                  <div
                    key={coin.id}
                    onClick={() => handleCoinClick(coin)}
                    className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-800/60 cursor-pointer transition-colors"
                  >
                    <img
                      src={coin.large || coin.thumb}
                      alt={coin.name}
                      className="w-8 h-8 rounded-full"
                      onError={(e) => {
                        e.target.src = '/api/placeholder/32/32';
                      }}
                    />
                    <div>
                      <p className="font-medium text-white">{coin.name}</p>
                      <p className="text-sm text-gray-400 uppercase">{coin.symbol}</p>
                    </div>
                    <div className="ml-auto">
                      {coin.market_cap_rank && (
                        <span className="text-xs bg-blue-600 text-white px-2 py-1 rounded-full">
                          #{coin.market_cap_rank}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        
        <GlobalStats />

        
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <span className="text-gray-300 font-medium">Filter:</span>
            <div className="flex space-x-2">
              {filterOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setSelectedFilter(option.value)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    selectedFilter === option.value
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="flex space-x-2">
              <div className="w-3 h-3 bg-blue-400 rounded-full animate-bounce"></div>
              <div className="w-3 h-3 bg-blue-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
              <div className="w-3 h-3 bg-blue-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {getDisplayCoins().map((coin) => (
              <CoinCard
                key={coin.id}
                coin={coin}
                onClick={handleCoinClick}
                showFavorite={true}
              />
            ))}
          </div>
        )}

        
        {!isLoading && getDisplayCoins().length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-medium text-white mb-2">No cryptocurrencies found</h3>
            <p className="text-gray-400">Try adjusting your search or filter criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CoinSearch;
