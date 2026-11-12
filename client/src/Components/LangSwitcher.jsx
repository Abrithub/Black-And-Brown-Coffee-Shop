import React from 'react';
import { useLang } from '../context/LangContext';

const LangSwitcher = ({ className = '' }) => {
  const { lang, switchLang } = useLang();

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      <button
        onClick={() => switchLang('en')}
        className={`px-2 py-1 rounded text-xs font-semibold transition ${
          lang === 'en'
            ? 'bg-[#C19976] text-black'
            : 'text-gray-400 hover:text-[#C19976]'
        }`}
        title="English"
      >
        EN
      </button>
      <button
        onClick={() => switchLang('am')}
        className={`px-2 py-1 rounded text-xs font-semibold transition ${
          lang === 'am'
            ? 'bg-[#C19976] text-black'
            : 'text-gray-400 hover:text-[#C19976]'
        }`}
        title="አማርኛ"
      >
        አማ
      </button>
    </div>
  );
};

export default LangSwitcher;
