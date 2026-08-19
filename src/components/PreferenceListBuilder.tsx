import React from 'react';
import { Department, UserScores, ScoreType } from '../types';
import { calculateProbability } from '../utils/probability';
import {
  ListOrdered,
  Trash2,
  ArrowUp,
  ArrowDown,
  Printer,
  Sparkles,
  Download,
  AlertTriangle,
  CheckCircle2,
  Info,
  Plus,
} from 'lucide-react';

interface PreferenceListBuilderProps {
  preferences: Department[];
  setPreferences: React.Dispatch<React.SetStateAction<Department[]>>;
  userScores: UserScores;
  onOpenTrendModal: (dept: Department) => void;
  onExploreMore: () => void;
}

export const PreferenceListBuilder: React.FC<PreferenceListBuilderProps> = ({
  preferences,
  setPreferences,
  userScores,
  onOpenTrendModal,
  onExploreMore,
}) => {
  const getRankForDept = (scoreType: ScoreType): number => {
    if (scoreType === 'SAY') return userScores.sayRank || 0;
    if (scoreType === 'EA') return userScores.eaRank || 0;
    if (scoreType === 'SOZ') return userScores.sozRank || 0;
    if (scoreType === 'DIL') return userScores.dilRank || 0;
    return userScores.tytRank || 0;
  };

  // Sıralama Değiştirme
  const moveItem = (index: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === preferences.length - 1)
    ) {
      return;
    }
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    const updated = [...preferences];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;
    setPreferences(updated);
  };

  // Listeden Çıkarma
  const removeItem = (id: string) => {
    setPreferences((prev) => prev.filter((p) => p.id !== id));
  };

  // Listeyi Temizle
  const clearList = () => {
    if (window.confirm('Tüm tercih listenizi temizlemek istediğinizden emin misiniz?')) {
      setPreferences([]);
    }
  };

  // Yazdır / PDF
  const handlePrint = () => {
    window.print();
  };

  // JSON Dışa Aktarma
  const handleExportJson = () => {
    const dataStr =
      'data:text/json;charset=utf-8,' +
      encodeURIComponent(
        JSON.stringify(
          preferences.map((p, i) => {
            const rank = getRankForDept(p.scoreType);
            return {
              sira: i + 1,
              kod: p.code,
              universite: p.universityName,
              bolum: p.departmentName,
              sehir: p.city,
              puanTuru: p.scoreType,
              ihtimal: rank > 0 ? calculateProbability(rank, p).percentage : 'Belirtilmedi',
            };
          }),
          null,
          2
        )
      );
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', 'yks_tercih_listesi.json');
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Tercih Listesi Risk & Denge İstatistikleri
  const stats = React.useMemo(() => {
    let garanti = 0;
    let ideal = 0;
    let dengeli = 0;
    let riskli = 0;
    let hayal = 0;
    let evaluatedCount = 0;

    preferences.forEach((dept) => {
      const rank = getRankForDept(dept.scoreType);
      if (rank > 0) {
        evaluatedCount++;
        const prob = calculateProbability(rank, dept);
        if (prob.category === 'garanti') garanti++;
        else if (prob.category === 'ideal') ideal++;
        else if (prob.category === 'dengeli') dengeli++;
        else if (prob.category === 'riskli') riskli++;
        else hayal++;
      }
    });

    const total = evaluatedCount || preferences.length || 1;
    const hasEnoughGuaranteed = garanti >= 2 || (garanti + ideal) >= Math.ceil(total * 0.4);

    return {
      garanti,
      ideal,
      dengeli,
      riskli,
      hayal,
      evaluatedCount,
      garantiPct: Math.round((garanti / total) * 100),
      idealPct: Math.round((ideal / total) * 100),
      dengeliPct: Math.round((dengeli / total) * 100),
      riskliPct: Math.round((riskli / total) * 100),
      hayalPct: Math.round((hayal / total) * 100),
      hasEnoughGuaranteed,
    };
  }, [preferences, userScores]);

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      
      {/* Üst Başlık & Kontroller */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              24'lük ÖSYM Tercih Listesi Simülatörü
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-brand-100 text-brand-700 dark:bg-brand-950/80 dark:text-brand-300 border border-brand-200 dark:border-brand-800">
              {preferences.length} / 24 Tercih
            </span>
          </div>
          <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">
            Seçtiğiniz bölümleri yukarı-aşağı taşıyarak sıralayın ve listenizin güvenlik/risk dengesini kontrol edin.
          </p>
        </div>

        {/* Butonlar */}
        <div className="flex items-center space-x-2">
          {preferences.length > 0 && (
            <>
              <button
                onClick={handlePrint}
                className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 transition-colors"
                title="Yazdır veya PDF olarak kaydet"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Yazdır / PDF</span>
              </button>

              <button
                onClick={handleExportJson}
                className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 transition-colors"
                title="JSON olarak indir"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Dışa Aktar</span>
              </button>

              <button
                onClick={clearList}
                className="p-2 rounded-xl text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                title="Listeyi Temizle"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </>
          )}

          <button
            onClick={onExploreMore}
            className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold shadow-md shadow-brand-600/20 transition-all hover:scale-105"
          >
            <Plus className="w-4 h-4" />
            <span>Bölüm Ekle</span>
          </button>
        </div>
      </div>

      {preferences.length > 0 ? (
        <div className="space-y-6">
          
          {/* Liste Denge & Risk Dağılımı Özeti */}
          <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
              <span className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center">
                <Sparkles className="w-4 h-4 mr-2 text-brand-500" />
                Tercih Listesi Denge ve Risk Dağılım Analizi
              </span>
              <div className="flex items-center space-x-2">
                {stats.hasEnoughGuaranteed ? (
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                    <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                    Dengeli ve Güvenli Liste
                  </span>
                ) : (
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300">
                    <AlertTriangle className="w-3.5 h-3.5 mr-1" />
                    Güvence Tercihi Eklemeniz Önerilir
                  </span>
                )}
              </div>
            </div>

            {/* İstatistik Çubukları */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/40 text-center">
                <span className="text-[11px] font-bold text-emerald-800 dark:text-emerald-300 block">
                  Garanti (%85+)
                </span>
                <span className="text-xl font-black text-emerald-600 dark:text-emerald-400">
                  {stats.garanti} <span className="text-xs font-normal">({stats.garantiPct}%)</span>
                </span>
              </div>

              <div className="p-3 rounded-2xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/40 text-center">
                <span className="text-[11px] font-bold text-blue-800 dark:text-blue-300 block">
                  İdeal (%60-84)
                </span>
                <span className="text-xl font-black text-blue-600 dark:text-blue-400">
                  {stats.ideal} <span className="text-xs font-normal">({stats.idealPct}%)</span>
                </span>
              </div>

              <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/40 text-center">
                <span className="text-[11px] font-bold text-amber-800 dark:text-amber-300 block">
                  Dengeli (%35-59)
                </span>
                <span className="text-xl font-black text-amber-600 dark:text-amber-400">
                  {stats.dengeli} <span className="text-xs font-normal">({stats.dengeliPct}%)</span>
                </span>
              </div>

              <div className="p-3 rounded-2xl bg-orange-50 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-900/40 text-center">
                <span className="text-[11px] font-bold text-orange-800 dark:text-orange-300 block">
                  Riskli (%15-34)
                </span>
                <span className="text-xl font-black text-orange-600 dark:text-orange-400">
                  {stats.riskli} <span className="text-xs font-normal">({stats.riskliPct}%)</span>
                </span>
              </div>

              <div className="p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/40 text-center col-span-2 sm:col-span-1">
                <span className="text-[11px] font-bold text-rose-800 dark:text-rose-300 block">
                  Hayal (&lt;%15)
                </span>
                <span className="text-xl font-black text-rose-600 dark:text-rose-400">
                  {stats.hayal} <span className="text-xs font-normal">({stats.hayalPct}%)</span>
                </span>
              </div>
            </div>

            {/* Rehberlik Notu */}
            <div className="flex items-start space-x-2 text-xs text-slate-500 dark:text-slate-400 pt-1">
              <Info className="w-4 h-4 shrink-0 text-brand-500 mt-0.5" />
              <span>
                <strong>ÖSYM Rehberlik Kuralı:</strong> Tercih listenizin en başına (1-4. sıralar) hayal/sürpriz, orta kısmına (5-16. sıralar) ideal/dengeli, sonlarına ise (17-24. sıralar) sıralamanızın %20-40 altında kalan güvence (garanti) tercihlerini yerleştirmeniz açıkta kalma riskinizi sıfırlar.
              </span>
            </div>
          </div>

          {/* Tercih Tablosu / Listesi */}
          <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden">
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {preferences.map((dept, index) => {
                const deptRank = getRankForDept(dept.scoreType);
                const probability = calculateProbability(deptRank, dept);
                const latest2024 = dept.history.find((h) => h.year === 2024) || dept.history[dept.history.length - 2] || dept.history[dept.history.length - 1];

                return (
                  <div
                    key={dept.id}
                    className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    
                    {/* Sol: Sıra No ve Bölüm Bilgileri */}
                    <div className="flex items-start space-x-3 sm:space-x-4">
                      <div className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 flex items-center justify-center font-black text-sm text-brand-600 dark:text-brand-400 shrink-0">
                        {index + 1}
                      </div>

                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-1.5">
                          <span className="px-2 py-0.5 rounded text-[10px] font-black bg-brand-100 text-brand-700 dark:bg-brand-950 dark:text-brand-300">
                            {dept.scoreType}
                          </span>
                          <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                            {dept.universityName}
                          </span>
                          <span className="text-xs text-slate-400">({dept.city})</span>
                        </div>

                        <h4
                          onClick={() => onOpenTrendModal(dept)}
                          className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white hover:text-brand-600 dark:hover:text-brand-400 cursor-pointer transition-colors"
                        >
                          {dept.departmentName}
                        </h4>

                        <div className="text-xs text-slate-400 flex items-center space-x-3">
                          <span>Kod: {dept.code}</span>
                          <span>•</span>
                          <span>{dept.scholarship}</span>
                          <span>•</span>
                          <span>2024 Tabanı: {latest2024.baseRank > 0 ? `${latest2024.baseRank.toLocaleString('tr-TR')}.` : 'Dolmadı / Veri Yok'}</span>
                        </div>
                      </div>
                    </div>

                    {/* Sağ: İhtimal Rozeti ve Taşıma Butonları */}
                    <div className="flex items-center justify-between sm:justify-end space-x-3 border-t sm:border-t-0 pt-2 sm:pt-0">
                      
                      {/* İhtimal Badge */}
                      <div className="text-left sm:text-right">
                        {deptRank > 0 ? (
                          <div className="flex items-center sm:justify-end space-x-1.5">
                            <span className="text-sm font-black text-slate-900 dark:text-white">
                              %{probability.percentage}
                            </span>
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${probability.categoryColor}`}>
                              {probability.categoryTitle.split('/')[0].trim()}
                            </span>
                          </div>
                        ) : (
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                            Sıralama Bekleniyor
                          </span>
                        )}
                      </div>

                      {/* Yukarı / Aşağı Taşıma Butonları */}
                      <div className="flex items-center space-x-1">
                        <button
                          onClick={() => moveItem(index, 'up')}
                          disabled={index === 0}
                          className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                          title="Yukarı Taşı"
                        >
                          <ArrowUp className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => moveItem(index, 'down')}
                          disabled={index === preferences.length - 1}
                          className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                          title="Aşağı Taşı"
                        >
                          <ArrowDown className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => removeItem(dept.id)}
                          className="p-2 rounded-xl text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                          title="Listeden Çıkar"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                    </div>

                  </div>
                );
              })}
            </div>
          </div>

        </div>
      ) : (
        <div className="text-center py-20 px-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
          <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 mx-auto">
            <ListOrdered className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-black text-slate-900 dark:text-white">
              Henüz Tercih Listenize Bölüm Eklenmedi
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">
              "Bölüm Keşfet" sekmesinden ilgilendiğiniz bölümleri "Tercihe Ekle" butonuna basarak 24'lük listenize ekleyebilirsiniz.
            </p>
          </div>
          <button
            onClick={onExploreMore}
            className="px-6 py-3 rounded-2xl bg-brand-600 text-white font-extrabold text-xs shadow-lg shadow-brand-600/30 hover:scale-105 transition-all"
          >
            Bölümleri Keşfet ve Ekle
          </button>
        </div>
      )}

    </div>
  );
};
