import React, { useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { getCoinPriceHistory } from '../services/coinGeckoApi';
import { useCurrency } from '../contexts/CurrencyContext';


ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const PriceChart = ({ coinId, coinName, currentPrice }) => {
  const { formatPrice } = useCurrency();
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('7');
  const [error, setError] = useState(null);

  const timeRanges = [
    { label: '1D', value: '1' },
    { label: '7D', value: '7' },
    { label: '30D', value: '30' },
    { label: '90D', value: '90' },
    { label: '1Y', value: '365' }
  ];

  useEffect(() => {
    if (!coinId) return;
    
    const fetchChartData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const data = await getCoinPriceHistory(coinId, parseInt(timeRange));
        
        
        const prices = data.prices.map(price => ({
          x: new Date(price[0]),
          y: price[1]
        }));

        const chartConfig = {
          labels: prices.map(price => price.x.toLocaleDateString()),
          datasets: [
            {
              label: `${coinName} Price`,
              data: prices.map(price => price.y),
              fill: true,
              backgroundColor: (context) => {
                const chart = context.chart;
                const { ctx, chartArea } = chart;
                if (!chartArea) return null;
                
                const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
                gradient.addColorStop(0, 'rgba(234, 179, 8, 0.3)');
                gradient.addColorStop(1, 'rgba(234, 179, 8, 0.05)');
                return gradient;
              },
              borderColor: 'rgb(234, 179, 8)',
              borderWidth: 2,
              pointRadius: 0,
              pointHoverRadius: 6,
              pointHoverBackgroundColor: 'rgb(234, 179, 8)',
              pointHoverBorderColor: 'white',
              pointHoverBorderWidth: 2,
              tension: 0.4
            }
          ]
        };

        setChartData(chartConfig);
      } catch (err) {
        console.error('Chart data error:', err);
        
        const fallbackDays = parseInt(timeRange);
        const basePrice = currentPrice || 50000;
        
        
        const generateRealisticPrices = (days, startPrice) => {
          const prices = [];
          let currentPrice = startPrice;
          const volatility = 0.03; 
          
          for (let i = 0; i < days; i++) {
            const date = new Date();
            
            if (days <= 1) {
              
              date.setHours(date.getHours() - (24 - i));
              const hourlyVolatility = volatility / 4; 
              const change = (Math.random() - 0.5) * 2 * hourlyVolatility;
              currentPrice *= (1 + change);
            } else {
              
              date.setDate(date.getDate() - (days - i - 1));
              
              
              let trendFactor = 0;
              if (days >= 365) {
                
                trendFactor = (i / days) * 0.001; 
              } else if (days >= 90) {
                
                trendFactor = Math.sin(i / days * Math.PI) * 0.0005;
              }
              
              const randomChange = (Math.random() - 0.5) * 2 * volatility;
              currentPrice *= (1 + randomChange + trendFactor);
            }
            
            
            currentPrice = Math.max(currentPrice, startPrice * 0.3);
            currentPrice = Math.min(currentPrice, startPrice * 3);
            
            prices.push({ x: new Date(date), y: currentPrice });
          }
          
          return prices;
        };
        
        const fallbackPrices = generateRealisticPrices(fallbackDays, basePrice);

        const chartConfig = {
          labels: fallbackPrices.map(price => {
            if (fallbackDays <= 1) {
              return price.x.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            } else if (fallbackDays <= 7) {
              return price.x.toLocaleDateString([], { weekday: 'short', day: 'numeric' });
            } else if (fallbackDays <= 30) {
              return price.x.toLocaleDateString([], { month: 'short', day: 'numeric' });
            } else {
              return price.x.toLocaleDateString([], { month: 'short', year: '2-digit' });
            }
          }),
          datasets: [
            {
              label: `${coinName} Price (Demo)`,
              data: fallbackPrices.map(price => price.y),
              fill: true,
              backgroundColor: (context) => {
                const chart = context.chart;
                const { ctx, chartArea } = chart;
                if (!chartArea) return null;
                
                const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
                gradient.addColorStop(0, 'rgba(234, 179, 8, 0.3)');
                gradient.addColorStop(1, 'rgba(234, 179, 8, 0.05)');
                return gradient;
              },
              borderColor: 'rgb(234, 179, 8)',
              borderWidth: 2,
              pointRadius: 0,
              pointHoverRadius: 6,
              pointHoverBackgroundColor: 'rgb(234, 179, 8)',
              pointHoverBorderColor: 'white',
              pointHoverBorderWidth: 2,
              tension: 0.4
            }
          ]
        };
        
        setChartData(chartConfig);
      } finally {
        setLoading(false);
      }
    };

    fetchChartData();
  }, [coinId, timeRange, coinName, currentPrice]);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: 'white',
        bodyColor: 'white',
        borderColor: 'rgba(59, 130, 246, 0.3)',
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: false,
        callbacks: {
          label: function(context) {
            return `Price: ${formatPrice(context.parsed.y)}`;
          }
        }
      },
    },
    interaction: {
      mode: 'nearest',
      axis: 'x',
      intersect: false,
    },
    scales: {
      x: {
        display: true,
        grid: {
          display: false,
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.6)',
          maxTicksLimit: 7
        }
      },
      y: {
        display: true,
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.6)',
          callback: function(value) {
            return formatPrice(value);
          }
        }
      },
    },
    elements: {
      point: {
        radius: 0,
      },
    },
  };


  return (
    <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-gray-700">
      
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6">
        <div className="mb-4 sm:mb-0">
          <h3 className="text-lg sm:text-xl font-semibold text-white mb-2">Price Chart</h3>
          <p className="text-xl sm:text-2xl font-bold text-yellow-500 break-words">
            {formatPrice(currentPrice)}
          </p>
        </div>
        
        <div className="flex flex-wrap gap-2 justify-center sm:justify-end">
          {timeRanges.map((range) => (
            <button
              key={range.value}
              onClick={() => setTimeRange(range.value)}
              className={`px-2 sm:px-3 py-1 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                timeRange === range.value
                  ? 'bg-yellow-500 text-black'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              {range.label}
            </button>
          ))}
        </div>
      </div>

      <div className="relative h-48 sm:h-64 lg:h-80">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="flex space-x-2">
              <div className="w-3 h-3 bg-yellow-500 rounded-full animate-bounce"></div>
              <div className="w-3 h-3 bg-yellow-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
              <div className="w-3 h-3 bg-yellow-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
            </div>
          </div>
        ) : chartData ? (
          <Line data={chartData} options={chartOptions} />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400">
            <p className="text-sm sm:text-base">No chart data available</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PriceChart;
