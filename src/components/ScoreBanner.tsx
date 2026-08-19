import React, { useState } from 'react';
import { ScoreType, UserScores } from '../types';
import { Award, Zap, TrendingUp, Edit3, Check } from 'lucide-react';

interface ScoreBannerProps {
  userScores: UserScores;
  setUserScores: React.Dispatch<React.SetStateAction<UserScores>>;
  onOpenCalculator: () => void;
  onOpenDirect: () => void;
}

export const ScoreBanner: React.FC<ScoreBannerProps> = ({
  userScores,
  setUserScores,
  onOpenCalculator,
  onOpenDirect,
}) => {
  const [isEditingRank, setIsEditingRank] = useState(false);

  const currentRank =
    userScores.activeScoreType === 'SAY'
      ? userScores.sayRank
      : userScores.activeScoreType === 'EA'
      ? userScores.eaRank
      : userScores.activeScoreType === 'SOZ'
      ? userScores.sozRank
      : userScores.activeScoreType === 'DIL'
      ? userScores.dilRank
      : userScores.tytRank;

  const [tempRank, setTempRank] = useState(currentRank > 0 ? currentRank.toString() : '');

  const currentScore =
    userScores.activeScoreType === 'SAY'
      ? userScores.sayScore
      : userScores.activeScoreType === 'EA'
      ? userScores.eaScore
      : userScores.activeScoreType === 'SOZ'
      ? userScores.sozScore
      : userScores.activeScoreType === 'DIL'
      ? userScores.dilScore
      : userScores.tytScore;

  const scoreTypes: ScoreType[] = ['SAY', 'EA', 'SOZ', 'DIL', 'TYT'];

  const handleSaveInlineRank = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const rankNum = parseInt(tempRank.replace(/\./g, '').replace(/,/g, '')) || 0;
    setUserScores((prev) => {
      const updated = { ...prev };
      if (prev.activeScoreType === 'SAY') updated.sayRank = rankNum;
      else if (prev.activeScoreType === 'EA') updated.eaRank = rankNum;
      else if (prev.activeScoreType === 'SOZ') updated.sozRank = rankNum;
      else if (prev.activeScoreType === 'DIL') updated.dilRank = rankNum;
      else updated.tytRank = rankNum;
      return updated;
    });
    setIsEditingRank(false);
  };

  return (
    <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-brand-950 text-white rounded-2xl p-4 sm:p-6 shadow-xl border border-slate-700/50 mb-8">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        
        {/* Sol Alan: Aktif Sıralama ve Puan Özeti */}
        <div className="flex items-start sm:items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-brand-500/20 border border-brand-500/30 flex items-center justify-center text-brand-400 shrink-0">
            <Award className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-brand-400">
                Hedeflenen Puan Türü
              </span>
              <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                <Zap className="w-3 h-3 mr-1" />
                Aktif Analiz
              </span>
            </div>

            <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1 mt-1">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-slate-300">Sıralamanız:</span>
                
                {isEditingRank ? (
                  <form onSubmit={handleSaveInlineRank} className="flex items-center space-x-1.5">
                    <input
                      type="number"
                      min={1}
                      max={3000000}
                      placeholder="Örn: 24500"
                      autoFocus
                      value={tempRank}
                      onChange={(e) => setTempRank(e.target.value)}
                      className="w-32 px-2.5 py-1 bg-slate-950 border border-brand-500 rounded-lg text-base font-black text-white focus:outline-none placeholder-slate-500"
                    />
                    <button
                      type="submit"
                      className="p-1.5 bg-brand-600 hover:bg-brand-500 rounded-lg text-white text-xs font-bold"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                  </form>
                ) : (
                  <div
                    onClick={() => {
                      setTempRank(currentRank > 0 ? currentRank.toString() : '');
                      setIsEditingRank(true);
                    }}
                    className="flex items-center space-x-1.5 cursor-pointer group"
                    title="Sıralamanızı hızlıca değiştirmek için tıklayın"
                  >
                    {currentRank > 0 ? (
                      <span className="text-2xl sm:text-3xl font-black text-white tracking-tight group-hover:text-brand-400 transition-colors">
                        {currentRank.toLocaleString('tr-TR')}.
                      </span>
                    ) : (
                      <span className="text-base sm:text-lg font-extrabold text-amber-400 group-hover:text-amber-300 underline underline-offset-4 decoration-amber-400/50 transition-colors">
                        Henüz Girilmedi (Girmek için tıklayın)
                      </span>
                    )}
                    <Edit3 className="w-4 h-4 text-slate-400 group-hover:text-brand-400 opacity-60 group-hover:opacity-100 transition-all" />
                  </div>
                )}
              </div>

              {currentScore > 0 && (
                <div className="flex items-baseline space-x-1.5 text-slate-300 text-sm">
                  <span>Yerl. Puanı:</span>
                  <span className="font-bold text-amber-400">{currentScore.toFixed(2)}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Orta Alan: Puan Türü Hızlı Seçici */}
        <div className="flex items-center space-x-1 bg-slate-950/60 p-1 rounded-xl border border-slate-700/60 self-start sm:self-auto">
          {scoreTypes.map((type) => (
            <button
              key={type}
              onClick={() => {
                setUserScores((prev) => ({
                  ...prev,
                  activeScoreType: type,
                }));
                setIsEditingRank(false);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                userScores.activeScoreType === type
                  ? 'bg-brand-600 text-white shadow-md shadow-brand-600/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              {type}
            </button>
          ))}
        </div>

        {/* Sağ Alan: Hızlı Aksiyonlar */}
        <div className="flex items-center space-x-2 pt-2 sm:pt-0 border-t border-slate-700/40 sm:border-t-0">
          <button
            onClick={onOpenCalculator}
            className="flex-1 sm:flex-none flex items-center justify-center space-x-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-600 transition-colors"
          >
            <TrendingUp className="w-3.5 h-3.5 text-brand-400" />
            <span>Netleri Hesapla</span>
          </button>
          <button
            onClick={onOpenDirect}
            className="flex-1 sm:flex-none flex items-center justify-center space-x-1.5 px-3.5 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-xs font-bold text-white shadow-lg shadow-brand-600/20 transition-all hover:scale-[1.02]"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Sıralama Gir</span>
          </button>
        </div>

      </div>
    </div>
  );
};
