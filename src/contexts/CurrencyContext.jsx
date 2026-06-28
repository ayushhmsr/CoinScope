import React, { createContext, useContext, useState, useEffect } from 'react';

const CurrencyContext = createContext();

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
};

export const CurrencyProvider = ({ children }) => {
  const [currency, setCurrency] = useState('usd');

  useEffect(() => {
    const savedCurrency = localStorage.getItem('selectedCurrency');
    if (savedCurrency && ['usd', 'inr', 'eur'].includes(savedCurrency)) {
      setCurrency(savedCurrency);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('selectedCurrency', currency);
  }, [currency]);

  const currencyConfig = {
    usd: {
      symbol: '$',
      code: 'USD',
      name: 'US Dollar',
      rate: 1
    },
    inr: {
      symbol: '₹',
      code: 'INR', 
      name: 'Indian Rupee',
      rate: 83.20
    },
    eur: {
      symbol: '€',
      code: 'EUR',
      name: 'Euro',
      rate: 0.85
    }
  };

  const convertPrice = (usdPrice, targetCurrency = currency) => {
    if (!usdPrice || isNaN(usdPrice)) return 0;
    return usdPrice * currencyConfig[targetCurrency].rate;
  };

  const formatPrice = (price, targetCurrency = currency) => {
    if (!price || isNaN(price)) return `${currencyConfig[targetCurrency].symbol}0.00`;
    
    const convertedPrice = convertPrice(price, targetCurrency);
    const { symbol } = currencyConfig[targetCurrency];
    
    if (targetCurrency === 'inr') {
      if (convertedPrice >= 10000000) {
        return `${symbol}${(convertedPrice / 10000000).toFixed(2)} Cr`;
      } else if (convertedPrice >= 100000) {
        return `${symbol}${(convertedPrice / 100000).toFixed(2)} L`;
      } else if (convertedPrice >= 1000) {
        return `${symbol}${(convertedPrice / 1000).toFixed(2)}K`;
      } else {
        return `${symbol}${convertedPrice.toFixed(2)}`;
      }
    } else if (convertedPrice < 0.01) {
      return `${symbol}${convertedPrice.toFixed(6)}`;
    } else if (convertedPrice < 1) {
      return `${symbol}${convertedPrice.toFixed(4)}`;
    } else {
      return `${symbol}${convertedPrice.toLocaleString('en-US', { 
        minimumFractionDigits: 2, 
        maximumFractionDigits: 2 
      })}`;
    }
  };

  const formatLargeNumber = (num, targetCurrency = currency) => {
    if (!num || isNaN(num)) return `${currencyConfig[targetCurrency].symbol}0`;
    
    const convertedNum = convertPrice(num, targetCurrency);
    const { symbol } = currencyConfig[targetCurrency];
    
    if (targetCurrency === 'inr') {
      if (convertedNum >= 1e15) {
        return `${symbol}${(convertedNum / 1e15).toFixed(2)} P Cr`;
      } else if (convertedNum >= 1e13) {
        return `${symbol}${(convertedNum / 1e13).toFixed(2)} T Cr`;
      } else if (convertedNum >= 1e11) {
        return `${symbol}${(convertedNum / 1e11).toFixed(2)} K Cr`;
      } else if (convertedNum >= 1e9) {
        return `${symbol}${(convertedNum / 1e9).toFixed(2)} H Cr`;
      } else if (convertedNum >= 1e7) {
        return `${symbol}${(convertedNum / 1e7).toFixed(2)} Cr`;
      } else if (convertedNum >= 1e5) {
        return `${symbol}${(convertedNum / 1e5).toFixed(2)} L`;
      } else if (convertedNum >= 1e3) {
        return `${symbol}${(convertedNum / 1e3).toFixed(2)}K`;
      } else {
        return `${symbol}${convertedNum.toFixed(2)}`;
      }
    } else {
      if (convertedNum >= 1e12) {
        return `${symbol}${(convertedNum / 1e12).toFixed(2)}T`;
      } else if (convertedNum >= 1e9) {
        return `${symbol}${(convertedNum / 1e9).toFixed(2)}B`;
      } else if (convertedNum >= 1e6) {
        return `${symbol}${(convertedNum / 1e6).toFixed(2)}M`;
      } else if (convertedNum >= 1e3) {
        return `${symbol}${(convertedNum / 1e3).toFixed(2)}K`;
      } else {
        return `${symbol}${convertedNum?.toFixed(2) || '0'}`;
      }
    }
  };

  const value = {
    currency,
    setCurrency,
    currencyConfig,
    convertPrice,
    formatPrice,
    formatLargeNumber,
    getCurrentCurrency: () => currencyConfig[currency]
  };

  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  );
};
