import React, { useState, useCallback } from 'react';
import { Stock } from './types';
import { fetchGrowthStocks, fetchDayTradingStocks, fetchDividendStocks } from './services/geminiService';
import Header from './components/Header';
import StockCard from './components/StockCard';
import LoadingSpinner from './components/LoadingSpinner';

type SearchType = 'growth' | 'daytrade' | 'dividend';

const App: React.FC = () => {
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [resultsTitle, setResultsTitle] = useState<string>('');

  const handleFetchStocks = useCallback(async (type: SearchType) => {
    setIsLoading(true);
    setError(null);
    setStocks([]);

    const fetcherMap = {
        growth: fetchGrowthStocks,
        daytrade: fetchDayTradingStocks,
        dividend: fetchDividendStocks,
    };

    const titleMap = {
        growth: 'หุ้นเติบโต (Growth Stocks)',
        daytrade: 'หุ้นซิ่ง (Day Trading Stocks)',
        dividend: 'หุ้นปันผลปลอดภัย (Safe Dividend Stocks)',
    };

    setResultsTitle(titleMap[type]);
    
    try {
      const fetchFunction = fetcherMap[type];
      const data = await fetchFunction();
      setStocks(data);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(`Failed to fetch stock data: ${err.message}. Please check your API key and try again.`);
      } else {
        setError("An unknown error occurred.");
      }
      setResultsTitle('');
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans">
      <div className="container mx-auto px-4 py-8">
        <Header />
        
        <div className="text-center my-8 flex flex-col sm:flex-row justify-center items-center flex-wrap gap-4">
          <button
            onClick={() => handleFetchStocks('growth')}
            disabled={isLoading}
            className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 disabled:cursor-not-allowed text-white font-bold py-3 px-8 rounded-full text-lg transition-transform transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-indigo-500 shadow-lg"
          >
            {isLoading ? 'กำลังค้นหา...' : 'ค้นหาหุ้นเติบโต'}
          </button>
          <button
            onClick={() => handleFetchStocks('daytrade')}
            disabled={isLoading}
            className="w-full sm:w-auto bg-rose-600 hover:bg-rose-700 disabled:bg-rose-400 disabled:cursor-not-allowed text-white font-bold py-3 px-8 rounded-full text-lg transition-transform transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-rose-500 shadow-lg"
          >
            {isLoading ? 'กำลังค้นหา...' : 'ค้นหาหุ้นซิ่ง (Day Trade)'}
          </button>
          <button
            onClick={() => handleFetchStocks('dividend')}
            disabled={isLoading}
            className="w-full sm:w-auto bg-sky-600 hover:bg-sky-700 disabled:bg-sky-400 disabled:cursor-not-allowed text-white font-bold py-3 px-8 rounded-full text-lg transition-transform transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-sky-500 shadow-lg"
          >
            {isLoading ? 'กำลังค้นหา...' : 'ค้นหาหุ้นปันผล'}
          </button>
        </div>

        <div className="mt-10">
          {isLoading && <LoadingSpinner />}
          {error && <div className="text-center text-red-400 bg-red-900/50 p-4 rounded-lg">{error}</div>}
          
          {!isLoading && !error && stocks.length === 0 && (
            <div className="text-center text-gray-400">
              <p>เลือกประเภทหุ้นที่ต้องการค้นหาด้านบน</p>
            </div>
          )}

          {stocks.length > 0 && (
            <>
              <h2 className="text-2xl font-bold text-center mb-6">{resultsTitle}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {stocks.map((stock, index) => (
                  <StockCard key={`${stock.ticker}-${index}`} stock={stock} />
                ))}
              </div>
            </>
          )}
        </div>
        
        <footer className="text-center text-gray-500 mt-12 text-sm">
           <p className="font-bold text-amber-500">ข้อจำกัดความรับผิดชอบ (Disclaimer):</p>
           <p>ข้อมูลนี้สร้างขึ้นโดย AI และเพื่อวัตถุประสงค์ในการให้ข้อมูลเท่านั้น ไม่ใช่คำแนะนำทางการเงิน การลงทุนมีความเสี่ยง ผู้ลงทุนควรศึกษาข้อมูลก่อนการตัดสินใจลงทุน</p>
        </footer>
      </div>
    </div>
  );
};

export default App;