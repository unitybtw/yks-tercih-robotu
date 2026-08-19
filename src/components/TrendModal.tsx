import React, { useState } from 'react';
import { Department, ProbabilityAnalysis, ScoreType } from '../types';
import {
  X,
  TrendingUp,
  TrendingDown,
  Minus,
  Sparkles,
  Award,
  Check,
  Plus,
  Building2,
  MapPin,
  BookOpen,
} from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

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

interface TrendModalProps {
  department: Department | null;
  probability: ProbabilityAnalysis | null;
  userRank: number;
  activeScoreType: ScoreType;
  isOpen: boolean;
  onClose: () => void;
  isInPreferences: boolean;
  onTogglePreference: (dept: Department) => void;
}

export const TrendModal: React.FC<TrendModalProps> = ({
  department,
  probability,
  userRank,
  isOpen,
  onClose,
  isInPreferences,
  onTogglePreference,
}) => {
  const [chartMode, setChartMode] = useState<'rank' | 'score'>('rank');

  if (!isOpen || !department || !probability) return null;

  const sortedHistory = [...department.history].sort((a, b) => a.year - b.year);
  const latest2024 = sortedHistory.find((h) => h.year === 2024) || sortedHistory[sortedHistory.length - 2] || sortedHistory[sortedHistory.length - 1];
  const oldest2020 = sortedHistory.find((h) => h.year === 2020 && h.baseRank > 0) || sortedHistory[0];
  const proj2025 = sortedHistory.find((h) => h.year === 2025) || sortedHistory[sortedHistory.length - 1];

  const labels = sortedHistory.map((h) => `${h.year}${h.year === 2025 ? ' (Tahmin)' : ''}`);

  // Grafik verileri
  const rankData = sortedHistory.map((h) => h.baseRank);
  const scoreData = sortedHistory.map((h) => h.baseScore);
  const userRankLine = sortedHistory.map(() => (userRank > 0 ? userRank : null));

  const chartData = {
    labels,
    datasets:
      chartMode === 'rank'
        ? [
            {
              label: 'Bölüm Taban Sıralaması',
              data: rankData,
              borderColor: '#ea580c',
              backgroundColor: 'rgba(234, 88, 12, 0.12)',
              fill: true,
              tension: 0.35,
              pointRadius: 6,
              pointHoverRadius: 8,
              pointBackgroundColor: '#ea580c',
              pointBorderColor: '#ffffff',
              pointBorderWidth: 2,
            },
            ...(userRank > 0
              ? [
                  {
                    label: `Senin Sıralaman (${userRank.toLocaleString('tr-TR')})`,
                    data: userRankLine,
                    borderColor: '#2563eb',
                    borderDash: [6, 6],
                    backgroundColor: 'transparent',
                    pointRadius: 4,
                    pointBackgroundColor: '#2563eb',
                  },
                ]
              : []),
          ]
        : [
            {
              label: 'Bölüm Taban Puanı',
              data: scoreData,
              borderColor: '#10b981',
              backgroundColor: 'rgba(16, 185, 129, 0.12)',
              fill: true,
              tension: 0.35,
              pointRadius: 6,
              pointHoverRadius: 8,
              pointBackgroundColor: '#10b981',
              pointBorderColor: '#ffffff',
              pointBorderWidth: 2,
            },
          ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          font: { family: 'Outfit, Inter', weight: 600 as const, size: 12 },
          color: '#64748b',
          usePointStyle: true,
        },
      },
      tooltip: {
        backgroundColor: '#0f172a',
        titleFont: { family: 'Outfit', weight: 'bold' as const, size: 13 },
        bodyFont: { family: 'Inter', size: 12 },
        padding: 12,
        cornerRadius: 10,
        callbacks: {
          label: function (context: any) {
            const val = context.raw;
            if (!val) return '';
            if (chartMode === 'rank') {
              return `${context.dataset.label}: ${val.toLocaleString('tr-TR')}. Sıra`;
            }
            return `${context.dataset.label}: ${val.toFixed(2)} Puan`;
          },
        },
      },
    },
    scales: {
      y: {
        reverse: chartMode === 'rank', // Sıralamada 1 numara en üstte gözükür
        grid: { color: 'rgba(148, 163, 184, 0.1)' },
        ticks: {
          color: '#94a3b8',
          font: { family: 'Inter', size: 11 },
          callback: function (val: any) {
            if (chartMode === 'rank') {
              return val >= 1000 ? `${(val / 1000).toFixed(0)}k` : val;
            }
            return val;
          },
        },
      },
      x: {
        grid: { display: false },
        ticks: {
          color: '#94a3b8',
          font: { family: 'Outfit', weight: 600 as const, size: 12 },
        },
      },
    },
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-slate-950/75 backdrop-blur-md animate-in fade-in duration-200">
      
      {/* Modal Kutusu */}
      <div className="relative w-full max-w-4xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-8">
        
        {/* Modal Başlık Çubuğu */}
        <div className="flex items-start justify-between p-5 sm:p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-md text-xs font-extrabold bg-brand-100 text-brand-700 dark:bg-brand-950/70 dark:text-brand-300 border border-brand-200 dark:border-brand-800">
                {department.scoreType}
              </span>
              <span className="px-2.5 py-0.5 rounded-md text-xs font-semibold bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                {department.universityType}
              </span>
              <span className="px-2.5 py-0.5 rounded-md text-xs font-semibold bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300">
                {department.scholarship}
              </span>
              <span className="px-2.5 py-0.5 rounded-md text-xs font-semibold bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300">
                {department.language}
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              {department.departmentName}
            </h2>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 dark:text-slate-400 mt-1">
              <span className="flex items-center">
                <Building2 className="w-3.5 h-3.5 mr-1" />
                {department.universityName}
              </span>
              <span className="flex items-center">
                <MapPin className="w-3.5 h-3.5 mr-1" />
                {department.city}
              </span>
              <span className="flex items-center">
                <BookOpen className="w-3.5 h-3.5 mr-1" />
                Kod: {department.code}
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Modal İçeriği */}
        <div className="p-5 sm:p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          
          {/* İhtimal Özeti Kartı */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* İhtimal Yüzdesi */}
            <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 text-white flex flex-col justify-between border border-slate-700/60">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Yerleşme İhtimali
                </span>
                <Sparkles className="w-4 h-4 text-brand-400" />
              </div>

              <div className="my-3">
                {userRank > 0 ? (
                  <>
                    <div className="text-4xl sm:text-5xl font-black tracking-tight bg-gradient-to-r from-emerald-300 via-teal-200 to-white bg-clip-text text-transparent">
                      %{probability.percentage}
                    </div>
                    <span className={`inline-block mt-2 px-2.5 py-0.5 rounded-full text-xs font-extrabold ${probability.categoryColor}`}>
                      {probability.categoryTitle}
                    </span>
                  </>
                ) : (
                  <div>
                    <span className="text-xl font-bold text-amber-400 block">Sıralama Girilmedi</span>
                    <span className="text-xs text-slate-400 mt-1 block">İhtimal hesaplaması için sıralamanızı girin.</span>
                  </div>
                )}
              </div>

              <div className="text-xs text-slate-400">
                {userRank > 0 ? (
                  <>Risk Skoru: <span className="font-bold text-white">{probability.riskScore} / 10</span></>
                ) : (
                  <span>Durum: Nötr</span>
                )}
              </div>
            </div>

            {/* 5 Yıllık Trend Durumu */}
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 flex flex-col justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                5 Yıllık Trend Yönü
              </span>

              <div className="my-3 flex items-center space-x-3">
                <div className="w-12 h-12 rounded-2xl bg-brand-50 dark:bg-brand-950/60 border border-brand-200 dark:border-brand-800 flex items-center justify-center text-brand-600 dark:text-brand-400">
                  {probability.trendSlope === 'hizli_yukselis' || probability.trendSlope === 'hafif_yukselis' ? (
                    <TrendingUp className="w-6 h-6" />
                  ) : probability.trendSlope === 'hizli_dusus' || probability.trendSlope === 'hafif_dusus' ? (
                    <TrendingDown className="w-6 h-6" />
                  ) : (
                    <Minus className="w-6 h-6" />
                  )}
                </div>
                <div>
                  <div className="font-extrabold text-base text-slate-900 dark:text-white">
                    {probability.trendText}
                  </div>
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    2020: {oldest2020.baseRank > 0 ? oldest2020.baseRank.toLocaleString('tr-TR') : '-'} → 2024:{' '}
                    {latest2024.baseRank > 0 ? latest2024.baseRank.toLocaleString('tr-TR') : '-'}
                  </span>
                </div>
              </div>

              <div className="text-xs text-slate-500 dark:text-slate-400">
                2025 Tahmini: <span className="font-bold text-brand-600 dark:text-brand-400">{proj2025.baseRank > 0 ? `${proj2025.baseRank.toLocaleString('tr-TR')}.` : '-'}</span>
              </div>
            </div>

            {/* Sıralama Farkı */}
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 flex flex-col justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Sıralama Güvenlik Marjı
              </span>

              <div className="my-3">
                {userRank > 0 ? (
                  <>
                    <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                      {probability.rankDiff >= 0 ? `+${probability.rankDiff.toLocaleString('tr-TR')}` : probability.rankDiff.toLocaleString('tr-TR')}
                    </div>
                    <span className={`text-xs font-bold ${probability.rankDiff >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                      {probability.rankDiff >= 0
                        ? `Tabanın %${Math.abs(probability.rankDiffPercentage)} önündesiniz`
                        : `Tabanın %${Math.abs(probability.rankDiffPercentage)} gerisindesiniz`}
                    </span>
                  </>
                ) : (
                  <div>
                    <span className="text-base font-bold text-slate-700 dark:text-slate-300 block">Sıralama Girilmedi</span>
                    <span className="text-xs text-slate-400">Kendi sıranızla karşılaştırmak için sıralama girin.</span>
                  </div>
                )}
              </div>

              <div className="text-xs text-slate-500 dark:text-slate-400">
                2024 Tabanı: {latest2024.baseRank > 0 ? latest2024.baseRank.toLocaleString('tr-TR') : '-'}
              </div>
            </div>

          </div>

          {/* AI / Danışman Rehberlik Tavsiyesi */}
          <div className="p-4 sm:p-5 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 space-y-2">
            <div className="flex items-center space-x-2 text-amber-800 dark:text-amber-300 font-bold text-sm">
              <Award className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              <span>YKS Tercih Danışmanı Yorumu & Strateji</span>
            </div>
            <p className="text-xs sm:text-sm text-amber-900/90 dark:text-amber-200/90 leading-relaxed">
              {probability.advice}
            </p>
          </div>

          {/* 5 Yıllık Trend Grafiği */}
          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white flex items-center">
                  <TrendingUp className="w-4 h-4 mr-2 text-brand-500" />
                  5 Yıllık Değişim Grafiği (2020 - 2025)
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {chartMode === 'rank'
                    ? 'YKS Taban Sıralama Eğrisi (Grafikte yukarı yön daha iyi dereceyi temsil eder)'
                    : 'YKS Taban Puan Eğrisi'}
                </p>
              </div>

              {/* Grafik Türü Seçici */}
              <div className="flex items-center space-x-1 bg-slate-200 dark:bg-slate-700 p-1 rounded-xl self-start sm:self-auto">
                <button
                  onClick={() => setChartMode('rank')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    chartMode === 'rank'
                      ? 'bg-white dark:bg-slate-900 text-brand-600 dark:text-brand-400 shadow-sm'
                      : 'text-slate-600 dark:text-slate-300'
                  }`}
                >
                  Sıralama Grafiği
                </button>
                <button
                  onClick={() => setChartMode('score')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    chartMode === 'score'
                      ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-sm'
                      : 'text-slate-600 dark:text-slate-300'
                  }`}
                >
                  Puan Grafiği
                </button>
              </div>
            </div>

            {/* Canvas Container */}
            <div className="h-64 sm:h-72 w-full pt-2">
              <Line data={chartData} options={chartOptions} />
            </div>
          </div>

          {/* 5 Yıllık Veri Tablosu */}
          <div className="space-y-3">
            <h4 className="font-bold text-sm text-slate-900 dark:text-white">
              Geçmiş Yıllar Detaylı İstatistik Tablosu
            </h4>
            <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold border-b border-slate-200 dark:border-slate-700">
                  <tr>
                    <th className="py-2.5 px-4">Yıl</th>
                    <th className="py-2.5 px-4">Taban Sıralama</th>
                    <th className="py-2.5 px-4">Taban Puan</th>
                    <th className="py-2.5 px-4">Kontenjan</th>
                    <th className="py-2.5 px-4">Yerleşen</th>
                    <th className="py-2.5 px-4">Doluluk</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                  {sortedHistory.map((row) => (
                    <tr
                      key={row.year}
                      className={`hover:bg-slate-50 dark:hover:bg-slate-800/40 ${
                        row.year === 2025 ? 'bg-orange-50/50 dark:bg-orange-950/20 font-bold' : ''
                      }`}
                    >
                      <td className="py-2.5 px-4 font-semibold text-slate-800 dark:text-slate-200">
                        {row.year} {row.year === 2025 && '(Projeksiyon)'}
                      </td>
                      <td className="py-2.5 px-4 font-bold text-brand-600 dark:text-brand-400">
                        {row.baseRank.toLocaleString('tr-TR')}
                      </td>
                      <td className="py-2.5 px-4 font-semibold text-slate-700 dark:text-slate-300">
                        {row.baseScore.toFixed(2)}
                      </td>
                      <td className="py-2.5 px-4 text-slate-600 dark:text-slate-400">{row.quota}</td>
                      <td className="py-2.5 px-4 text-slate-600 dark:text-slate-400">{row.filledQuota}</td>
                      <td className="py-2.5 px-4">
                        <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
                          %100
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>

        {/* Modal Alt Bar / Footer Actions */}
        <div className="p-4 sm:p-5 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            Kapat
          </button>

          <button
            onClick={() => onTogglePreference(department)}
            className={`flex items-center space-x-2 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm shadow-md transition-all ${
              isInPreferences
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                : 'bg-brand-600 hover:bg-brand-500 text-white shadow-brand-600/30'
            }`}
          >
            {isInPreferences ? (
              <>
                <Check className="w-4 h-4" />
                <span>Tercih Listesinde Eklendi</span>
              </>
            ) : (
              <>
                <Plus className="w-4 h-4" />
                <span>Tercih Listeme Ekle (24'lük)</span>
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
};
