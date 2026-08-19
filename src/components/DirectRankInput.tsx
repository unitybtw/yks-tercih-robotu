import React, { useState } from 'react';
import { ScoreType, UserScores } from '../types';
import { Target, ArrowRight, Zap, Award } from 'lucide-react';
import confetti from 'canvas-confetti';

interface DirectRankInputProps {
  userScores: UserScores;
  setUserScores: React.Dispatch<React.SetStateAction<UserScores>>;
  onExploreDepartments: () => void;
}

export const DirectRankInput: React.FC<DirectRankInputProps> = ({
  userScores,
  setUserScores,
  onExploreDepartments,
}) => {
  const [scoreType, setScoreType] = useState<ScoreType>(userScores.activeScoreType || 'SAY');
  
  const getRankForType = (type: ScoreType) => {
    if (type === 'SAY') return userScores.sayRank || 0;
    if (type === 'EA') return userScores.eaRank || 0;
    if (type === 'SOZ') return userScores.sozRank || 0;
    if (type === 'DIL') return userScores.dilRank || 0;
    return userScores.tytRank || 0;
  };

  const getScoreForType = (type: ScoreType) => {
    if (type === 'SAY') return userScores.sayScore || 0;
    if (type === 'EA') return userScores.eaScore || 0;
    if (type === 'SOZ') return userScores.sozScore || 0;
    if (type === 'DIL') return userScores.dilScore || 0;
    return userScores.tytScore || 0;
  };

  const initialRank = getRankForType(userScores.activeScoreType || 'SAY');
  const initialScore = getScoreForType(userScores.activeScoreType || 'SAY');

  const [rankInput, setRankInput] = useState<string>(initialRank > 0 ? initialRank.toString() : '');
  const [scoreInput, setScoreInput] = useState<string>(initialScore > 0 ? initialScore.toString() : '');
  const [diplomaGrade, setDiplomaGrade] = useState<number>(userScores.diplomaGrade || 80);

  const handleSelectScoreType = (type: ScoreType) => {
    setScoreType(type);
    const r = getRankForType(type);
    const s = getScoreForType(type);
    setRankInput(r > 0 ? r.toString() : '');
    setScoreInput(s > 0 ? s.toString() : '');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const rank = parseInt(rankInput.replace(/\./g, '').replace(/,/g, '')) || 0;
    const score = parseFloat(scoreInput) || 0;

    setUserScores((prev) => {
      const updated = { ...prev, activeScoreType: scoreType, diplomaGrade };
      if (scoreType === 'SAY') {
        updated.sayRank = rank;
        updated.sayScore = score;
      } else if (scoreType === 'EA') {
        updated.eaRank = rank;
        updated.eaScore = score;
      } else if (scoreType === 'SOZ') {
        updated.sozRank = rank;
        updated.sozScore = score;
      } else if (scoreType === 'DIL') {
        updated.dilRank = rank;
        updated.dilScore = score;
      } else {
        updated.tytRank = rank;
        updated.tytScore = score;
      }
      return updated;
    });

    confetti({
      particleCount: 70,
      spread: 60,
      origin: { y: 0.6 },
    });

    onExploreDepartments();
  };

  const setPresetRank = (presetRank: number) => {
    setRankInput(presetRank.toString());
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      {/* Başlık */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-brand-100 dark:bg-brand-950/60 text-brand-700 dark:text-brand-300 text-xs font-bold border border-brand-200 dark:border-brand-800">
          <Target className="w-3.5 h-3.5" />
          <span>Hızlı ve Doğrudan Sıralama Analizi</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
          YKS Sıralamanızı veya Hedefinizi Girin
        </h2>
        <p className="text-slate-600 dark:text-slate-400 text-sm">
          ÖSYM sınav sonucunuzu veya hedeflediğiniz tahmini sıralamayı girerek üniversite bölümlerinin 5 yıllık yerleşme ihtimallerini hemen analiz edin.
        </p>
      </div>

      {/* Form Kartı */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Puan Türü Seçimi */}
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              1. Puan Türünü Seçin
            </label>
            <div className="grid grid-cols-5 gap-2">
              {(['SAY', 'EA', 'SOZ', 'DIL', 'TYT'] as ScoreType[]).map((type) => (
                <button
                  type="button"
                  key={type}
                  onClick={() => handleSelectScoreType(type)}
                  className={`py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all ${
                    scoreType === type
                      ? 'bg-brand-600 text-white shadow-md shadow-brand-600/30 ring-2 ring-brand-500/20'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Sıralama Girişi */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                2. {scoreType} Türkiye Sıralamanız
              </label>
              <span className="text-xs text-brand-600 dark:text-brand-400 font-semibold">
                (Örn: 24500)
              </span>
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 font-bold">
                #
              </div>
              <input
                type="number"
                required
                min={1}
                max={3000000}
                value={rankInput}
                onChange={(e) => setRankInput(e.target.value)}
                placeholder="Örn: 24500"
                className="w-full pl-9 pr-4 py-3.5 text-xl font-black bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 text-slate-900 dark:text-white"
              />
            </div>

            {/* Hızlı Sıralama Preset Butonları */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              <span className="text-[11px] text-slate-400 mr-1 self-center">Hızlı Seç:</span>
              {[1500, 5000, 15000, 30000, 60000, 120000].map((preset) => (
                <button
                  type="button"
                  key={preset}
                  onClick={() => setPresetRank(preset)}
                  className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-brand-50 hover:text-brand-600 dark:hover:bg-brand-950/40 dark:hover:text-brand-400 border border-slate-200 dark:border-slate-700 transition-colors"
                >
                  {preset.toLocaleString('tr-TR')}
                </button>
              ))}
            </div>
          </div>

          {/* İsteğe Bağlı Puan Girişi */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300">
                Yerleştirme Puanı (İsteğe Bağlı)
              </label>
              <input
                type="number"
                step="0.01"
                min={100}
                max={560}
                value={scoreInput}
                onChange={(e) => setScoreInput(e.target.value)}
                placeholder="Örn: 462.50"
                className="w-full px-3.5 py-2.5 font-bold text-sm bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 text-slate-900 dark:text-white"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300">
                Lise Diploma Notu (50-100)
              </label>
              <input
                type="number"
                step="0.1"
                min={50}
                max={100}
                value={diplomaGrade}
                onChange={(e) => setDiplomaGrade(parseFloat(e.target.value) || 85)}
                className="w-full px-3.5 py-2.5 font-bold text-sm bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 text-slate-900 dark:text-white"
              />
            </div>
          </div>

          {/* Submit Butonu */}
          <button
            type="submit"
            className="w-full flex items-center justify-center space-x-2 py-4 px-6 rounded-2xl bg-brand-600 hover:bg-brand-500 text-white font-extrabold text-base shadow-xl shadow-brand-600/30 hover:scale-[1.01] active:scale-[0.99] transition-all"
          >
            <Zap className="w-5 h-5" />
            <span>Yerleşme İhtimali Analizini Başlat</span>
            <ArrowRight className="w-5 h-5 ml-1" />
          </button>

        </form>

        {/* Bilgilendirme Notu */}
        <div className="p-4 rounded-xl bg-orange-50 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-900/40 flex items-start space-x-3 text-xs text-orange-800 dark:text-orange-300">
          <Award className="w-5 h-5 shrink-0 text-brand-600 dark:text-brand-400 mt-0.5" />
          <div>
            <span className="font-bold">Nasıl Çalışır?</span> Girmiş olduğunuz sıralama, sistemimizdeki tüm bölümlerin 2020-2024 taban sıralamaları, 5 yıllık değişim eğimi (slope) ve 2025 projeksiyonu ile karşılaştırılarak %1 - %99 arasında gerçekçi yerleşme olasılığı üretir.
          </div>
        </div>

      </div>
    </div>
  );
};
