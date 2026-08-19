import React, { useState } from 'react';
import {
  TytNets,
  AytSayNets,
  AytEaNets,
  AytSozNets,
  YdtNets,
  UserScores,
  ScoreType,
} from '../types';
import {
  calculateTytScore,
  calculateSayScore,
  calculateEaScore,
  calculateSozScore,
  calculateDilScore,
  estimateRankFromScore,
  calculateNet,
} from '../utils/calculator';
import {
  Calculator,
  RotateCcw,
  Sparkles,
  ArrowRight,
  HelpCircle,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface NetCalculatorProps {
  userScores: UserScores;
  setUserScores: React.Dispatch<React.SetStateAction<UserScores>>;
  onExploreDepartments: () => void;
}

export const NetCalculator: React.FC<NetCalculatorProps> = ({
  userScores,
  setUserScores,
  onExploreDepartments,
}) => {
  const [activeTab, setActiveTab] = useState<'TYT' | 'SAY' | 'EA' | 'SOZ' | 'DIL'>('SAY');
  const [diplomaGrade, setDiplomaGrade] = useState<number>(userScores.diplomaGrade || 85);
  const [isBrokenObp, setIsBrokenObp] = useState<boolean>(userScores.isBrokenObp || false);

  // TYT State
  const [tyt, setTyt] = useState<TytNets>({
    turkce: { correct: 32, incorrect: 5 },
    sosyal: {
      tarih: { correct: 4, incorrect: 1 },
      cografya: { correct: 4, incorrect: 1 },
      felsefe: { correct: 3, incorrect: 1 },
      din: { correct: 4, incorrect: 1 },
    },
    matematik: { correct: 28, incorrect: 4 },
    fen: {
      fizik: { correct: 5, incorrect: 2 },
      kimya: { correct: 5, incorrect: 1 },
      biyoloji: { correct: 4, incorrect: 2 },
    },
  });

  // AYT SAY State
  const [aytSay, setAytSay] = useState<AytSayNets>({
    matematik: { correct: 30, incorrect: 4 },
    fizik: { correct: 10, incorrect: 2 },
    kimya: { correct: 9, incorrect: 2 },
    biyoloji: { correct: 9, incorrect: 2 },
  });

  // AYT EA State
  const [aytEa, setAytEa] = useState<AytEaNets>({
    matematik: { correct: 26, incorrect: 4 },
    edebiyat: { correct: 19, incorrect: 3 },
    tarih1: { correct: 7, incorrect: 2 },
    cografya1: { correct: 4, incorrect: 1 },
  });

  // AYT SOZ State
  const [aytSoz, setAytSoz] = useState<AytSozNets>({
    edebiyat: { correct: 20, incorrect: 2 },
    tarih1: { correct: 8, incorrect: 1 },
    cografya1: { correct: 5, incorrect: 1 },
    tarih2: { correct: 8, incorrect: 2 },
    cografya2: { correct: 8, incorrect: 2 },
    felsefe: { correct: 9, incorrect: 2 },
    din: { correct: 5, incorrect: 1 },
  });

  // YDT State
  const [ydt, setYdt] = useState<YdtNets>({
    dil: { correct: 68, incorrect: 6 },
  });

  // Hesaplamaları yap
  const tytResult = calculateTytScore(tyt, diplomaGrade, isBrokenObp);
  const sayResult = calculateSayScore(tyt, aytSay, diplomaGrade, isBrokenObp);
  const eaResult = calculateEaScore(tyt, aytEa, diplomaGrade, isBrokenObp);
  const sozResult = calculateSozScore(tyt, aytSoz, diplomaGrade, isBrokenObp);
  const dilResult = calculateDilScore(tyt, ydt, diplomaGrade, isBrokenObp);

  const tytRank = estimateRankFromScore(tytResult.yerlestirmeScore, 'TYT');
  const sayRank = estimateRankFromScore(sayResult.yerlestirmeScore, 'SAY');
  const eaRank = estimateRankFromScore(eaResult.yerlestirmeScore, 'EA');
  const sozRank = estimateRankFromScore(sozResult.yerlestirmeScore, 'SOZ');
  const dilRank = estimateRankFromScore(dilResult.yerlestirmeScore, 'DIL');

  // Aktif sekmedeki puan ve sıralama
  const currentResult =
    activeTab === 'SAY'
      ? { score: sayResult.yerlestirmeScore, ham: sayResult.hamScore, rank: sayRank, net: sayResult.aytTotalNet }
      : activeTab === 'EA'
      ? { score: eaResult.yerlestirmeScore, ham: eaResult.hamScore, rank: eaRank, net: eaResult.aytTotalNet }
      : activeTab === 'SOZ'
      ? { score: sozResult.yerlestirmeScore, ham: sozResult.hamScore, rank: sozRank, net: sozResult.aytTotalNet }
      : activeTab === 'DIL'
      ? { score: dilResult.yerlestirmeScore, ham: dilResult.hamScore, rank: dilRank, net: calculateNet(ydt.dil.correct, ydt.dil.incorrect) }
      : { score: tytResult.yerlestirmeScore, ham: tytResult.hamScore, rank: tytRank, net: tytResult.totalNet };

  const handleApplyScores = () => {
    setUserScores({
      diplomaGrade,
      isBrokenObp,
      tytScore: tytResult.yerlestirmeScore,
      sayScore: sayResult.yerlestirmeScore,
      eaScore: eaResult.yerlestirmeScore,
      sozScore: sozResult.yerlestirmeScore,
      dilScore: dilResult.yerlestirmeScore,
      tytRank,
      sayRank,
      eaRank,
      sozRank,
      dilRank,
      activeScoreType: activeTab as ScoreType,
    });

    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.7 },
    });

    onExploreDepartments();
  };

  const handleReset = () => {
    setTyt({
      turkce: { correct: 0, incorrect: 0 },
      sosyal: {
        tarih: { correct: 0, incorrect: 0 },
        cografya: { correct: 0, incorrect: 0 },
        felsefe: { correct: 0, incorrect: 0 },
        din: { correct: 0, incorrect: 0 },
      },
      matematik: { correct: 0, incorrect: 0 },
      fen: {
        fizik: { correct: 0, incorrect: 0 },
        kimya: { correct: 0, incorrect: 0 },
        biyoloji: { correct: 0, incorrect: 0 },
      },
    });
    setAytSay({
      matematik: { correct: 0, incorrect: 0 },
      fizik: { correct: 0, incorrect: 0 },
      kimya: { correct: 0, incorrect: 0 },
      biyoloji: { correct: 0, incorrect: 0 },
    });
    setAytEa({
      matematik: { correct: 0, incorrect: 0 },
      edebiyat: { correct: 0, incorrect: 0 },
      tarih1: { correct: 0, incorrect: 0 },
      cografya1: { correct: 0, incorrect: 0 },
    });
    setAytSoz({
      edebiyat: { correct: 0, incorrect: 0 },
      tarih1: { correct: 0, incorrect: 0 },
      cografya1: { correct: 0, incorrect: 0 },
      tarih2: { correct: 0, incorrect: 0 },
      cografya2: { correct: 0, incorrect: 0 },
      felsefe: { correct: 0, incorrect: 0 },
      din: { correct: 0, incorrect: 0 },
    });
    setYdt({
      dil: { correct: 0, incorrect: 0 },
    });
  };

  // Helper input bileşeni
  const NetInputRow = ({
    title,
    maxQuestions,
    correct,
    incorrect,
    onChangeCorrect,
    onChangeIncorrect,
  }: {
    title: string;
    maxQuestions: number;
    correct: number;
    incorrect: number;
    onChangeCorrect: (v: number) => void;
    onChangeIncorrect: (v: number) => void;
  }) => {
    const net = calculateNet(correct, incorrect);
    return (
      <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 hover:border-brand-500/40 transition-colors gap-2">
        <div className="flex items-center space-x-2">
          <span className="font-semibold text-sm text-slate-800 dark:text-slate-200">{title}</span>
          <span className="text-xs text-slate-400">({maxQuestions} Soru)</span>
        </div>

        <div className="flex items-center space-x-2 sm:space-x-3">
          <div className="flex items-center space-x-1">
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">D:</span>
            <input
              type="number"
              min={0}
              max={maxQuestions}
              value={correct === 0 ? '' : correct}
              placeholder="0"
              onChange={(e) => onChangeCorrect(Math.min(maxQuestions, Math.max(0, parseInt(e.target.value) || 0)))}
              className="w-14 sm:w-16 px-2 py-1 text-center font-bold text-sm bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 text-slate-900 dark:text-white"
            />
          </div>

          <div className="flex items-center space-x-1">
            <span className="text-xs font-bold text-rose-600 dark:text-rose-400">Y:</span>
            <input
              type="number"
              min={0}
              max={maxQuestions}
              value={incorrect === 0 ? '' : incorrect}
              placeholder="0"
              onChange={(e) => onChangeIncorrect(Math.min(maxQuestions - correct, Math.max(0, parseInt(e.target.value) || 0)))}
              className="w-14 sm:w-16 px-2 py-1 text-center font-bold text-sm bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 text-slate-900 dark:text-white"
            />
          </div>

          <div className="w-16 sm:w-20 text-right">
            <span className="text-xs text-slate-400 mr-1">Net:</span>
            <span className="font-extrabold text-sm text-brand-600 dark:text-brand-400">{net}</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      
      {/* Başlık ve Açıklama */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-brand-100 dark:bg-brand-950/60 text-brand-700 dark:text-brand-300 text-xs font-bold border border-brand-200 dark:border-brand-800">
          <Calculator className="w-3.5 h-3.5" />
          <span>ÖSYM Standart Katsayıları ile Gerçekçi Hesaplama</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
          YKS Net ve Puan Hesaplama Modülü
        </h2>
        <p className="text-slate-600 dark:text-slate-400 text-sm max-w-2xl mx-auto">
          Derslerin doğru ve yanlış sayılarını girin; ham puan, yerleştirme puanı ve geçmiş yığılma verilerine göre tahmini Türkiye sıralamanızı anında görün.
        </p>
      </div>

      {/* Ana Grid: Form ve Canlı Sonuç Kartı */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Sol Alan: Net Giriş Tabları ve Formları (2 Kolon) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Alan Seçim Tabları */}
          <div className="flex flex-wrap gap-2 p-1.5 rounded-2xl bg-slate-200/70 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700">
            {(['SAY', 'EA', 'SOZ', 'DIL', 'TYT'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 min-w-[70px] py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all ${
                  activeTab === tab
                    ? 'bg-brand-600 text-white shadow-md shadow-brand-600/30'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {tab === 'SAY' && 'Sayısal (SAY)'}
                {tab === 'EA' && 'Eşit Ağırlık (EA)'}
                {tab === 'SOZ' && 'Sözel (SÖZ)'}
                {tab === 'DIL' && 'Yabancı Dil (DİL)'}
                {tab === 'TYT' && 'Sadece TYT'}
              </button>
            ))}
          </div>

          {/* OBP ve Diploma Notu Ayarı */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-bold text-sm text-slate-800 dark:text-slate-200 flex items-center">
                <Sparkles className="w-4 h-4 mr-2 text-brand-500" />
                Okul Başarı Puanı (OBP) / Diploma Notu
              </span>
              <span className="text-xs font-bold text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-950/40 px-2.5 py-1 rounded-lg border border-brand-200 dark:border-brand-800">
                OBP Katkısı: +{tytResult.obpKatki} Puan
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5">
                  Lise Diploma Notu (50 - 100):
                </label>
                <div className="flex items-center space-x-3">
                  <input
                    type="range"
                    min={50}
                    max={100}
                    step={0.5}
                    value={diplomaGrade}
                    onChange={(e) => setDiplomaGrade(parseFloat(e.target.value))}
                    className="w-full accent-brand-600"
                  />
                  <span className="w-12 text-center font-bold text-sm text-slate-800 dark:text-white">
                    {diplomaGrade}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end space-x-3 pt-2 sm:pt-4">
                <label className="text-xs font-medium text-slate-600 dark:text-slate-300 cursor-pointer select-none">
                  Önceki yıl üniversiteye yerleştim (Kırık OBP)
                </label>
                <input
                  type="checkbox"
                  checked={isBrokenObp}
                  onChange={(e) => setIsBrokenObp(e.target.checked)}
                  className="w-5 h-5 rounded text-brand-600 focus:ring-brand-500 accent-brand-600 cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* TYT Netleri Formu (Her zaman görünür) */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                  1. Oturum: Temel Yeterlilik Testi (TYT)
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">120 Soru Üzerinden</p>
              </div>
              <div className="text-right">
                <span className="text-xs text-slate-400">Toplam TYT Neti:</span>
                <div className="text-lg font-black text-brand-600 dark:text-brand-400">
                  {tytResult.totalNet}
                </div>
              </div>
            </div>

            <div className="space-y-2.5">
              <NetInputRow
                title="Türkçe"
                maxQuestions={40}
                correct={tyt.turkce.correct}
                incorrect={tyt.turkce.incorrect}
                onChangeCorrect={(v) => setTyt({ ...tyt, turkce: { ...tyt.turkce, correct: v } })}
                onChangeIncorrect={(v) => setTyt({ ...tyt, turkce: { ...tyt.turkce, incorrect: v } })}
              />

              <NetInputRow
                title="Temel Matematik"
                maxQuestions={40}
                correct={tyt.matematik.correct}
                incorrect={tyt.matematik.incorrect}
                onChangeCorrect={(v) => setTyt({ ...tyt, matematik: { ...tyt.matematik, correct: v } })}
                onChangeIncorrect={(v) => setTyt({ ...tyt, matematik: { ...tyt.matematik, incorrect: v } })}
              />

              {/* Sosyal Bilimler Accordion / Grubu */}
              <div className="border border-slate-200 dark:border-slate-800 rounded-xl p-3 bg-slate-50/50 dark:bg-slate-800/30 space-y-2">
                <div className="flex justify-between items-center text-xs font-bold text-slate-700 dark:text-slate-300">
                  <span>Sosyal Bilimler (20 Soru)</span>
                  <span className="text-brand-600 dark:text-brand-400">Net: {tytResult.sosyalNet}</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <NetInputRow
                    title="Tarih"
                    maxQuestions={5}
                    correct={tyt.sosyal.tarih.correct}
                    incorrect={tyt.sosyal.tarih.incorrect}
                    onChangeCorrect={(v) => setTyt({ ...tyt, sosyal: { ...tyt.sosyal, tarih: { ...tyt.sosyal.tarih, correct: v } } })}
                    onChangeIncorrect={(v) => setTyt({ ...tyt, sosyal: { ...tyt.sosyal, tarih: { ...tyt.sosyal.tarih, incorrect: v } } })}
                  />
                  <NetInputRow
                    title="Coğrafya"
                    maxQuestions={5}
                    correct={tyt.sosyal.cografya.correct}
                    incorrect={tyt.sosyal.cografya.incorrect}
                    onChangeCorrect={(v) => setTyt({ ...tyt, sosyal: { ...tyt.sosyal, cografya: { ...tyt.sosyal.cografya, correct: v } } })}
                    onChangeIncorrect={(v) => setTyt({ ...tyt, sosyal: { ...tyt.sosyal, cografya: { ...tyt.sosyal.cografya, incorrect: v } } })}
                  />
                  <NetInputRow
                    title="Felsefe"
                    maxQuestions={5}
                    correct={tyt.sosyal.felsefe.correct}
                    incorrect={tyt.sosyal.felsefe.incorrect}
                    onChangeCorrect={(v) => setTyt({ ...tyt, sosyal: { ...tyt.sosyal, felsefe: { ...tyt.sosyal.felsefe, correct: v } } })}
                    onChangeIncorrect={(v) => setTyt({ ...tyt, sosyal: { ...tyt.sosyal, felsefe: { ...tyt.sosyal.felsefe, incorrect: v } } })}
                  />
                  <NetInputRow
                    title="Din Kültürü"
                    maxQuestions={5}
                    correct={tyt.sosyal.din.correct}
                    incorrect={tyt.sosyal.din.incorrect}
                    onChangeCorrect={(v) => setTyt({ ...tyt, sosyal: { ...tyt.sosyal, din: { ...tyt.sosyal.din, correct: v } } })}
                    onChangeIncorrect={(v) => setTyt({ ...tyt, sosyal: { ...tyt.sosyal, din: { ...tyt.sosyal.din, incorrect: v } } })}
                  />
                </div>
              </div>

              {/* Fen Bilimleri Grubu */}
              <div className="border border-slate-200 dark:border-slate-800 rounded-xl p-3 bg-slate-50/50 dark:bg-slate-800/30 space-y-2">
                <div className="flex justify-between items-center text-xs font-bold text-slate-700 dark:text-slate-300">
                  <span>Fen Bilimleri (20 Soru)</span>
                  <span className="text-brand-600 dark:text-brand-400">Net: {tytResult.fenNet}</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <NetInputRow
                    title="Fizik"
                    maxQuestions={7}
                    correct={tyt.fen.fizik.correct}
                    incorrect={tyt.fen.fizik.incorrect}
                    onChangeCorrect={(v) => setTyt({ ...tyt, fen: { ...tyt.fen, fizik: { ...tyt.fen.fizik, correct: v } } })}
                    onChangeIncorrect={(v) => setTyt({ ...tyt, fen: { ...tyt.fen, fizik: { ...tyt.fen.fizik, incorrect: v } } })}
                  />
                  <NetInputRow
                    title="Kimya"
                    maxQuestions={7}
                    correct={tyt.fen.kimya.correct}
                    incorrect={tyt.fen.kimya.incorrect}
                    onChangeCorrect={(v) => setTyt({ ...tyt, fen: { ...tyt.fen, kimya: { ...tyt.fen.kimya, correct: v } } })}
                    onChangeIncorrect={(v) => setTyt({ ...tyt, fen: { ...tyt.fen, kimya: { ...tyt.fen.kimya, incorrect: v } } })}
                  />
                  <NetInputRow
                    title="Biyoloji"
                    maxQuestions={6}
                    correct={tyt.fen.biyoloji.correct}
                    incorrect={tyt.fen.biyoloji.incorrect}
                    onChangeCorrect={(v) => setTyt({ ...tyt, fen: { ...tyt.fen, biyoloji: { ...tyt.fen.biyoloji, correct: v } } })}
                    onChangeIncorrect={(v) => setTyt({ ...tyt, fen: { ...tyt.fen, biyoloji: { ...tyt.fen.biyoloji, incorrect: v } } })}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* AYT / YDT Alanına Özel Form */}
          {activeTab === 'SAY' && (
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <div>
                  <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                    2. Oturum: AYT Sayısal Testleri
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Matematik & Fen Bilimleri</p>
                </div>
                <div className="text-right">
                  <span className="text-xs text-slate-400">AYT Sayısal Neti:</span>
                  <div className="text-lg font-black text-brand-600 dark:text-brand-400">
                    {sayResult.aytTotalNet}
                  </div>
                </div>
              </div>

              <div className="space-y-2.5">
                <NetInputRow
                  title="AYT Matematik"
                  maxQuestions={40}
                  correct={aytSay.matematik.correct}
                  incorrect={aytSay.matematik.incorrect}
                  onChangeCorrect={(v) => setAytSay({ ...aytSay, matematik: { ...aytSay.matematik, correct: v } })}
                  onChangeIncorrect={(v) => setAytSay({ ...aytSay, matematik: { ...aytSay.matematik, incorrect: v } })}
                />
                <NetInputRow
                  title="AYT Fizik"
                  maxQuestions={14}
                  correct={aytSay.fizik.correct}
                  incorrect={aytSay.fizik.incorrect}
                  onChangeCorrect={(v) => setAytSay({ ...aytSay, fizik: { ...aytSay.fizik, correct: v } })}
                  onChangeIncorrect={(v) => setAytSay({ ...aytSay, fizik: { ...aytSay.fizik, incorrect: v } })}
                />
                <NetInputRow
                  title="AYT Kimya"
                  maxQuestions={13}
                  correct={aytSay.kimya.correct}
                  incorrect={aytSay.kimya.incorrect}
                  onChangeCorrect={(v) => setAytSay({ ...aytSay, kimya: { ...aytSay.kimya, correct: v } })}
                  onChangeIncorrect={(v) => setAytSay({ ...aytSay, kimya: { ...aytSay.kimya, incorrect: v } })}
                />
                <NetInputRow
                  title="AYT Biyoloji"
                  maxQuestions={13}
                  correct={aytSay.biyoloji.correct}
                  incorrect={aytSay.biyoloji.incorrect}
                  onChangeCorrect={(v) => setAytSay({ ...aytSay, biyoloji: { ...aytSay.biyoloji, correct: v } })}
                  onChangeIncorrect={(v) => setAytSay({ ...aytSay, biyoloji: { ...aytSay.biyoloji, incorrect: v } })}
                />
              </div>
            </div>
          )}

          {activeTab === 'EA' && (
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <div>
                  <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                    2. Oturum: AYT Eşit Ağırlık Testleri
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Matematik & Türk Dili ve Edebiyatı - Sosyal 1</p>
                </div>
                <div className="text-right">
                  <span className="text-xs text-slate-400">AYT EA Neti:</span>
                  <div className="text-lg font-black text-brand-600 dark:text-brand-400">
                    {eaResult.aytTotalNet}
                  </div>
                </div>
              </div>

              <div className="space-y-2.5">
                <NetInputRow
                  title="AYT Matematik"
                  maxQuestions={40}
                  correct={aytEa.matematik.correct}
                  incorrect={aytEa.matematik.incorrect}
                  onChangeCorrect={(v) => setAytEa({ ...aytEa, matematik: { ...aytEa.matematik, correct: v } })}
                  onChangeIncorrect={(v) => setAytEa({ ...aytEa, matematik: { ...aytEa.matematik, incorrect: v } })}
                />
                <NetInputRow
                  title="Edebiyat"
                  maxQuestions={24}
                  correct={aytEa.edebiyat.correct}
                  incorrect={aytEa.edebiyat.incorrect}
                  onChangeCorrect={(v) => setAytEa({ ...aytEa, edebiyat: { ...aytEa.edebiyat, correct: v } })}
                  onChangeIncorrect={(v) => setAytEa({ ...aytEa, edebiyat: { ...aytEa.edebiyat, incorrect: v } })}
                />
                <NetInputRow
                  title="Tarih-1"
                  maxQuestions={10}
                  correct={aytEa.tarih1.correct}
                  incorrect={aytEa.tarih1.incorrect}
                  onChangeCorrect={(v) => setAytEa({ ...aytEa, tarih1: { ...aytEa.tarih1, correct: v } })}
                  onChangeIncorrect={(v) => setAytEa({ ...aytEa, tarih1: { ...aytEa.tarih1, incorrect: v } })}
                />
                <NetInputRow
                  title="Coğrafya-1"
                  maxQuestions={6}
                  correct={aytEa.cografya1.correct}
                  incorrect={aytEa.cografya1.incorrect}
                  onChangeCorrect={(v) => setAytEa({ ...aytEa, cografya1: { ...aytEa.cografya1, correct: v } })}
                  onChangeIncorrect={(v) => setAytEa({ ...aytEa, cografya1: { ...aytEa.cografya1, incorrect: v } })}
                />
              </div>
            </div>
          )}

          {activeTab === 'SOZ' && (
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <div>
                  <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                    2. Oturum: AYT Sözel Testleri
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Edebiyat, Tarih, Coğrafya, Felsefe, Din</p>
                </div>
                <div className="text-right">
                  <span className="text-xs text-slate-400">AYT Sözel Neti:</span>
                  <div className="text-lg font-black text-brand-600 dark:text-brand-400">
                    {sozResult.aytTotalNet}
                  </div>
                </div>
              </div>

              <div className="space-y-2.5">
                <NetInputRow
                  title="Edebiyat"
                  maxQuestions={24}
                  correct={aytSoz.edebiyat.correct}
                  incorrect={aytSoz.edebiyat.incorrect}
                  onChangeCorrect={(v) => setAytSoz({ ...aytSoz, edebiyat: { ...aytSoz.edebiyat, correct: v } })}
                  onChangeIncorrect={(v) => setAytSoz({ ...aytSoz, edebiyat: { ...aytSoz.edebiyat, incorrect: v } })}
                />
                <NetInputRow
                  title="Tarih-1"
                  maxQuestions={10}
                  correct={aytSoz.tarih1.correct}
                  incorrect={aytSoz.tarih1.incorrect}
                  onChangeCorrect={(v) => setAytSoz({ ...aytSoz, tarih1: { ...aytSoz.tarih1, correct: v } })}
                  onChangeIncorrect={(v) => setAytSoz({ ...aytSoz, tarih1: { ...aytSoz.tarih1, incorrect: v } })}
                />
                <NetInputRow
                  title="Coğrafya-1"
                  maxQuestions={6}
                  correct={aytSoz.cografya1.correct}
                  incorrect={aytSoz.cografya1.incorrect}
                  onChangeCorrect={(v) => setAytSoz({ ...aytSoz, cografya1: { ...aytSoz.cografya1, correct: v } })}
                  onChangeIncorrect={(v) => setAytSoz({ ...aytSoz, cografya1: { ...aytSoz.cografya1, incorrect: v } })}
                />
                <NetInputRow
                  title="Tarih-2"
                  maxQuestions={11}
                  correct={aytSoz.tarih2.correct}
                  incorrect={aytSoz.tarih2.incorrect}
                  onChangeCorrect={(v) => setAytSoz({ ...aytSoz, tarih2: { ...aytSoz.tarih2, correct: v } })}
                  onChangeIncorrect={(v) => setAytSoz({ ...aytSoz, tarih2: { ...aytSoz.tarih2, incorrect: v } })}
                />
                <NetInputRow
                  title="Coğrafya-2"
                  maxQuestions={11}
                  correct={aytSoz.cografya2.correct}
                  incorrect={aytSoz.cografya2.incorrect}
                  onChangeCorrect={(v) => setAytSoz({ ...aytSoz, cografya2: { ...aytSoz.cografya2, correct: v } })}
                  onChangeIncorrect={(v) => setAytSoz({ ...aytSoz, cografya2: { ...aytSoz.cografya2, incorrect: v } })}
                />
                <NetInputRow
                  title="Felsefe Grubu"
                  maxQuestions={12}
                  correct={aytSoz.felsefe.correct}
                  incorrect={aytSoz.felsefe.incorrect}
                  onChangeCorrect={(v) => setAytSoz({ ...aytSoz, felsefe: { ...aytSoz.felsefe, correct: v } })}
                  onChangeIncorrect={(v) => setAytSoz({ ...aytSoz, felsefe: { ...aytSoz.felsefe, incorrect: v } })}
                />
                <NetInputRow
                  title="Din Kültürü / Ek Felsefe"
                  maxQuestions={6}
                  correct={aytSoz.din.correct}
                  incorrect={aytSoz.din.incorrect}
                  onChangeCorrect={(v) => setAytSoz({ ...aytSoz, din: { ...aytSoz.din, correct: v } })}
                  onChangeIncorrect={(v) => setAytSoz({ ...aytSoz, din: { ...aytSoz.din, incorrect: v } })}
                />
              </div>
            </div>
          )}

          {activeTab === 'DIL' && (
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <div>
                  <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                    3. Oturum: Yabancı Dil Testi (YDT)
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">İngilizce / Almanca / Fransızca vb.</p>
                </div>
                <div className="text-right">
                  <span className="text-xs text-slate-400">YDT Neti:</span>
                  <div className="text-lg font-black text-brand-600 dark:text-brand-400">
                    {calculateNet(ydt.dil.correct, ydt.dil.incorrect)}
                  </div>
                </div>
              </div>

              <NetInputRow
                title="YDT Dil Sınavı"
                maxQuestions={80}
                correct={ydt.dil.correct}
                incorrect={ydt.dil.incorrect}
                onChangeCorrect={(v) => setYdt({ ...ydt, dil: { ...ydt.dil, correct: v } })}
                onChangeIncorrect={(v) => setYdt({ ...ydt, dil: { ...ydt.dil, incorrect: v } })}
              />
            </div>
          )}

          {/* Hızlı Temizle Butonu */}
          <div className="flex justify-end">
            <button
              onClick={handleReset}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Tüm Netleri Sıfırla</span>
            </button>
          </div>

        </div>

        {/* Sağ Alan: Hesaplanan Puan & Sıralama Sonuç Kartı (Sticky) */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 space-y-6">
            
            <div className="rounded-3xl bg-gradient-to-b from-slate-900 via-slate-800 to-brand-950 text-white p-6 sm:p-7 shadow-2xl border border-slate-700/60 relative overflow-hidden">
              <div className="absolute -right-12 -top-12 w-40 h-40 bg-brand-500/20 rounded-full blur-3xl" />
              
              <div className="relative z-10 space-y-6">
                
                <div className="flex items-center justify-between border-b border-slate-700/60 pb-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-brand-400">
                    {activeTab} Sonuç Özeti
                  </span>
                  <span className="text-[11px] font-semibold bg-brand-500/20 text-brand-300 px-2 py-0.5 rounded-md border border-brand-500/30">
                    ÖSYM 2024 Modeli
                  </span>
                </div>

                {/* Tahmini Sıralama */}
                <div className="text-center py-2">
                  <span className="text-xs text-slate-300 font-medium">Tahmini Türkiye Sıralamanız</span>
                  <div className="text-4xl sm:text-5xl font-black text-white tracking-tight mt-1 bg-gradient-to-r from-white via-amber-200 to-orange-300 bg-clip-text text-transparent">
                    {currentResult.rank.toLocaleString('tr-TR')}
                  </div>
                  <span className="inline-block mt-2 text-xs font-medium text-slate-400">
                    {activeTab} Puan Türünde
                  </span>
                </div>

                {/* Puan ve Net Detayları */}
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/60 text-center">
                    <span className="text-[11px] text-slate-400 block">Yerleştirme Puanı</span>
                    <span className="text-lg font-bold text-amber-400">
                      {currentResult.score.toFixed(2)}
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/60 text-center">
                    <span className="text-[11px] text-slate-400 block">Ham Puan</span>
                    <span className="text-lg font-bold text-slate-200">
                      {currentResult.ham.toFixed(2)}
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/60 text-center">
                    <span className="text-[11px] text-slate-400 block">TYT Toplam Net</span>
                    <span className="text-lg font-bold text-emerald-400">
                      {tytResult.totalNet}
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/60 text-center">
                    <span className="text-[11px] text-slate-400 block">
                      {activeTab === 'TYT' ? 'Sosyal+Fen' : 'AYT Toplam Net'}
                    </span>
                    <span className="text-lg font-bold text-brand-400">
                      {activeTab === 'TYT' ? (tytResult.sosyalNet + tytResult.fenNet).toFixed(2) : currentResult.net}
                    </span>
                  </div>
                </div>

                {/* Buton: Bu Sıralama İle İncele */}
                <button
                  onClick={handleApplyScores}
                  className="w-full flex items-center justify-center space-x-2 py-3.5 px-4 rounded-xl bg-brand-600 hover:bg-brand-500 font-extrabold text-sm text-white shadow-lg shadow-brand-600/30 hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                  <span>Bu Sıralama ile Bölümleri Keşfet</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <div className="flex items-center justify-center space-x-1.5 text-[11px] text-slate-400 text-center">
                  <HelpCircle className="w-3.5 h-3.5" />
                  <span>Sıralama tahmini ÖSYM yığılma verilerine dayanır.</span>
                </div>

              </div>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
};
