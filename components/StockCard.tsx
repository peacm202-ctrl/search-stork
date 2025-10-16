import React from 'react';
import { Stock } from '../types';

interface StockCardProps {
  stock: Stock;
}

const StockCard: React.FC<StockCardProps> = ({ stock }) => {
  const getMetricColor = () => {
    if (stock.keyMetricLabel.includes('P/E')) return 'text-green-400';
    if (stock.keyMetricLabel.includes('Dividend')) return 'text-sky-400';
    return 'text-amber-400';
  };

  const metricColor = getMetricColor();

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 shadow-lg hover:shadow-indigo-500/20 hover:border-indigo-500 transition-all duration-300 flex flex-col h-full">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h2 className="text-2xl font-bold text-white">{stock.companyName}</h2>
          <p className="text-indigo-400 font-mono text-lg">{stock.ticker}</p>
        </div>
        <div className="text-right flex-shrink-0 ml-4">
          <span className="text-xs text-gray-400">{stock.keyMetricLabel}</span>
          <p className={`text-2xl font-bold ${metricColor}`}>{stock.keyMetricValue}</p>
        </div>
      </div>
      <div className="mt-2 flex-grow">
        <h3 className="text-md font-semibold text-gray-300 mb-2 border-b border-gray-600 pb-2">
          บทวิเคราะห์
        </h3>
        <p className="text-gray-400 text-sm leading-relaxed">
          {stock.analysis}
        </p>
      </div>
    </div>
  );
};

export default StockCard;