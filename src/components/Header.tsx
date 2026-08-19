import React from 'react';
import { 
  GraduationCap, 
  Moon, 
  Sun, 
  Calculator, 
  Compass, 
  Target, 
  ListOrdered,
  Sparkles
} from 'lucide-react';
import { ScoreType } from '../types';

interface HeaderProps {
  activeTab: 'explorer' | 'calculator' | 'direct' | 'preferences';
  setActiveTab: (tab: 'explorer' | 'calculator' | 'direct' | 'preferences') => void;
  isDark: boolean;
  setIsDark: (dark: boolean) => void;
  preferenceCount: number;
  userRank: number;
  activeScoreType: ScoreType;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  isDark,
  setIsDark,
  preferenceCount,
  userRank,
  activeScoreType,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-white/80 dark:bg-slate-900/80 border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Logo & Başlık */}
          <div 
            className="flex items-center space-x-3 cursor-pointer group"
            onClick={() => setActiveTab('explorer')}
          >
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-tr from-brand-600 to-orange-400 flex items-center justify-center text-white shadow-lg shadow-orange-500/20 group-hover:scale-105 transition-transform">
              <GraduationCap className="w-6 h-6 sm:w-7 sm:h-7" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-lg sm:text-xl tracking-tight bg-gradient-to-r from-slate-900 via-brand-700 to-orange-500 dark:from-white dark:via-orange-300 dark:to-brand-400 bg-clip-text text-transparent">
                  YKS Tercih Robotu
                </span>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-brand-100 text-brand-700 dark:bg-brand-950/60 dark:text-brand-300 border border-brand-200 dark:border-brand-800">
                  <Sparkles className="w-3 h-3 mr-1 text-brand-500" />
                  5 Yıllık Trend AI
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block">
                Net/Sıralama Hesaplama & Yerleşme İhtimali Analizi
              </p>
            </div>
          </div>

          {/* Navigasyon Sekmeleri */}
          <nav className="hidden md:flex items-center space-x-1 bg-slate-100 dark:bg-slate-800/80 p-1.5 rounded-xl border border-slate-200 dark:border-slate-700/60">
            <button
              onClick={() => setActiveTab('explorer')}
              className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'explorer'
                  ? 'bg-white dark:bg-slate-900 text-brand-600 dark:text-brand-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Compass className="w-4 h-4" />
              <span>Bölüm Keşfet</span>
            </button>

            <button
              onClick={() => setActiveTab('calculator')}
              className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'calculator'
                  ? 'bg-white dark:bg-slate-900 text-brand-600 dark:text-brand-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Calculator className="w-4 h-4" />
              <span>Net Hesapla</span>
            </button>

            <button
              onClick={() => setActiveTab('direct')}
              className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'direct'
                  ? 'bg-white dark:bg-slate-900 text-brand-600 dark:text-brand-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Target className="w-4 h-4" />
              <span>Hızlı Sıralama Gir</span>
            </button>

            <button
              onClick={() => setActiveTab('preferences')}
              className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-sm font-medium relative transition-all ${
                activeTab === 'preferences'
                  ? 'bg-white dark:bg-slate-900 text-brand-600 dark:text-brand-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <ListOrdered className="w-4 h-4" />
              <span>Tercih Listem</span>
              {preferenceCount > 0 && (
                <span className="ml-1.5 px-1.5 py-0.5 text-xs font-bold rounded-full bg-brand-600 text-white animate-pulse">
                  {preferenceCount}
                </span>
              )}
            </button>
          </nav>

          {/* Sağ Alan: Sıralama Özeti & Tema Butonu */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {userRank > 0 && (
              <div 
                onClick={() => setActiveTab('direct')}
                className="hidden lg:flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-orange-50 dark:bg-orange-950/40 border border-orange-200 dark:border-orange-800/60 cursor-pointer hover:border-brand-500 transition-colors"
                title="Sıralamanızı değiştirmek için tıklayın"
              >
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  {activeScoreType}:
                </span>
                <span className="text-xs font-bold text-brand-700 dark:text-brand-300">
                  {userRank.toLocaleString('tr-TR')}.
                </span>
              </div>
            )}

            {/* Tema Değiştirici */}
            <button
              onClick={() => setIsDark(!isDark)}
              className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              aria-label="Karanlık/Aydınlık Modu Değiştir"
            >
              {isDark ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-slate-600" />}
            </button>
          </div>

        </div>

        {/* Mobil Alt Navigasyon Barı */}
        <div className="flex md:hidden items-center justify-around py-2 border-t border-slate-100 dark:border-slate-800 text-xs">
          <button
            onClick={() => setActiveTab('explorer')}
            className={`flex flex-col items-center py-1 px-2 rounded-lg ${
              activeTab === 'explorer' ? 'text-brand-600 dark:text-brand-400 font-bold' : 'text-slate-500 dark:text-slate-400'
            }`}
          >
            <Compass className="w-4 h-4 mb-0.5" />
            <span>Keşfet</span>
          </button>
          <button
            onClick={() => setActiveTab('calculator')}
            className={`flex flex-col items-center py-1 px-2 rounded-lg ${
              activeTab === 'calculator' ? 'text-brand-600 dark:text-brand-400 font-bold' : 'text-slate-500 dark:text-slate-400'
            }`}
          >
            <Calculator className="w-4 h-4 mb-0.5" />
            <span>Net Hesapla</span>
          </button>
          <button
            onClick={() => setActiveTab('direct')}
            className={`flex flex-col items-center py-1 px-2 rounded-lg ${
              activeTab === 'direct' ? 'text-brand-600 dark:text-brand-400 font-bold' : 'text-slate-500 dark:text-slate-400'
            }`}
          >
            <Target className="w-4 h-4 mb-0.5" />
            <span>Sıralama</span>
          </button>
          <button
            onClick={() => setActiveTab('preferences')}
            className={`flex flex-col items-center py-1 px-2 rounded-lg relative ${
              activeTab === 'preferences' ? 'text-brand-600 dark:text-brand-400 font-bold' : 'text-slate-500 dark:text-slate-400'
            }`}
          >
            <ListOrdered className="w-4 h-4 mb-0.5" />
            <span>Listem</span>
            {preferenceCount > 0 && (
              <span className="absolute top-0 right-1 px-1 text-[10px] font-bold rounded-full bg-brand-600 text-white">
                {preferenceCount}
              </span>
            )}
          </button>
        </div>

      </div>
    </header>
  );
};
