import React, { useState, useEffect } from 'react'
import { Search, TrendingUp, TrendingDown, X, Loader, ArrowRight, DollarSign, BarChart3, Globe, BarChart } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { searchCoins, getTopCoins, getGlobalMarketData, formatPercentage } from '../services/coinGeckoApi'
import { useCurrency } from '../contexts/CurrencyContext'
import CoinCard from './CoinCard'
import DetailedCoinAnalysis from './DetailedCoinAnalysis'
import "../index.css"

const Home = () => {
  const { formatLargeNumber } = useCurrency()
  const [globalData, setGlobalData] = useState(null)
  const [topCoins, setTopCoins] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [isSearching, setIsSearching] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [isSearchFocused, setIsSearchFocused] = useState(false)
  const [loading, setLoading] = useState(true)
  const [selectedCoinForAnalysis, setSelectedCoinForAnalysis] = useState(null)
  const [error, setError] = useState(null)
  
  const navigate = useNavigate()

  
  useEffect(() => {
    const loadInitialData = async () => {
      setLoading(true)
      try {
        console.log('Starting to load initial data...')
        
        
        const [globalMarketData, topCoinsData] = await Promise.allSettled([
          getGlobalMarketData(),
          getTopCoins(3)
        ])
        
        
        if (globalMarketData.status === 'fulfilled') {
          console.log('Global market data loaded successfully')
          setGlobalData(globalMarketData.value)
        } else {
          console.log('Using fallback global market data')
          setError('API data unavailable. Using demo data.')
          setGlobalData({
            total_market_cap: { usd: 2500000000000 },
            total_volume: { usd: 95000000000 },
            market_cap_change_percentage_24h_usd: 2.5,
            active_cryptocurrencies: 10000,
            market_cap_percentage: { btc: 54.2, eth: 17.8 }
          })
        }
        
        
        if (topCoinsData.status === 'fulfilled') {
          console.log('Top coins data loaded successfully')
          setTopCoins(topCoinsData.value)
        } else {
          console.log('Using fallback top coins data')
          if (!error) setError('API data unavailable. Using demo data.')
          setTopCoins([
            {
              id: 'bitcoin',
              symbol: 'btc',
              name: 'Bitcoin',
              image: 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png',
              current_price: 65000,
              market_cap: 1280000000000,
              market_cap_rank: 1,
              price_change_percentage_24h: 2.5,
              total_volume: 25000000000,
              sparkline_in_7d: { price: [63000, 64000, 65000, 66000, 65500, 65000] }
            },
            {
              id: 'ethereum',
              symbol: 'eth',
              name: 'Ethereum',
              image: 'https://assets.coingecko.com/coins/images/279/large/ethereum.png',
              current_price: 3200,
              market_cap: 385000000000,
              market_cap_rank: 2,
              price_change_percentage_24h: -1.2,
              total_volume: 15000000000,
              sparkline_in_7d: { price: [3100, 3150, 3200, 3250, 3220, 3200] }
            },
            {
              id: 'binancecoin',
              symbol: 'bnb',
              name: 'BNB',
              image: 'https://assets.coingecko.com/coins/images/825/large/bnb-icon2_2x.png',
              current_price: 620,
              market_cap: 95000000000,
              market_cap_rank: 3,
              price_change_percentage_24h: 0.8,
              total_volume: 2500000000,
              sparkline_in_7d: { price: [610, 615, 620, 625, 622, 620] }
            }
          ])
        }
        
      } catch (error) {
        console.error('Unexpected error loading initial data:', error)
        
        setGlobalData({
          total_market_cap: { usd: 2500000000000 },
          total_volume: { usd: 95000000000 },
          market_cap_change_percentage_24h_usd: 2.5,
          active_cryptocurrencies: 10000,
          market_cap_percentage: { btc: 54.2, eth: 17.8 }
        })
        setTopCoins([])
      } finally {
        setLoading(false)
      }
    }

    loadInitialData()
  }, [])

  
  useEffect(() => {
    const timeoutId = setTimeout(async () => {
      if (!searchQuery.trim()) {
        setSearchResults([])
        setShowSuggestions(false)
        return
      }

      setIsSearching(true)
      try {
        const results = await searchCoins(searchQuery)
        console.log('Search results:', results)
        if (results && Array.isArray(results)) {
          setSearchResults(results.slice(0, 6)) 
          setShowSuggestions(true)
        } else {
          
          setSearchResults([
            {
              id: 'bitcoin',
              name: 'Bitcoin',
              symbol: 'BTC',
              market_cap_rank: 1,
              thumb: 'https://assets.coingecko.com/coins/images/1/thumb/bitcoin.png',
              large: 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png'
            },
            {
              id: 'ethereum', 
              name: 'Ethereum',
              symbol: 'ETH',
              market_cap_rank: 2,
              thumb: 'https://assets.coingecko.com/coins/images/279/thumb/ethereum.png',
              large: 'https://assets.coingecko.com/coins/images/279/large/ethereum.png'
            }
          ].filter(coin => 
            coin.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
            coin.symbol.toLowerCase().includes(searchQuery.toLowerCase())
          ))
          setShowSuggestions(true)
        }
      } catch (error) {
        console.error('Search error:', error)
        
        setSearchResults([
          {
            id: 'bitcoin',
            name: 'Bitcoin',
            symbol: 'BTC',
            market_cap_rank: 1,
            thumb: 'https://assets.coingecko.com/coins/images/1/thumb/bitcoin.png',
            large: 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png'
          }
        ])
        setShowSuggestions(true)
      } finally {
        setIsSearching(false)
      }
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [searchQuery])

  const handleCoinClick = (coin) => {
    navigate(`/crypto/${coin.id}`, { state: { coin } })
    setShowSuggestions(false)
    setIsSearchFocused(false)
    setSearchQuery('')
  }

  const clearSearch = () => {
    setSearchQuery('')
    setSearchResults([])
    setShowSuggestions(false)
  }

  const GlobalMarketStats = () => {
    if (loading) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-gray-800 bg-opacity-60 p-6 rounded-xl border border-gray-600 animate-pulse">
              <div className="h-4 bg-gray-700 rounded mb-4"></div>
              <div className="h-8 bg-gray-700 rounded mb-2"></div>
              <div className="h-4 bg-gray-700 rounded"></div>
            </div>
          ))}
        </div>
      )
    }

    if (!globalData) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-red-900/20 border-red-500/30 p-6 rounded-xl border-2">
            <div className="text-center text-red-400">
              <p className="text-sm">Failed to load market data</p>
              <p className="text-xs mt-1">Using demo data</p>
            </div>
          </div>
          <div className="bg-red-900/20 border-red-500/30 p-6 rounded-xl border-2">
            <div className="text-center text-red-400">
              <p className="text-sm">API Error</p>
              <p className="text-xs mt-1">Please refresh page</p>
            </div>
          </div>
          <div className="bg-red-900/20 border-red-500/30 p-6 rounded-xl border-2">
            <div className="text-center text-red-400">
              <p className="text-sm">Connection Issue</p>
              <p className="text-xs mt-1">Check internet</p>
            </div>
          </div>
        </div>
      )
    }

    const marketCapChange = globalData.market_cap_change_percentage_24h_usd || 0
    const isPositive = marketCapChange >= 0

    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mb-12">
        <div className="bg-gray-800 bg-opacity-80 p-4 sm:p-6 rounded-xl border-2 border-gray-600 hover:border-blue-500 transition-all duration-300 hover:transform hover:scale-105 shadow-lg">
          <div className="flex items-center space-x-2 mb-3">
            <DollarSign className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400" />
            <h3 className="text-sm sm:text-lg font-semibold text-gray-300">Total Market Cap</h3>
          </div>
          <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-2 break-words">
            {formatLargeNumber(globalData.total_market_cap?.usd)}
          </p>
          <div className="flex items-center space-x-1">
            {isPositive ? (
              <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 text-green-400" />
            ) : (
              <TrendingDown className="w-3 h-3 sm:w-4 sm:h-4 text-red-400" />
            )}
            <span className={`text-xs sm:text-sm font-medium ${
              isPositive ? 'text-green-400' : 'text-red-400'
            }`}>
              {formatPercentage(marketCapChange)} (24h)
            </span>
          </div>
        </div>

        <div className="bg-gray-800 bg-opacity-80 p-4 sm:p-6 rounded-xl border-2 border-gray-600 hover:border-yellow-500 transition-all duration-300 hover:transform hover:scale-105 shadow-lg">
          <div className="flex items-center space-x-2 mb-3">
            <BarChart3 className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-400" />
            <h3 className="text-sm sm:text-lg font-semibold text-gray-300">24h Volume</h3>
          </div>
          <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-2 break-words">
            {formatLargeNumber(globalData.total_volume?.usd)}
          </p>
          <p className="text-xs sm:text-sm text-gray-400">
            Active Cryptocurrencies: {globalData.active_cryptocurrencies?.toLocaleString()}
          </p>
        </div>

        <div className="bg-gray-800 bg-opacity-80 p-4 sm:p-6 rounded-xl border-2 border-gray-600 hover:border-purple-500 transition-all duration-300 hover:transform hover:scale-105 shadow-lg">
          <div className="flex items-center space-x-2 mb-3">
            <Globe className="w-5 h-5 sm:w-6 sm:h-6 text-purple-400" />
            <h3 className="text-sm sm:text-lg font-semibold text-gray-300">Market Dominance</h3>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm sm:text-base text-white font-semibold">BTC:</span>
              <span className="text-lg sm:text-xl lg:text-2xl font-bold text-orange-400">
                {globalData.market_cap_percentage?.btc?.toFixed(1)}%
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm sm:text-base text-white font-semibold">ETH:</span>
              <span className="text-base sm:text-lg lg:text-xl font-bold text-blue-400">
                {globalData.market_cap_percentage?.eth?.toFixed(1)}%
              </span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="font-intel min-h-screen text-white px-3 sm:px-4 py-6 sm:py-8">
      <div className="max-w-7xl mx-auto">
        
        
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-3xl xs:text-4xl sm:text-5xl lg:text-6xl font-bold mb-3 sm:mb-2 bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent px-2">
            CoinScope
          </h1>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 mb-4 sm:mb-6 px-2">
            <h2 className="text-xl xs:text-2xl sm:text-3xl lg:text-4xl font-bold text-white text-center">
              Largest
            </h2>
            <div className="flex items-center gap-2 sm:gap-3">
              <h2 className="text-xl xs:text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent text-center">
                Crypto Marketplace
              </h2>
              <div className="text-2xl xs:text-3xl sm:text-4xl lg:text-5xl animate-bounce text-orange-400">
                ₿
              </div>
            </div>
          </div>
          <p className="text-base sm:text-lg lg:text-xl text-gray-300 mb-6 sm:mb-8 px-4 leading-relaxed">
            Your gateway to the cryptocurrency universe
          </p>

          
          <div className="max-w-2xl mx-auto relative px-4 sm:px-0">
            <div className="relative">
              {isSearching ? (
                <Loader className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-blue-400 w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
              ) : (
                <Search className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
              )}
              <input
                type="text"
                placeholder="Search cryptocurrencies..."
                className="w-full pl-10 sm:pl-12 pr-10 sm:pr-4 py-3 sm:py-4 bg-gray-800 border border-gray-700 rounded-xl text-sm sm:text-base text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
              />
              {searchQuery && (
                <button
                  onClick={clearSearch}
                  className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                >
                  <X className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              )}
            </div>
            
            
            {isSearchFocused && searchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-gray-800 border border-gray-700 rounded-xl shadow-xl z-50 mx-4 sm:mx-0">
                <div className="max-h-80 sm:max-h-96 overflow-y-auto">
                  {searchResults.map((coin) => (
                    <div
                      key={coin.id}
                      className="flex items-center space-x-3 p-3 sm:p-4 hover:bg-gray-700 cursor-pointer transition-colors border-b border-gray-700 last:border-b-0"
                      onClick={() => handleCoinClick(coin)}
                    >
                      <img
                        src={coin.large || coin.thumb}
                        alt={coin.name}
                        className="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex-shrink-0"
                        onError={(e) => {
                          e.target.src = '/api/placeholder/32/32';
                        }}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-white text-sm sm:text-base truncate">{coin.name}</p>
                        <p className="text-xs sm:text-sm text-gray-400 uppercase">{coin.symbol}</p>
                      </div>
                      {coin.market_cap_rank && (
                        <span className="text-xs bg-blue-600 text-white px-2 py-1 rounded-full flex-shrink-0">
                          #{coin.market_cap_rank}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        
        <GlobalMarketStats />

        
        <div className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4 px-2">Top Cryptocurrencies</h2>
            <p className="text-sm sm:text-base text-gray-400 px-4">Live data from the top performing digital assets</p>
          </div>
          
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-gray-800 bg-opacity-60 p-4 sm:p-6 rounded-xl border border-gray-600 animate-pulse">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-700 rounded-full"></div>
                    <div className="flex-1">
                      <div className="h-4 sm:h-5 bg-gray-700 rounded w-3/4 mb-2"></div>
                      <div className="h-3 sm:h-4 bg-gray-700 rounded w-1/2"></div>
                    </div>
                  </div>
                  <div className="h-5 sm:h-6 bg-gray-700 rounded mb-2"></div>
                  <div className="h-3 sm:h-4 bg-gray-700 rounded"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {topCoins.map((coin) => (
                <CoinCard
                  key={coin.id}
                  coin={coin}
                  onClick={handleCoinClick}
                  showFavorite={false}
                />
              ))}
            </div>
          )}
        </div>

        
      </div>
      
      
      {selectedCoinForAnalysis && (
        <DetailedCoinAnalysis
          coin={selectedCoinForAnalysis}
          onClose={() => setSelectedCoinForAnalysis(null)}
        />
      )}
    </div>
  )
}

export default Home
