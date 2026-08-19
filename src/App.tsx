import { useState, useEffect } from 'react';
import { Department, UserScores, ScoreType } from './types';
import { calculateProbability } from './utils/probability';
import { Header } from './components/Header';
import { ScoreBanner } from './components/ScoreBanner';
import { NetCalculator } from './components/NetCalculator';
import { DirectRankInput } from './components/DirectRankInput';
import { DepartmentExplorer } from './components/DepartmentExplorer';
import { PreferenceListBuilder } from './components/PreferenceListBuilder';
import { TrendModal } from './components/TrendModal';
import { Footer } from './components/Footer';

export function App() {
  // Tema Durumu
  const [isDark, setIsDark] = useState<boolean>(() => {
    const saved = localStorage.getItem('yks_theme');
    if (saved) return saved === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('yks_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('yks_theme', 'light');
    }
  }, [isDark]);

  // Aktif Sekme
  const [activeTab, setActiveTab] = useState<'explorer' | 'calculator' | 'direct' | 'preferences'>('explorer');

  // Kullanıcı Puan & Sıralama Durumu
  const [userScores, setUserScores] = useState<UserScores>(() => {
    const saved = localStorage.getItem('yks_scores');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return {
      diplomaGrade: 80,
      isBrokenObp: false,
      tytScore: 0,
      sayScore: 0,
      eaScore: 0,
      sozScore: 0,
      dilScore: 0,
      tytRank: 0,
      sayRank: 0,
      eaRank: 0,
      sozRank: 0,
      dilRank: 0,
      activeScoreType: 'SAY',
    };
  });

  useEffect(() => {
    localStorage.setItem('yks_scores', JSON.stringify(userScores));
  }, [userScores]);

  // Tercih Listesi Durumu (24'lük Liste)
  const [preferences, setPreferences] = useState<Department[]>(() => {
    const saved = localStorage.getItem('yks_preferences');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem('yks_preferences', JSON.stringify(preferences));
  }, [preferences]);

  // Trend Modalı Durumu
  const [selectedDept, setSelectedDept] = useState<Department | null>(null);
  const [isTrendModalOpen, setIsTrendModalOpen] = useState<boolean>(false);

  // Tercih Ekle / Çıkar
  const handleTogglePreference = (dept: Department) => {
    setPreferences((prev) => {
      const exists = prev.some((p) => p.id === dept.id);
      if (exists) {
        return prev.filter((p) => p.id !== dept.id);
      } else {
        if (prev.length >= 24) {
          alert('ÖSYM kuralları gereği en fazla 24 tercih ekleyebilirsiniz.');
          return prev;
        }
        return [...prev, dept];
      }
    });
  };

  const handleOpenTrendModal = (dept: Department) => {
    setSelectedDept(dept);
    setIsTrendModalOpen(true);
  };

  const activeRank =
    userScores.activeScoreType === 'SAY'
      ? userScores.sayRank
      : userScores.activeScoreType === 'EA'
      ? userScores.eaRank
      : userScores.activeScoreType === 'SOZ'
      ? userScores.sozRank
      : userScores.activeScoreType === 'DIL'
      ? userScores.dilRank
      : userScores.tytRank;

  const getRankForDept = (scoreType?: ScoreType) => {
    if (scoreType === 'SAY') return userScores.sayRank || 0;
    if (scoreType === 'EA') return userScores.eaRank || 0;
    if (scoreType === 'SOZ') return userScores.sozRank || 0;
    if (scoreType === 'DIL') return userScores.dilRank || 0;
    if (scoreType === 'TYT') return userScores.tytRank || 0;
    return activeRank || 0;
  };

  const modalUserRank = selectedDept
    ? getRankForDept(selectedDept.scoreType)
    : activeRank;

  const currentProbability = selectedDept
    ? calculateProbability(modalUserRank, selectedDept)
    : null;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 dark:bg-[#0b0f19] dark:text-slate-100 transition-colors duration-200">
      
      {/* Üst Navigasyon */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isDark={isDark}
        setIsDark={setIsDark}
        preferenceCount={preferences.length}
        userRank={activeRank}
        activeScoreType={userScores.activeScoreType}
      />

      {/* Ana İçerik */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        
        {/* Aktif Sıralama ve Puan Bannerı */}
        <ScoreBanner
          userScores={userScores}
          setUserScores={setUserScores}
          onOpenCalculator={() => setActiveTab('calculator')}
          onOpenDirect={() => setActiveTab('direct')}
        />

        {/* Sekme İçerikleri */}
        {activeTab === 'explorer' && (
          <DepartmentExplorer
            userScores={userScores}
            preferences={preferences}
            onOpenTrendModal={handleOpenTrendModal}
            onTogglePreference={handleTogglePreference}
          />
        )}

        {activeTab === 'calculator' && (
          <NetCalculator
            userScores={userScores}
            setUserScores={setUserScores}
            onExploreDepartments={() => setActiveTab('explorer')}
          />
        )}

        {activeTab === 'direct' && (
          <DirectRankInput
            userScores={userScores}
            setUserScores={setUserScores}
            onExploreDepartments={() => setActiveTab('explorer')}
          />
        )}

        {activeTab === 'preferences' && (
          <PreferenceListBuilder
            preferences={preferences}
            setPreferences={setPreferences}
            userScores={userScores}
            onOpenTrendModal={handleOpenTrendModal}
            onExploreMore={() => setActiveTab('explorer')}
          />
        )}

      </main>

      {/* 5 Yıllık Trend & Detay Modalı */}
      <TrendModal
        department={selectedDept}
        probability={currentProbability}
        userRank={modalUserRank}
        activeScoreType={selectedDept?.scoreType || userScores.activeScoreType}
        isOpen={isTrendModalOpen}
        onClose={() => setIsTrendModalOpen(false)}
        isInPreferences={preferences.some((p) => p.id === selectedDept?.id)}
        onTogglePreference={handleTogglePreference}
      />

      {/* Alt Bilgi */}
      <Footer />

    </div>
  );
}

export default App;
