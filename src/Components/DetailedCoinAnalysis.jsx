import React, { useState, useEffect } from 'react'
import { 
  TrendingUp, 
  TrendingDown, 
  BarChart3, 
  DollarSign, 
  Activity, 
  Target,
  AlertTriangle,
  ArrowUp,
  ArrowDown,
  Eye,
  Users,
  Zap
} from 'lucide-react'
import { getCoinDetails, getCoinPriceHistory, formatPrice, formatPercentage, formatLargeNumber } from '../services/coinGeckoApi'
import PriceChart from './PriceChart'

const DetailedCoinAnalysis = ({ coin, onClose }) => {
  const [coinData, setCoinData] = useState(null)
  const [priceHistory, setPriceHistory] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => {
    if (!coin?.id) return

    const fetchDetailedData = async () => {
      setLoading(true)
      try {
        const [detailsData, historyData] = await Promise.all([
          getCoinDetails(coin.id),
          getCoinPriceHistory(coin.id, 30)
        ])
        
        setCoinData(detailsData)
        setPriceHistory(historyData)
      } catch (error) {
        console.error('Error fetching detailed data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchDetailedData()
  }, [coin])

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center">
        <div className="bg-gray-900 rounded-xl p-8 border border-gray-700 max-w-2xl">
          <div className="flex space-x-2 justify-center">
            <div className="w-3 h-3 bg-yellow-500 rounded-full animate-bounce"></div>
            <div className="w-3 h-3 bg-yellow-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
            <div className="w-3 h-3 bg-yellow-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
          </div>
          <p className="text-white text-center mt-4">Loading detailed analysis...</p>
        </div>
      </div>
    )
  }

  if (!coinData) return null

  const marketData = coinData.market_data || {}
  const currentPrice = marketData.current_price?.usd || 0
  const priceChange24h = marketData.price_change_percentage_24h || 0
  const priceChange7d = marketData.price_change_percentage_7d || 0
  const volume24h = marketData.total_volume?.usd || 0
  const marketCap = marketData.market_cap?.usd || 0
  const volumeToMarketCapRatio = volume24h / marketCap * 100

  
  const getMarketSentiment = () => {
    let score = 0
    let factors = []

    
    if (priceChange24h > 5) {
      score += 2
      factors.push("Strong 24h gains")
    } else if (priceChange24h > 0) {
      score += 1
      factors.push("Positive 24h movement")
    } else if (priceChange24h < -5) {
      score -= 2
      factors.push("Significant 24h decline")
    } else if (priceChange24h < 0) {
      score -= 1
      factors.push("Negative 24h movement")
    }

    
    if (volumeToMarketCapRatio > 15) {
      score += 1
      factors.push("High trading activity")
    } else if (volumeToMarketCapRatio < 2) {
      score -= 1
      factors.push("Low trading activity")
    }

    
    if (marketData.market_cap_rank <= 10) {
      score += 1
      factors.push("Top 10 cryptocurrency")
    } else if (marketData.market_cap_rank <= 50) {
      score += 0.5
      factors.push("Top 50 cryptocurrency")
    }

    let sentiment = "Neutral"
    let color = "text-gray-400"
    let icon = Activity

    if (score >= 2) {
      sentiment = "Very Bullish"
      color = "text-green-500"
      icon = TrendingUp
    } else if (score >= 1) {
      sentiment = "Bullish"
      color = "text-green-400"
      icon = ArrowUp
    } else if (score <= -2) {
      sentiment = "Very Bearish"
      color = "text-red-500"
      icon = TrendingDown
    } else if (score <= -1) {
      sentiment = "Bearish"
      color = "text-red-400"
      icon = ArrowDown
    }

    return { sentiment, color, icon, factors, score }
  }

  const sentimentAnalysis = getMarketSentiment()

  
  const getSupportResistance = () => {
    if (!priceHistory?.prices) return null

    const prices = priceHistory.prices.map(p => p[1])
    const high = Math.max(...prices)
    const low = Math.min(...prices)
    const range = high - low
    
    const resistance = high - (range * 0.1) 
    const support = low + (range * 0.1) 

    return { support, resistance, high, low }
  }

  const levels = getSupportResistance()

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Eye },
    { id: 'analysis', label: 'Analysis', icon: BarChart3 },
    { id: 'sentiment', label: 'Sentiment', icon: Activity }
  ]

  const MetricCard = ({ title, value, change, icon: Icon, color = "text-blue-400" }) => (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-4 border border-gray-700">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          <Icon className={`w-4 h-4 ${color}`} />
          <span className="text-sm text-gray-400">{title}</span>
        </div>
        {change !== undefined && (
          <div className={`flex items-center space-x-1 text-xs ${
            change >= 0 ? 'text-green-400' : 'text-red-400'
          }`}>
            {change >= 0 ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
            <span>{formatPercentage(Math.abs(change))}</span>
          </div>
        )}
      </div>
      <p className="text-lg font-bold text-white">{value}</p>
    </div>
  )

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-gray-900/95 backdrop-blur-sm rounded-xl border border-gray-700 max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <div className="flex items-center space-x-4">
            <img
              src={coinData.image?.large}
              alt={coinData.name}
              className="w-12 h-12 rounded-full"
              onError={(e) => {
                e.target.src = '/api/placeholder/48/48'
              }}
            />
            <div>
              <h2 className="text-2xl font-bold text-white">
                {coinData.name}
                <span className="text-lg text-gray-400 ml-2 uppercase">{coinData.symbol}</span>
              </h2>
              <p className="text-3xl font-bold text-yellow-500">{formatPrice(currentPrice)}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors text-2xl"
          >
            ×
          </button>
        </div>

        
        <div className="flex space-x-1 p-2 bg-gray-800/30">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-yellow-500 text-black'
                    : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="font-medium">{tab.label}</span>
              </button>
            )
          })}
        </div>

        
        <div className="p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              
              <div className="mb-6">
                <PriceChart
                  coinId={coinData.id}
                  coinName={coinData.name}
                  currentPrice={currentPrice}
                />
              </div>

              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <MetricCard
                  title="Market Cap"
                  value={formatLargeNumber(marketCap)}
                  change={marketData.market_cap_change_percentage_24h}
                  icon={DollarSign}
                  color="text-blue-400"
                />
                <MetricCard
                  title="24h Volume"
                  value={formatLargeNumber(volume24h)}
                  icon={BarChart3}
                  color="text-green-400"
                />
                <MetricCard
                  title="Circulating Supply"
                  value={`${marketData.circulating_supply?.toLocaleString()} ${coinData.symbol?.toUpperCase()}`}
                  icon={Users}
                  color="text-purple-400"
                />
                <MetricCard
                  title="Volume/Market Cap"
                  value={`${volumeToMarketCapRatio.toFixed(2)}%`}
                  icon={Activity}
                  color="text-orange-400"
                />
              </div>

              
              {levels && (
                <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-4 border border-gray-700">
                  <h3 className="text-lg font-semibold text-white mb-4">Key Price Levels (30d)</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                    <div>
                      <p className="text-sm text-gray-400">Support</p>
                      <p className="text-lg font-bold text-green-400">{formatPrice(levels.support)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Current</p>
                      <p className="text-lg font-bold text-white">{formatPrice(currentPrice)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Resistance</p>
                      <p className="text-lg font-bold text-red-400">{formatPrice(levels.resistance)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">30d High</p>
                      <p className="text-lg font-bold text-yellow-400">{formatPrice(levels.high)}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'analysis' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-gray-700">
                  <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                    <BarChart3 className="w-5 h-5 mr-2 text-blue-400" />
                    Technical Analysis
                  </h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Price Trend (24h)</span>
                      <div className={`flex items-center space-x-1 ${
                        priceChange24h >= 0 ? 'text-green-400' : 'text-red-400'
                      }`}>
                        {priceChange24h >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                        <span className="font-bold">{formatPercentage(priceChange24h)}</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Weekly Trend (7d)</span>
                      <div className={`flex items-center space-x-1 ${
                        priceChange7d >= 0 ? 'text-green-400' : 'text-red-400'
                      }`}>
                        {priceChange7d >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                        <span className="font-bold">{formatPercentage(priceChange7d)}</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Volatility</span>
                      <span className={`font-bold ${
                        Math.abs(priceChange24h) > 10 ? 'text-red-400' : 
                        Math.abs(priceChange24h) > 5 ? 'text-yellow-400' : 'text-green-400'
                      }`}>
                        {Math.abs(priceChange24h) > 10 ? 'High' : 
                         Math.abs(priceChange24h) > 5 ? 'Medium' : 'Low'}
                      </span>
                    </div>
                  </div>
                </div>

                
                <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-gray-700">
                  <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                    <Target className="w-5 h-5 mr-2 text-green-400" />
                    Market Metrics
                  </h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Market Cap Rank</span>
                      <span className="font-bold text-white">#{marketData.market_cap_rank}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Liquidity Score</span>
                      <span className={`font-bold ${
                        volumeToMarketCapRatio > 10 ? 'text-green-400' : 
                        volumeToMarketCapRatio > 5 ? 'text-yellow-400' : 'text-red-400'
                      }`}>
                        {volumeToMarketCapRatio > 10 ? 'High' : 
                         volumeToMarketCapRatio > 5 ? 'Medium' : 'Low'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">All-Time High</span>
                      <div className="text-right">
                        <p className="font-bold text-white">{formatPrice(marketData.ath?.usd)}</p>
                        <p className="text-xs text-red-400">
                          {formatPercentage(marketData.ath_change_percentage?.usd)} from ATH
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-gray-700">
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                  <Zap className="w-5 h-5 mr-2 text-yellow-400" />
                  Buying Pressure Analysis
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-3 ${
                      volume24h > marketCap * 0.1 ? 'bg-green-500/20 text-green-400' : 
                      volume24h > marketCap * 0.05 ? 'bg-yellow-500/20 text-yellow-400' : 
                      'bg-red-500/20 text-red-400'
                    }`}>
                      <Activity className="w-8 h-8" />
                    </div>
                    <h4 className="font-semibold text-white mb-1">Volume Pressure</h4>
                    <p className={`text-sm ${
                      volume24h > marketCap * 0.1 ? 'text-green-400' : 
                      volume24h > marketCap * 0.05 ? 'text-yellow-400' : 'text-red-400'
                    }`}>
                      {volume24h > marketCap * 0.1 ? 'Strong' : 
                       volume24h > marketCap * 0.05 ? 'Moderate' : 'Weak'}
                    </p>
                  </div>
                  
                  <div className="text-center">
                    <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-3 ${
                      priceChange24h > 5 ? 'bg-green-500/20 text-green-400' : 
                      priceChange24h > 0 ? 'bg-yellow-500/20 text-yellow-400' : 
                      'bg-red-500/20 text-red-400'
                    }`}>
                      <TrendingUp className="w-8 h-8" />
                    </div>
                    <h4 className="font-semibold text-white mb-1">Price Action</h4>
                    <p className={`text-sm ${
                      priceChange24h > 5 ? 'text-green-400' : 
                      priceChange24h > 0 ? 'text-yellow-400' : 'text-red-400'
                    }`}>
                      {priceChange24h > 5 ? 'Bullish' : 
                       priceChange24h > 0 ? 'Neutral' : 'Bearish'}
                    </p>
                  </div>
                  
                  <div className="text-center">
                    <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-3 ${
                      marketData.market_cap_rank <= 50 ? 'bg-green-500/20 text-green-400' : 
                      marketData.market_cap_rank <= 200 ? 'bg-yellow-500/20 text-yellow-400' : 
                      'bg-red-500/20 text-red-400'
                    }`}>
                      <Users className="w-8 h-8" />
                    </div>
                    <h4 className="font-semibold text-white mb-1">Market Interest</h4>
                    <p className={`text-sm ${
                      marketData.market_cap_rank <= 50 ? 'text-green-400' : 
                      marketData.market_cap_rank <= 200 ? 'text-yellow-400' : 'text-red-400'
                    }`}>
                      {marketData.market_cap_rank <= 50 ? 'High' : 
                       marketData.market_cap_rank <= 200 ? 'Medium' : 'Low'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'sentiment' && (
            <div className="space-y-6">
              
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-gray-700 text-center">
                <div className="flex items-center justify-center mb-4">
                  <sentimentAnalysis.icon className={`w-12 h-12 ${sentimentAnalysis.color}`} />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Market Sentiment</h3>
                <p className={`text-3xl font-bold mb-4 ${sentimentAnalysis.color}`}>
                  {sentimentAnalysis.sentiment}
                </p>
                <p className="text-gray-400">
                  Sentiment Score: <span className="text-white font-bold">{sentimentAnalysis.score.toFixed(1)}</span>
                </p>
              </div>

              
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-gray-700">
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                  <AlertTriangle className="w-5 h-5 mr-2 text-yellow-400" />
                  Key Sentiment Factors
                </h3>
                <div className="space-y-3">
                  {sentimentAnalysis.factors.map((factor, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                      <span className="text-gray-300">{factor}</span>
                    </div>
                  ))}
                </div>
              </div>

              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-gray-700">
                  <h3 className="text-lg font-semibold text-white mb-4">Risk Assessment</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Volatility Risk</span>
                      <span className={`font-bold ${
                        Math.abs(priceChange24h) > 15 ? 'text-red-400' : 
                        Math.abs(priceChange24h) > 5 ? 'text-yellow-400' : 'text-green-400'
                      }`}>
                        {Math.abs(priceChange24h) > 15 ? 'High' : 
                         Math.abs(priceChange24h) > 5 ? 'Medium' : 'Low'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Liquidity Risk</span>
                      <span className={`font-bold ${
                        volumeToMarketCapRatio < 2 ? 'text-red-400' : 
                        volumeToMarketCapRatio < 5 ? 'text-yellow-400' : 'text-green-400'
                      }`}>
                        {volumeToMarketCapRatio < 2 ? 'High' : 
                         volumeToMarketCapRatio < 5 ? 'Medium' : 'Low'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Market Position</span>
                      <span className={`font-bold ${
                        marketData.market_cap_rank > 100 ? 'text-red-400' : 
                        marketData.market_cap_rank > 50 ? 'text-yellow-400' : 'text-green-400'
                      }`}>
                        {marketData.market_cap_rank > 100 ? 'High Risk' : 
                         marketData.market_cap_rank > 50 ? 'Medium Risk' : 'Established'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-gray-700">
                  <h3 className="text-lg font-semibold text-white mb-4">Investment Outlook</h3>
                  <div className="space-y-3 text-sm">
                    {sentimentAnalysis.score >= 2 && (
                      <div className="flex items-start space-x-2 text-green-400">
                        <ArrowUp className="w-4 h-4 mt-0.5" />
                        <span>Strong positive momentum indicates potential buying opportunity</span>
                      </div>
                    )}
                    {sentimentAnalysis.score >= 1 && sentimentAnalysis.score < 2 && (
                      <div className="flex items-start space-x-2 text-yellow-400">
                        <Activity className="w-4 h-4 mt-0.5" />
                        <span>Moderate positive signals, consider dollar-cost averaging</span>
                      </div>
                    )}
                    {sentimentAnalysis.score < 1 && sentimentAnalysis.score > -1 && (
                      <div className="flex items-start space-x-2 text-gray-400">
                        <Activity className="w-4 h-4 mt-0.5" />
                        <span>Mixed signals, wait for clearer trend direction</span>
                      </div>
                    )}
                    {sentimentAnalysis.score <= -1 && (
                      <div className="flex items-start space-x-2 text-red-400">
                        <ArrowDown className="w-4 h-4 mt-0.5" />
                        <span>Negative momentum, consider avoiding or waiting for better entry</span>
                      </div>
                    )}
                    <div className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                      <p className="text-xs text-yellow-300">
                        ⚠️ This analysis is for informational purposes only and not financial advice. 
                        Always do your own research before making investment decisions.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default DetailedCoinAnalysis
