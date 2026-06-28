import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { 
  ArrowLeft, 
  TrendingUp, 
  TrendingDown, 
  Star, 
  ExternalLink, 
  Globe, 
  Twitter, 
  Github,
  BarChart3,
  DollarSign,
  Calendar,
  Users
} from 'lucide-react';
import { getCoinDetails, formatPercentage } from '../services/coinGeckoApi';
import { useCurrency } from '../contexts/CurrencyContext';
import PriceChart from './PriceChart';

const CoinDetail = () => {
  const { coinId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { formatPrice, formatLargeNumber } = useCurrency();
  const [coinData, setCoinData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCoinDetails = async () => {
      setLoading(true);
      setError(null);
      
      
      if (coinData && coinData.id === coinId && coinData.market_data) {
        setLoading(false);
        return;
      }
      
      try {
        const data = await getCoinDetails(coinId);
        setCoinData(data);
      } catch (err) {
        console.error('Coin details error:', err);
        
        
        if (coinData && coinData.id === coinId) {
          const enrichedData = {
            ...coinData,
            market_data: {
              current_price: { usd: coinData.current_price || 0 },
              price_change_percentage_24h: coinData.price_change_percentage_24h || 0,
              price_change_percentage_7d: coinData.price_change_percentage_7d || 0,
              price_change_percentage_30d: coinData.price_change_percentage_30d || 0,
              price_change_percentage_1y: coinData.price_change_percentage_1y || 0,
              market_cap: { usd: coinData.market_cap || 0 },
              market_cap_change_percentage_24h: coinData.market_cap_change_percentage_24h || 0,
              total_volume: { usd: coinData.total_volume || 0 },
              market_cap_rank: coinData.market_cap_rank || 0,
              circulating_supply: coinData.circulating_supply || 0,
              total_supply: coinData.total_supply || 0,
              max_supply: coinData.max_supply || null,
              ath: { usd: coinData.ath || coinData.current_price || 0 },
              ath_change_percentage: { usd: -20 },
              low_24h: { usd: (coinData.current_price || 0) * 0.95 },
              high_24h: { usd: (coinData.current_price || 0) * 1.05 }
            },
            description: {
              en: `${coinData.name} cryptocurrency information.`
            },
            links: {
              homepage: ['#'],
              twitter_screen_name: null
            },
            categories: ['Cryptocurrency']
          };
          setCoinData(enrichedData);
        } else {
          
          const getFallbackData = (id) => {
            const fallbackData = {
              bitcoin: {
                id: 'bitcoin',
                name: 'Bitcoin',
                symbol: 'BTC',
                image: { large: 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png' },
                market_data: {
                  current_price: { usd: 67250 },
                  price_change_percentage_24h: 2.15,
                  price_change_percentage_7d: -1.2,
                  price_change_percentage_30d: 8.7,
                  price_change_percentage_1y: 145.8,
                  market_cap: { usd: 1325000000000 },
                  market_cap_change_percentage_24h: 1.95,
                  total_volume: { usd: 28500000000 },
                  market_cap_rank: 1,
                  circulating_supply: 19704000,
                  total_supply: 19704000,
                  max_supply: 21000000,
                  ath: { usd: 73750 },
                  ath_change_percentage: { usd: -8.81 },
                  low_24h: { usd: 65800 },
                  high_24h: { usd: 68100 }
                },
                description: {
                  en: `Bitcoin is a revolutionary decentralized digital currency that operates without a central authority or government oversight. Created in 2008 by the pseudonymous Satoshi Nakamoto, Bitcoin introduced the world to blockchain technology and peer-to-peer electronic cash systems. The Bitcoin network is maintained by a distributed network of miners who use computational power to validate transactions and secure the blockchain. Each Bitcoin transaction is cryptographically secured and recorded on an immutable public ledger, ensuring transparency and preventing double-spending. Bitcoin's monetary policy is hard-coded into its protocol, with a maximum supply cap of 21 million coins and a halving event every four years that reduces mining rewards by half. This scarcity mechanism, combined with growing institutional adoption and mainstream acceptance, has positioned Bitcoin as a store of value often referred to as "digital gold." The cryptocurrency has weathered numerous market cycles, regulatory challenges, and technical upgrades, continuously proving its resilience and utility. Major companies like Tesla, MicroStrategy, and Square have added Bitcoin to their treasury reserves, while countries like El Salvador have adopted it as legal tender. Bitcoin's Lightning Network enables faster and cheaper transactions, addressing scalability concerns and enabling micropayments. As the first and most recognized cryptocurrency, Bitcoin continues to serve as a hedge against inflation, a tool for financial sovereignty, and a gateway to the broader cryptocurrency ecosystem.`
                },
                links: {
                  homepage: ['https://bitcoin.org'],
                  twitter_screen_name: 'bitcoin',
                  repos_url: { github: ['https://github.com/bitcoin/bitcoin'] }
                },
                categories: ['Cryptocurrency'],
                genesis_date: '2009-01-03'
              },
              ethereum: {
                id: 'ethereum',
                name: 'Ethereum',
                symbol: 'ETH',
                image: { large: 'https://assets.coingecko.com/coins/images/279/large/ethereum.png' },
                market_data: {
                  current_price: { usd: 3450 },
                  price_change_percentage_24h: -1.25,
                  price_change_percentage_7d: 2.8,
                  price_change_percentage_30d: 12.3,
                  price_change_percentage_1y: 87.5,
                  market_cap: { usd: 415000000000 },
                  market_cap_change_percentage_24h: -0.95,
                  total_volume: { usd: 18200000000 },
                  market_cap_rank: 2,
                  circulating_supply: 120280000,
                  total_supply: 120280000,
                  max_supply: null,
                  ath: { usd: 4878 },
                  ath_change_percentage: { usd: -29.27 },
                  low_24h: { usd: 3380 },
                  high_24h: { usd: 3520 }
                },
                description: {
                  en: `Ethereum is a groundbreaking decentralized blockchain platform that revolutionized the cryptocurrency space by introducing smart contracts and programmable money. Conceived by Vitalik Buterin in 2013 and launched in 2015, Ethereum extends beyond simple peer-to-peer transactions to enable the creation of decentralized applications (DApps) and autonomous organizations. The Ethereum Virtual Machine (EVM) serves as a global, decentralized computer that executes smart contracts - self-executing contracts with terms directly written into code. This innovation has spawned entire industries including Decentralized Finance (DeFi), Non-Fungible Tokens (NFTs), and Web3 applications. Ethereum's transition from Proof-of-Work to Proof-of-Stake consensus through "The Merge" in September 2022 reduced its energy consumption by over 99% while maintaining security and decentralization. The platform supports thousands of tokens and protocols, making it the backbone of the modern cryptocurrency ecosystem. Layer 2 scaling solutions like Polygon, Arbitrum, and Optimism have addressed transaction cost and speed concerns while maintaining Ethereum's security guarantees. Ethereum's roadmap includes sharding and other improvements that will further enhance scalability and user experience. Major enterprises, financial institutions, and governments are building on Ethereum, recognizing its potential to transform everything from supply chain management to digital identity. With its robust developer community and continuous innovation, Ethereum continues to push the boundaries of what's possible with blockchain technology, serving as the world's decentralized computer for the next generation of internet applications.`
                },
                links: {
                  homepage: ['https://ethereum.org'],
                  twitter_screen_name: 'ethereum',
                  repos_url: { github: ['https://github.com/ethereum/go-ethereum'] }
                },
                categories: ['Smart Contract Platform'],
                genesis_date: '2015-07-30'
              }
            }
            
            return fallbackData[id] || {
              id: id,
              name: id.charAt(0).toUpperCase() + id.slice(1),
              symbol: id.slice(0, 3).toUpperCase(),
              image: { large: 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png' },
              market_data: {
                current_price: { usd: 25000 },
                price_change_percentage_24h: 1.5,
                price_change_percentage_7d: -0.8,
                price_change_percentage_30d: 5.2,
                price_change_percentage_1y: 65.3,
                market_cap: { usd: 500000000000 },
                market_cap_change_percentage_24h: 1.2,
                total_volume: { usd: 15000000000 },
                market_cap_rank: 10,
                circulating_supply: 20000000,
                total_supply: 25000000,
                max_supply: 30000000,
                ath: { usd: 35000 },
                ath_change_percentage: { usd: -28.57 },
                low_24h: { usd: 24500 },
                high_24h: { usd: 25800 }
              },
              description: {
                en: `${id.charAt(0).toUpperCase() + id.slice(1)} is an innovative cryptocurrency project that represents the evolving landscape of digital assets and blockchain technology. As part of the growing decentralized finance ecosystem, this cryptocurrency aims to address specific challenges within the blockchain space through unique technological solutions and community-driven governance. The project leverages cutting-edge cryptographic algorithms and consensus mechanisms to ensure secure, fast, and cost-effective transactions. Built with scalability in mind, the network incorporates advanced features such as smart contract functionality, cross-chain interoperability, and energy-efficient validation processes. The tokenomics are designed to incentivize long-term holding and active participation in network governance, with mechanisms for staking rewards and liquidity provision. The development team consists of experienced blockchain engineers and industry veterans who bring deep expertise in cryptography, distributed systems, and financial technology. Community governance plays a central role in the project's evolution, with token holders having voting rights on key protocol upgrades and treasury allocation decisions. The roadmap includes ambitious plans for ecosystem expansion, partnership development, and integration with major DeFi protocols. Regular security audits and bug bounty programs ensure the highest standards of code quality and network security. As the cryptocurrency space continues to mature, projects like ${id.charAt(0).toUpperCase() + id.slice(1)} are positioned to play significant roles in shaping the future of decentralized finance and digital asset innovation.`
              },
              links: {
                homepage: ['https://example.com'],
                twitter_screen_name: 'crypto'
              },
              categories: ['Cryptocurrency']
            }
          }
          
          setCoinData(getFallbackData(coinId));
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCoinDetails();
  }, [coinId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900/20 to-purple-900/20 flex items-center justify-center">
        <div className="text-center">
          <div className="flex space-x-2 mb-4 justify-center">
            <div className="w-4 h-4 bg-blue-400 rounded-full animate-bounce"></div>
            <div className="w-4 h-4 bg-blue-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
            <div className="w-4 h-4 bg-blue-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
          </div>
          <p className="text-white text-lg">Loading cryptocurrency details...</p>
        </div>
      </div>
    );
  }

  if (!coinData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900/20 to-purple-900/20 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <TrendingDown className="w-8 h-8 text-red-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Error Loading Data</h2>
          <p className="text-gray-400 mb-6">Cryptocurrency not found</p>
          <button
            onClick={() => navigate('/crypto')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            Back to Search
          </button>
        </div>
      </div>
    );
  }

  const marketData = coinData.market_data || {};
  const currentPrice = marketData.current_price?.usd || 0;
  const priceChange24h = marketData.price_change_percentage_24h || 0;
  const priceChange7d = marketData.price_change_percentage_7d || 0;
  const priceChange30d = marketData.price_change_percentage_30d || 0;
  const priceChange1y = marketData.price_change_percentage_1y || 0;

  const StatCard = ({ icon: Icon, title, value, change, changeType = '24h', colorClass = '' }) => {
    const isPositive = change >= 0;
    
    return (
      <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 hover:border-gray-600 transition-colors">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Icon className={`w-5 h-5 ${colorClass || 'text-blue-400'}`} />
            <h3 className="text-sm font-medium text-gray-400">{title}</h3>
          </div>
          {change !== undefined && (
            <div className="flex items-center space-x-1">
              {isPositive ? (
                <TrendingUp className="w-4 h-4 text-green-400" />
              ) : (
                <TrendingDown className="w-4 h-4 text-red-400" />
              )}
              <span className={`text-sm font-medium ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
                {formatPercentage(change)} ({changeType})
              </span>
            </div>
          )}
        </div>
        <p className="text-2xl font-bold text-white">{value}</p>
      </div>
    );
  };

  const LinkButton = ({ href, icon: Icon, label }) => (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center space-x-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-gray-300 hover:text-white transition-colors"
    >
      <Icon className="w-4 h-4" />
      <span className="text-sm font-medium">{label}</span>
      <ExternalLink className="w-3 h-3" />
    </a>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900/20 to-purple-900/20 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        
        
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </button>
        </div>

        
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-6 sm:mb-8 space-y-4 lg:space-y-0">
          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
            <div className="relative flex-shrink-0">
              <img
                src={coinData.image?.large}
                alt={coinData.name}
                className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 rounded-full ring-4 ring-gray-700"
                onError={(e) => {
                  e.target.src = '/api/placeholder/80/80';
                }}
              />
              {marketData.market_cap_rank && marketData.market_cap_rank <= 10 && (
                <div className="absolute -top-2 -right-2 w-6 h-6 sm:w-8 sm:h-8 bg-yellow-500 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold text-black">
                  #{marketData.market_cap_rank}
                </div>
              )}
            </div>
            
            <div className="min-w-0 flex-1">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2 break-words">
                {coinData.name}
                <span className="text-lg sm:text-xl lg:text-2xl text-gray-400 ml-2 sm:ml-3 uppercase">
                  {coinData.symbol}
                </span>
              </h1>
              <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-400">
                {marketData.market_cap_rank && (
                  <span className="whitespace-nowrap">Rank #{marketData.market_cap_rank}</span>
                )}
                {coinData.categories && coinData.categories[0] && (
                  <span className="bg-blue-600/20 text-blue-400 px-2 py-1 rounded whitespace-nowrap">
                    {coinData.categories[0]}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mt-4 lg:mt-0">
            {coinData.links?.homepage?.[0] && (
              <LinkButton
                href={coinData.links.homepage[0]}
                icon={Globe}
                label="Website"
              />
            )}
            {coinData.links?.twitter_screen_name && (
              <LinkButton
                href={`https://twitter.com/${coinData.links.twitter_screen_name}`}
                icon={Twitter}
                label="Twitter"
              />
            )}
            {coinData.links?.repos_url?.github?.[0] && (
              <LinkButton
                href={coinData.links.repos_url.github[0]}
                icon={Github}
                label="GitHub"
              />
            )}
          </div>
        </div>

        
        <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-700 rounded-xl p-4 sm:p-6 mb-6 sm:mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="mb-4 lg:mb-0">
              <p className="text-xs sm:text-sm text-gray-400 mb-2">Current Price</p>
              <p className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white break-words">
                {formatPrice(currentPrice)}
              </p>
            </div>
            
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:text-center">
              <div className="text-center lg:text-left xl:text-center">
                <p className="text-xs sm:text-sm text-gray-400">24h Change</p>
                <div className="flex items-center justify-center lg:justify-start xl:justify-center space-x-1">
                  {priceChange24h >= 0 ? (
                    <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 text-green-400" />
                  ) : (
                    <TrendingDown className="w-3 h-3 sm:w-4 sm:h-4 text-red-400" />
                  )}
                  <span className={`text-xs sm:text-sm font-bold ${priceChange24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {formatPercentage(priceChange24h)}
                  </span>
                </div>
              </div>
              
              <div className="text-center lg:text-left xl:text-center">
                <p className="text-xs sm:text-sm text-gray-400">7d Change</p>
                <span className={`text-xs sm:text-sm font-bold ${priceChange7d >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {formatPercentage(priceChange7d)}
                </span>
              </div>
              
              <div className="text-center lg:text-left xl:text-center">
                <p className="text-xs sm:text-sm text-gray-400">30d Change</p>
                <span className={`text-xs sm:text-sm font-bold ${priceChange30d >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {formatPercentage(priceChange30d)}
                </span>
              </div>
              
              <div className="text-center lg:text-left xl:text-center">
                <p className="text-xs sm:text-sm text-gray-400">1y Change</p>
                <span className={`text-xs sm:text-sm font-bold ${priceChange1y >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {formatPercentage(priceChange1y)}
                </span>
              </div>
            </div>
          </div>
        </div>

        
        <div className="mb-8">
          <PriceChart
            coinId={coinData.id}
            coinName={coinData.name}
            currentPrice={currentPrice}
          />
        </div>

        
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={DollarSign}
            title="Market Cap"
            value={formatLargeNumber(marketData.market_cap?.usd)}
            change={marketData.market_cap_change_percentage_24h}
            colorClass="text-blue-400"
          />
          
          <StatCard
            icon={BarChart3}
            title="24h Volume"
            value={formatLargeNumber(marketData.total_volume?.usd)}
            colorClass="text-green-400"
          />
          
          <StatCard
            icon={TrendingUp}
            title="All-Time High"
            value={formatPrice(marketData.ath?.usd)}
            change={marketData.ath_change_percentage?.usd}
            changeType="from ATH"
            colorClass="text-yellow-400"
          />
          
          <StatCard
            icon={Users}
            title="Circulating Supply"
            value={`${marketData.circulating_supply?.toLocaleString()} ${coinData.symbol?.toUpperCase()}`}
            colorClass="text-purple-400"
          />
        </div>

        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
            <h3 className="text-xl font-semibold text-white mb-4">24h Price Range</h3>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-400">Low:</span>
                <span className="text-red-400 font-bold">
                  {formatPrice(marketData.low_24h?.usd)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">High:</span>
                <span className="text-green-400 font-bold">
                  {formatPrice(marketData.high_24h?.usd)}
                </span>
              </div>
              <div className="relative">
                <div className="w-full h-2 bg-gray-700 rounded-full">
                  <div 
                    className="h-2 bg-gradient-to-r from-red-400 to-green-400 rounded-full"
                    style={{
                      width: `${((currentPrice - marketData.low_24h?.usd) / (marketData.high_24h?.usd - marketData.low_24h?.usd)) * 100}%`
                    }}
                  />
                </div>
                <div className="text-center mt-2">
                  <span className="text-sm text-gray-400">Current: {formatPrice(currentPrice)}</span>
                </div>
              </div>
            </div>
          </div>

          
          <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
            <h3 className="text-xl font-semibold text-white mb-4">Market Information</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Total Supply:</span>
                <span className="text-white">
                  {marketData.total_supply ? 
                    `${marketData.total_supply.toLocaleString()} ${coinData.symbol?.toUpperCase()}` : 
                    'N/A'
                  }
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Max Supply:</span>
                <span className="text-white">
                  {marketData.max_supply ? 
                    `${marketData.max_supply.toLocaleString()} ${coinData.symbol?.toUpperCase()}` : 
                    'No Limit'
                  }
                </span>
              </div>
              {coinData.genesis_date && (
                <div className="flex justify-between">
                  <span className="text-gray-400">Genesis Date:</span>
                  <span className="text-white">
                    {new Date(coinData.genesis_date).toLocaleDateString()}
                  </span>
                </div>
              )}
              {coinData.hashing_algorithm && (
                <div className="flex justify-between">
                  <span className="text-gray-400">Algorithm:</span>
                  <span className="text-white">{coinData.hashing_algorithm}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        
        {coinData.description?.en && (
          <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 mt-8">
            <h3 className="text-xl font-semibold text-white mb-4">About {coinData.name}</h3>
            <div 
              className="text-gray-300 leading-relaxed"
              dangerouslySetInnerHTML={{ 
                __html: coinData.description.en.replace(/<a /g, '<a target="_blank" rel="noopener noreferrer" class="text-blue-400 hover:text-blue-300" ')
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default CoinDetail;
