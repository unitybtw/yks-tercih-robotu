import React from 'react';
import { Department, ProbabilityAnalysis } from '../types';
import {
  TrendingUp,
  TrendingDown,
  Minus,
  Building2,
  MapPin,
  LineChart,
  Plus,
  Check,
  Sparkles,
} from 'lucide-react';

interface DepartmentCardProps {
  department: Department;
  probability: ProbabilityAnalysis;
  userRank?: number;
  isInPreferences: boolean;
  onOpenTrendModal: (dept: Department) => void;
  onTogglePreference: (dept: Department) => void;
}

export const DepartmentCard: React.FC<DepartmentCardProps> = ({
  department,
  probability,
  isInPreferences,
  onOpenTrendModal,
  onTogglePreference,
}) => {
  const sortedHistory = [...department.history].sort((a, b) => a.year - b.year);
  const latest2024 = sortedHistory[sortedHistory.length - 2] || sortedHistory[sortedHistory.length - 1];
  const oldest2020 = sortedHistory[0];

  return (
    <div className="group relative rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-sm hover:shadow-xl hover:border-brand-500/40 dark:hover:border-brand-500/40 transition-all duration-200 flex flex-col justify-between">
      
      {/* Üst Kısım: Rozetler ve Bölüm Başlığı */}
      <div>
        
        {/* Etiketler (Puan Türü, Şehir, Burs, Dil) */}
        <div className="flex flex-wrap items-center gap-1.5 mb-3">
          <span className="px-2.5 py-0.5 rounded-md text-xs font-black bg-brand-100 text-brand-700 dark:bg-brand-950/70 dark:text-brand-300 border border-brand-200 dark:border-brand-800">
            {department.scoreType}
          </span>
          <span className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
            {department.universityType}
          </span>
          <span className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300">
            {department.scholarship}
          </span>
          <span className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300">
            {department.language}
          </span>
        </div>

        {/* Üniversite & Bölüm İsmi */}
        <div className="space-y-1">
          <div className="flex items-center text-xs font-semibold text-slate-500 dark:text-slate-400">
            <Building2 className="w-3.5 h-3.5 mr-1 text-slate-400" />
            <span className="truncate">{department.universityName}</span>
          </div>

          <h3 className="font-extrabold text-base sm:text-lg text-slate-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors leading-snug">
            {department.departmentName}
          </h3>

          <div className="flex items-center space-x-3 text-xs text-slate-400 pt-0.5">
            <span className="flex items-center">
              <MapPin className="w-3 h-3 mr-1" />
              {department.city}
            </span>
            <span>•</span>
            <span>Kod: {department.code}</span>
          </div>
        </div>

      </div>

      {/* Orta Kısım: 2024 Taban Sıralaması & Yerleşme İhtimali Rozeti */}
      <div className="my-5 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800/80 space-y-3">
        
        {/* İhtimal Yüzdesi ve Kategorisi */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1.5">
            <Sparkles className="w-4 h-4 text-brand-500" />
            <span className="text-xs font-bold text-slate-600 dark:text-slate-300">
              Yerleşme İhtimali:
            </span>
          </div>
          
          <div className="flex items-center space-x-2">
            <span className="text-sm sm:text-base font-black text-slate-900 dark:text-white">
              %{probability.percentage}
            </span>
            <span className={`px-2 py-0.5 rounded-full text-[11px] font-extrabold ${probability.categoryColor}`}>
              {probability.categoryTitle.split('/')[0].trim()}
            </span>
          </div>
        </div>

        {/* 2024 Taban Sıralaması & Puanı */}
        <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-200/60 dark:border-slate-700/60 text-xs">
          <div>
            <span className="text-slate-400 block text-[11px]">2024 Taban Sıra</span>
            <span className="font-extrabold text-sm text-slate-900 dark:text-white">
              {latest2024.baseRank.toLocaleString('tr-TR')}.
            </span>
          </div>
          <div className="text-right">
            <span className="text-slate-400 block text-[11px]">2024 Taban Puan</span>
            <span className="font-extrabold text-sm text-slate-700 dark:text-slate-300">
              {latest2024.baseScore.toFixed(2)}
            </span>
          </div>
        </div>

        {/* 5 Yıllık Trend Mini Göstergesi */}
        <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 pt-1">
          <span className="flex items-center">
            {probability.trendSlope === 'hizli_yukselis' || probability.trendSlope === 'hafif_yukselis' ? (
              <TrendingUp className="w-3.5 h-3.5 mr-1 text-emerald-500" />
            ) : probability.trendSlope === 'hizli_dusus' || probability.trendSlope === 'hafif_dusus' ? (
              <TrendingDown className="w-3.5 h-3.5 mr-1 text-rose-500" />
            ) : (
              <Minus className="w-3.5 h-3.5 mr-1 text-slate-400" />
            )}
            5 Yıllık Trend:
          </span>
          <span className="font-semibold text-slate-700 dark:text-slate-300">
            {oldest2020.baseRank.toLocaleString('tr-TR')} → {latest2024.baseRank.toLocaleString('tr-TR')}
          </span>
        </div>

      </div>

      {/* Alt Kısım: Aksiyon Butonları */}
      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={() => onOpenTrendModal(department)}
          className="flex items-center justify-center space-x-1.5 py-2.5 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 transition-colors"
        >
          <LineChart className="w-4 h-4 text-brand-500" />
          <span>5 Yıllık Trend</span>
        </button>

        <button
          onClick={() => onTogglePreference(department)}
          className={`flex items-center justify-center space-x-1.5 py-2.5 px-3 rounded-xl text-xs font-extrabold transition-all shadow-sm ${
            isInPreferences
              ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
              : 'bg-brand-600 hover:bg-brand-500 text-white shadow-brand-600/20'
          }`}
        >
          {isInPreferences ? (
            <>
              <Check className="w-4 h-4" />
              <span>Listemde</span>
            </>
          ) : (
            <>
              <Plus className="w-4 h-4" />
              <span>Tercihe Ekle</span>
            </>
          )}
        </button>
      </div>

    </div>
  );
};
