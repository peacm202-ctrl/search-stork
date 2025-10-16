import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="text-center mb-10">
      <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-600">
        US Stock Screener
      </h1>
      <p className="mt-4 text-lg text-gray-300 max-w-2xl mx-auto">
        เครื่องมือค้นหาหุ้นสหรัฐฯ: คัดกรองหุ้นเติบโต, หุ้นปันผลปลอดภัย, และหุ้นซิ่งสำหรับเทรดรายวัน โดยใช้ Gemini API
      </p>
    </header>
  );
};

export default Header;