import React, { useState, useMemo, useEffect } from 'react';
import {
  Department,
  UserScores,
  ScoreType,
} from '../types';
import {
  DEPARTMENTS_DATA,
  CITIES,
  UNIVERSITY_TYPES,
  SCORE_TYPES,
  SCHOLARSHIPS,
} from '../data/departmentsData';
import { calculateProbability } from '../utils/probability';
import { DepartmentCard } from './DepartmentCard';
import {
  Search,
  ArrowUpDown,
  X,
  Compass,
  Sparkles,
  Award,
  Filter,
} from 'lucide-react';

interface DepartmentExplorerProps {
  userScores: UserScores;
  preferences: Department[];
  onOpenTrendModal: (dept: Department) => void;
  onTogglePreference: (dept: Department) => void;
}

export const DepartmentExplorer: React.FC<DepartmentExplorerProps> = ({
  userScores,
  preferences,
  onOpenTrendModal,
  onTogglePreference,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedScoreType, setSelectedScoreType] = useState<string>(userScores.activeScoreType || 'SAY');
  const [selectedCity, setSelectedCity] = useState<string>('Tümü');
  const [selectedUnivType, setSelectedUnivType] = useState<string>('Tümü');
  const [selectedScholarship, setSelectedScholarship] = useState<string>('Tümü');
  const getUserRankForDept = (scoreType: ScoreType): number => {
    if (scoreType === 'SAY') return userScores.sayRank || 0;
    if (scoreType === 'EA') return userScores.eaRank || 0;
    if (scoreType === 'SOZ') return userScores.sozRank || 0;
    if (scoreType === 'DIL') return userScores.dilRank || 0;
    return userScores.tytRank || 0;
  };

  const activeRank =
    selectedScoreType !== 'Tümü'
      ? getUserRankForDept(selectedScoreType as ScoreType)
      : getUserRankForDept(userScores.activeScoreType);

  const [sortBy, setSortBy] = useState<'prob_desc' | 'rank_asc' | 'rank_desc' | 'score_desc' | 'name_asc'>('rank_asc');
  const [minRankFilter, setMinRankFilter] = useState<string>('');
  const [maxRankFilter, setMaxRankFilter] = useState<string>('');
  const [visibleCount, setVisibleCount] = useState<number>(36);

  // userScores.activeScoreType değiştiğinde filtreyi senkronize et
  useEffect(() => {
    if (userScores.activeScoreType) {
      setSelectedScoreType(userScores.activeScoreType);
    }
  }, [userScores.activeScoreType]);

  const [categoryFilter, setCategoryFilter] = useState<'all' | 'recommended' | 'garanti' | 'ideal' | 'riskli_hayal'>(
    activeRank > 0 ? 'recommended' : 'all'
  );

  // Filtreleme ve Sıralama
  const filteredDepartments = useMemo(() => {
    const minCustom = minRankFilter ? parseInt(minRankFilter.replace(/\./g, '')) : null;
    const maxCustom = maxRankFilter ? parseInt(maxRankFilter.replace(/\./g, '')) : null;

    return DEPARTMENTS_DATA.filter((dept) => {
      const deptUserRank = getUserRankForDept(dept.scoreType);
      const prob = calculateProbability(deptUserRank, dept);
      const latest2024 = dept.history[dept.history.length - 2]?.baseRank || dept.history[dept.history.length - 1].baseRank;

      // Özel Min/Max Sıralama Filtresi
      if (minCustom !== null && latest2024 < minCustom) return false;
      if (maxCustom !== null && latest2024 > maxCustom) return false;

      // Arama sorgusu
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const match =
          dept.departmentName.toLowerCase().includes(q) ||
          dept.universityName.toLowerCase().includes(q) ||
          dept.city.toLowerCase().includes(q) ||
          dept.code.includes(q) ||
          dept.tags?.some((t) => t.toLowerCase().includes(q));
        if (!match) return false;
      }

      // Puan Türü
      if (selectedScoreType !== 'Tümü' && dept.scoreType !== selectedScoreType) {
        return false;
      }

      // Şehir
      if (selectedCity !== 'Tümü' && dept.city !== selectedCity) {
        return false;
      }

      // Üniversite Türü
      if (selectedUnivType !== 'Tümü' && dept.universityType !== selectedUnivType) {
        return false;
      }

      // Burs
      if (selectedScholarship !== 'Tümü' && dept.scholarship !== selectedScholarship) {
        return false;
      }

      // Akıllı Kategori / Sıralama Yelpaze Filtresi
      if (categoryFilter === 'recommended') {
        if (deptUserRank <= 0) return true; // Sıralama girilmediyse hepsini göster
        const minRank = Math.max(1, Math.round(deptUserRank * 0.25));
        const maxRank = Math.max(Math.round(deptUserRank * 2.5), deptUserRank + 400000);
        if (latest2024 < minRank || latest2024 > maxRank) {
          return false;
        }
      } else if (categoryFilter === 'garanti') {
        if (prob.category !== 'garanti') return false;
      } else if (categoryFilter === 'ideal') {
        if (prob.category !== 'ideal' && prob.category !== 'dengeli') return false;
      } else if (categoryFilter === 'riskli_hayal') {
        if (prob.category !== 'riskli' && prob.category !== 'hayal') return false;
      }

      return true;
    }).sort((a, b) => {
      const userRankA = getUserRankForDept(a.scoreType);
      const userRankB = getUserRankForDept(b.scoreType);
      const probA = calculateProbability(userRankA, a).percentage;
      const probB = calculateProbability(userRankB, b).percentage;
      const rankA = a.history[a.history.length - 2]?.baseRank || 0;
      const rankB = b.history[b.history.length - 2]?.baseRank || 0;
      const scoreA = a.history[a.history.length - 2]?.baseScore || 0;
      const scoreB = b.history[b.history.length - 2]?.baseScore || 0;

      if (sortBy === 'prob_desc') return probB - probA;
      if (sortBy === 'rank_asc') return rankA - rankB;
      if (sortBy === 'rank_desc') return rankB - rankA;
      if (sortBy === 'score_desc') return scoreB - scoreA;
      if (sortBy === 'name_asc') return a.departmentName.localeCompare(b.departmentName);
      return 0;
    });
  }, [
    searchQuery,
    selectedScoreType,
    selectedCity,
    selectedUnivType,
    selectedScholarship,
    categoryFilter,
    minRankFilter,
    maxRankFilter,
    sortBy,
    userScores,
  ]);

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedScoreType(userScores.activeScoreType || 'SAY');
    setSelectedCity('Tümü');
    setSelectedUnivType('Tümü');
    setSelectedScholarship('Tümü');
    setMinRankFilter('');
    setMaxRankFilter('');
    setCategoryFilter('all');
    setSortBy('rank_asc');
  };

  const hasActiveFilters =
    searchQuery !== '' ||
    selectedCity !== 'Tümü' ||
    selectedUnivType !== 'Tümü' ||
    selectedScholarship !== 'Tümü' ||
    minRankFilter !== '' ||
    maxRankFilter !== '' ||
    categoryFilter !== 'all';

  return (
    <div className="space-y-8">
      
      {/* Aktif Sıralama ve Akıllı Kategori Seçim Barı */}
      <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-800 to-brand-950 text-white border border-slate-700/60 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-700/60 pb-3">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-brand-500/20 border border-brand-500/30 flex items-center justify-center text-brand-400">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs text-slate-400 font-semibold block">Aktif İhtimal Analizi:</span>
              <div className="text-base sm:text-lg font-black text-white">
                {activeRank > 0 ? (
                  `${activeRank.toLocaleString('tr-TR')}. Sıralama (${selectedScoreType})`
                ) : (
                  <span className="text-amber-400 font-extrabold text-sm sm:text-base">
                    Henüz Sıralama Girilmedi ({selectedScoreType})
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="text-xs text-slate-300 bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-700/60 flex items-center space-x-1.5 self-start sm:self-auto">
            <Award className="w-4 h-4 text-brand-400" />
            <span>Toplam <strong>{filteredDepartments.length}</strong> bölüm listeleniyor</span>
          </div>
        </div>

        {/* Akıllı Kategori Filtre Butonları */}
        <div className="flex flex-wrap gap-2 pt-1">
          <button
            onClick={() => setCategoryFilter('recommended')}
            className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all flex items-center space-x-1.5 ${
              categoryFilter === 'recommended'
                ? 'bg-brand-600 text-white shadow-lg shadow-brand-600/30 ring-2 ring-brand-500/30'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700 border border-slate-700/60'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>🎯 Tavsiye Edilen Yelpaze (Sıralamama Uygun)</span>
          </button>

          <button
            onClick={() => setCategoryFilter('garanti')}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition-all ${
              categoryFilter === 'garanti'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                : 'bg-slate-800/80 text-emerald-300 hover:bg-slate-700 border border-slate-700/60'
            }`}
          >
            🟢 Garanti / Güvenli (%85+)
          </button>

          <button
            onClick={() => setCategoryFilter('ideal')}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition-all ${
              categoryFilter === 'ideal'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                : 'bg-slate-800/80 text-blue-300 hover:bg-slate-700 border border-slate-700/60'
            }`}
          >
            🔵 İdeal / Dengeli (%35 - %84)
          </button>

          <button
            onClick={() => setCategoryFilter('riskli_hayal')}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition-all ${
              categoryFilter === 'riskli_hayal'
                ? 'bg-orange-600 text-white shadow-md shadow-orange-600/30'
                : 'bg-slate-800/80 text-orange-300 hover:bg-slate-700 border border-slate-700/60'
            }`}
          >
            🟠 Sürpriz / Hayal (&lt;%35)
          </button>

          <button
            onClick={() => setCategoryFilter('all')}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition-all ${
              categoryFilter === 'all'
                ? 'bg-white text-slate-900 shadow-md'
                : 'bg-slate-800/80 text-slate-400 hover:bg-slate-700 border border-slate-700/60'
            }`}
          >
            📋 Tüm Bölümleri Göster
          </button>
        </div>
      </div>

      {/* Arama ve Detaylı Filtre Paneli */}
      <div className="p-5 sm:p-7 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg space-y-5">
        
        {/* Arama Çubuğu */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
            <Search className="w-5 h-5" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Üniversite, bölüm adı, şehir veya kod ile arayın (Örn: Bilgisayar, Tıp, ODTÜ, Boğaziçi, Hacettepe, Ankara)..."
            className="w-full pl-12 pr-10 py-3.5 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-2xl text-sm sm:text-base font-semibold focus:outline-none focus:ring-2 focus:ring-brand-500 text-slate-900 dark:text-white"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Filtre Dropdownları & Seçiciler */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
          
          {/* Puan Türü */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
              Puan Türü
            </label>
            <select
              value={selectedScoreType}
              onChange={(e) => setSelectedScoreType(e.target.value)}
              className="w-full py-2 px-3 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              {SCORE_TYPES.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
          </div>

          {/* Şehir */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
              Şehir
            </label>
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="w-full py-2 px-3 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              <option value="Tümü">Tüm Şehirler</option>
              {CITIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Üniversite Türü */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
              Üniversite Türü
            </label>
            <select
              value={selectedUnivType}
              onChange={(e) => setSelectedUnivType(e.target.value)}
              className="w-full py-2 px-3 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              {UNIVERSITY_TYPES.map((ut) => (
                <option key={ut} value={ut}>
                  {ut}
                </option>
              ))}
            </select>
          </div>

          {/* Burs Durumu */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
              Burs Durumu
            </label>
            <select
              value={selectedScholarship}
              onChange={(e) => setSelectedScholarship(e.target.value)}
              className="w-full py-2 px-3 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              {SCHOLARSHIPS.map((sc) => (
                <option key={sc} value={sc}>
                  {sc}
                </option>
              ))}
            </select>
          </div>

          {/* Sıralama Ölçütü */}
          <div className="col-span-2 sm:col-span-2 md:col-span-4 lg:col-span-1">
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1 flex items-center">
              <ArrowUpDown className="w-3 h-3 mr-1" />
              Sıralama Ölçütü
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full py-2 px-3 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-bold text-brand-700 dark:text-brand-300 focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              <option value="rank_asc">Taban Sıralama (1'den Başla)</option>
              <option value="prob_desc">Yerleşme İhtimali (Yüksekten Düşüğe)</option>
              <option value="rank_desc">Taban Sıralama (Büyükten Küçüğe)</option>
              <option value="score_desc">Taban Puan (Yüksekten Düşüğe)</option>
              <option value="name_asc">Bölüm Adı (A-Z)</option>
            </select>
          </div>

        </div>

        {/* Özel Sıralama Aralığı (Min - Max) */}
        <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
          <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
            Özel Taban Sıralama Aralığı:
          </span>
          <div className="flex items-center space-x-2">
            <input
              type="number"
              placeholder="Min Sıra (Örn: 100000)"
              value={minRankFilter}
              onChange={(e) => setMinRankFilter(e.target.value)}
              className="w-36 px-3 py-1.5 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
            <span className="text-slate-400 text-xs">-</span>
            <input
              type="number"
              placeholder="Max Sıra (Örn: 850000)"
              value={maxRankFilter}
              onChange={(e) => setMaxRankFilter(e.target.value)}
              className="w-36 px-3 py-1.5 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>
        </div>

        {/* Filtre Bilgisi ve Temizleme */}
        {hasActiveFilters && (
          <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
            <span className="text-slate-500 dark:text-slate-400 flex items-center">
              <Filter className="w-3.5 h-3.5 mr-1 text-brand-500" />
              Filtreler uygulandı (<strong>{filteredDepartments.length}</strong> sonuç)
            </span>
            <button
              onClick={clearFilters}
              className="font-bold text-rose-600 dark:text-rose-400 hover:underline"
            >
              Filtreleri Sıfırla
            </button>
          </div>
        )}

      </div>

      {/* Bölüm Kartları Grid */}
      {filteredDepartments.length > 0 ? (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDepartments.slice(0, visibleCount).map((dept) => {
              const deptUserRank = getUserRankForDept(dept.scoreType);
              const probability = calculateProbability(deptUserRank, dept);
              const isInPreferences = preferences.some((p) => p.id === dept.id);

              return (
                <DepartmentCard
                  key={dept.id}
                  department={dept}
                  probability={probability}
                  userRank={deptUserRank}
                  isInPreferences={isInPreferences}
                  onOpenTrendModal={onOpenTrendModal}
                  onTogglePreference={onTogglePreference}
                />
              );
            })}
          </div>

          {/* Daha Fazla Göster & Hepsini Göster Butonları */}
          {visibleCount < filteredDepartments.length && (
            <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
              <button
                onClick={() => setVisibleCount((prev) => prev + 48)}
                className="px-6 py-3 rounded-2xl bg-brand-600 hover:bg-brand-500 text-white font-extrabold text-xs shadow-lg shadow-brand-600/30 transition-all hover:scale-[1.02]"
              >
                Daha Fazla Göster (+48 Bölüm)
              </button>
              <button
                onClick={() => setVisibleCount(filteredDepartments.length)}
                className="px-6 py-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-extrabold text-xs shadow-md hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
              >
                Tümünü Göster ({filteredDepartments.length} Bölüm)
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-16 px-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
          <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 mx-auto">
            <Compass className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-black text-slate-800 dark:text-slate-200">
              Aradığınız Kriterlere Uygun Bölüm Bulunamadı
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">
              Filtreleri genişleterek veya "Tüm Bölümleri Göster" sekmesini seçerek diğer bölümlere göz atabilirsiniz.
            </p>
          </div>
          <button
            onClick={clearFilters}
            className="px-5 py-2.5 rounded-xl bg-brand-600 text-white font-bold text-xs shadow-md shadow-brand-600/30"
          >
            Filtreleri Sıfırla
          </button>
        </div>
      )}

    </div>
  );
};
