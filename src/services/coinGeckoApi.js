import axios from 'axios';

const BASE_URL = 'https://api.coingecko.com/api/v3';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
});

export const searchCoins = async (query) => {
  try {
    const response = await api.get(`/search?query=${encodeURIComponent(query)}`);
    return response.data.coins;
  } catch (error) {
    console.error('Error searching coins:', error);
    throw error;
  }
};

export const getTrendingCoins = async () => {
  try {
    const response = await api.get('/search/trending');
    return response.data.coins;
  } catch (error) {
    console.error('Error fetching trending coins:', error);
    throw error;
  }
};

export const getTopCoins = async (limit = 50, page = 1) => {
  try {
    console.log(`Fetching top ${limit} coins...`);
    const response = await api.get(`/coins/markets`, {
      params: {
        vs_currency: 'usd',
        order: 'market_cap_desc',
        per_page: limit,
        page: page,
        sparkline: true,
        price_change_percentage: '1h,24h,7d'
      }
    });
    console.log('Top coins response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching top coins:', error.response?.data || error.message);
    return [
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
    ].slice(0, limit);
  }
};

export const getCoinDetails = async (coinId) => {
  try {
    const response = await api.get(`/coins/${coinId}`, {
      params: {
        localization: false,
        tickers: false,
        market_data: true,
        community_data: true,
        developer_data: false,
        sparkline: true
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching coin details:', error);
    throw error;
  }
};

export const getCoinPriceHistory = async (coinId, days = 30) => {
  try {
    const response = await api.get(`/coins/${coinId}/market_chart`, {
      params: {
        vs_currency: 'usd',
        days: days,
        interval: days <= 1 ? 'hourly' : 'daily'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching price history:', error);
    throw error;
  }
};

export const getGlobalMarketData = async () => {
  try {
    console.log('Fetching global market data...');
    const response = await api.get('/global');
    console.log('Global market data response:', response.data);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching global market data:', error.response?.data || error.message);
    return {
      total_market_cap: { usd: 2500000000000 },
      total_volume: { usd: 95000000000 },
      market_cap_change_percentage_24h_usd: 2.5,
      active_cryptocurrencies: 10000,
      market_cap_percentage: { btc: 54.2, eth: 17.8 }
    };
  }
};

export const formatLargeNumber = (num) => {
  if (num >= 1e12) {
    return `$${(num / 1e12).toFixed(2)}T`;
  } else if (num >= 1e9) {
    return `$${(num / 1e9).toFixed(2)}B`;
  } else if (num >= 1e6) {
    return `$${(num / 1e6).toFixed(2)}M`;
  } else if (num >= 1e3) {
    return `$${(num / 1e3).toFixed(2)}K`;
  } else {
    return `$${num?.toFixed(2) || '0'}`;
  }
};

export const formatPercentage = (percentage) => {
  if (!percentage) return '0.00%';
  return `${percentage > 0 ? '+' : ''}${percentage.toFixed(2)}%`;
};

export const formatPrice = (price) => {
  if (!price) return '$0.00';
  if (price < 0.01) {
    return `$${price.toFixed(6)}`;
  } else if (price < 1) {
    return `$${price.toFixed(4)}`;
  } else {
    return `$${price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }
};

export default {
  searchCoins,
  getTrendingCoins,
  getTopCoins,
  getCoinDetails,
  getCoinPriceHistory,
  getGlobalMarketData,
  formatLargeNumber,
  formatPercentage,
  formatPrice
};
