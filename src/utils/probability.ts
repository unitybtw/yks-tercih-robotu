import { Department, ProbabilityAnalysis, ProbabilityCategory } from '../types';

export const calculateProbability = (
  userRank: number,
  department: Department
): ProbabilityAnalysis => {
  if (!userRank || userRank <= 0) {
    return {
      percentage: 50,
      category: 'dengeli',
      categoryTitle: 'Sıralama Belirtilmedi',
      categoryColor: 'bg-slate-500 text-white',
      trendSlope: 'stabil',
      trendText: 'Stabil',
      rankDiff: 0,
      rankDiffPercentage: 0,
      advice: 'Lütfen netlerinizi hesaplayın veya tahmini YKS sıralamanızı girin.',
      riskScore: 5,
    };
  }

  const history = [...department.history].sort((a, b) => a.year - b.year);
  const actualHistory = history.filter((h) => h.year <= 2024 && h.baseRank > 0);

  if (actualHistory.length === 0) {
    return {
      percentage: 50,
      category: 'dengeli',
      categoryTitle: 'Veri Yetersiz',
      categoryColor: 'bg-slate-500 text-white',
      trendSlope: 'stabil',
      trendText: 'Veri Yetersiz',
      rankDiff: 0,
      rankDiffPercentage: 0,
      advice: 'Bu bölüm için geçmiş yıllara ait yeterli taban sıralama verisi bulunamadı.',
      riskScore: 5,
    };
  }

  const latest2024Data = actualHistory[actualHistory.length - 1];
  const oldestData = actualHistory[0];
  const lastYearRank = latest2024Data.baseRank; // 2024 gerçek taban sıralama

  // Yıllık Sıralama Değişim Eğimi
  const yearsDelta = actualHistory.length > 1 ? actualHistory.length - 1 : 1;
  const annualRankShift = (lastYearRank - oldestData.baseRank) / yearsDelta;

  let trendSlope: ProbabilityAnalysis['trendSlope'] = 'stabil';
  let trendText = 'Stabil Seyrediyor';

  // Sıralama sayısının küçülmesi (negatif shift) -> Bölüm popülerleşiyor, sıralama yükseliyor!
  if (annualRankShift < -2500) {
    trendSlope = 'hizli_yukselis';
    trendText = 'Hızla Yükselişte (Zorlaşıyor)';
  } else if (annualRankShift < -400) {
    trendSlope = 'hafif_yukselis';
    trendText = 'Yükseliş Trendinde (Talep Artıyor)';
  } else if (annualRankShift > 2500) {
    trendSlope = 'hizli_dusus';
    trendText = 'Sıralaması Geriliyor (Kolaylaşıyor)';
  } else if (annualRankShift > 400) {
    trendSlope = 'hafif_dusus';
    trendText = 'Hafif Geri Çekilme Var';
  }

  // 2025 Tahmini Taban Sıralaması
  const projectedRank = Math.max(
    1,
    Math.round(lastYearRank + annualRankShift * 0.5)
  );

  // Güvenlik Marjı: (Tahmini Taban - Kullanıcı Sıralaması) / Tahmini Taban
  const safetyMargin = (projectedRank - userRank) / projectedRank;
  const rankDiff = lastYearRank - userRank;
  const rankDiffPercentage = parseFloat(((rankDiff / lastYearRank) * 100).toFixed(1));

  let rawPercentage = 50;

  if (safetyMargin >= 0.35) {
    // Tabanın en az %35 önünde -> %95 - %99
    rawPercentage = 95 + Math.min(4, (safetyMargin - 0.35) * 8);
  } else if (safetyMargin >= 0.15) {
    // Tabanın %15 - %35 önünde -> %85 - %94
    rawPercentage = 85 + ((safetyMargin - 0.15) / 0.20) * 9;
  } else if (safetyMargin >= 0.00) {
    // Tabanın %0 - %15 önünde -> %65 - %84
    rawPercentage = 65 + (safetyMargin / 0.15) * 19;
  } else if (safetyMargin >= -0.10) {
    // Tabanın %0 - %10 gerisinde -> %45 - %64
    rawPercentage = 45 + ((safetyMargin + 0.10) / 0.10) * 19;
  } else if (safetyMargin >= -0.25) {
    // Tabanın %10 - %25 gerisinde -> %20 - %44
    rawPercentage = 20 + ((safetyMargin + 0.25) / 0.15) * 24;
  } else if (safetyMargin >= -0.50) {
    // Tabanın %25 - %50 gerisinde -> %5 - %19
    rawPercentage = 5 + ((safetyMargin + 0.50) / 0.25) * 14;
  } else {
    // Tabanın %50'den fazla gerisinde -> %1 - %4
    rawPercentage = Math.max(1, 4 + safetyMargin * 2);
  }

  // Trend düzeltmesi (Eğer bölüm hızla yükseliyorsa ihtimal %5 düşer, geriliyorsa %5 artar)
  if (trendSlope === 'hizli_yukselis' && rawPercentage > 10) {
    rawPercentage -= 5;
  } else if (trendSlope === 'hizli_dusus' && rawPercentage < 90) {
    rawPercentage += 5;
  }

  const percentage = Math.min(99, Math.max(1, Math.round(rawPercentage)));

  let category: ProbabilityCategory = 'dengeli';
  let categoryTitle = 'Dengeli / Kritik';
  let categoryColor = 'bg-amber-500 text-white';
  let riskScore = 5;
  let advice = '';

  if (percentage >= 85) {
    category = 'garanti';
    categoryTitle = 'Çok Yüksek / Güvenli Liman';
    categoryColor = 'bg-emerald-600 text-white';
    riskScore = 2;
    advice = `Sıralamanız (${userRank.toLocaleString('tr-TR')}), bu bölümün 2024 taban sıralamasının (${lastYearRank.toLocaleString('tr-TR')}) oldukça önündedir. Tercih listenizde güvenli liman (garanti) tercihi olarak rahatlıkla yazabilirsiniz.`;
  } else if (percentage >= 60) {
    category = 'ideal';
    categoryTitle = 'Yüksek İhtimal / İdeal Tercih';
    categoryColor = 'bg-blue-600 text-white';
    riskScore = 4;
    advice = `Sıralamanız bölümün taban sıralamasına göre avantajlı konumdadır. Listenizin orta sıralarında güçlü bir yerleşme adayı olarak değerlendirebilirsiniz.`;
  } else if (percentage >= 35) {
    category = 'dengeli';
    categoryTitle = 'Orta İhtimal / Dengeli Tercih';
    categoryColor = 'bg-amber-500 text-white';
    riskScore = 6;
    advice = `Sıralamanız (${userRank.toLocaleString('tr-TR')}) ile bölümün 2024 tabanı (${lastYearRank.toLocaleString('tr-TR')}) birbirine çok yakın. Kontenjan ve tercih eğilimlerine göre yerleşme şansınız bulunmaktadır.`;
  } else if (percentage >= 15) {
    category = 'riskli';
    categoryTitle = 'Düşük İhtimal / Sürpriz Tercih';
    categoryColor = 'bg-orange-500 text-white';
    riskScore = 8;
    advice = `Bölümün tabanı (${lastYearRank.toLocaleString('tr-TR')}) sıralamanızın önündedir. Sürpriz kontenjan veya tercih kaymalarında gelme ihtimali vardır. Listenizin ilk 3-4 sırasına cesurca yazabilirsiniz.`;
  } else {
    category = 'hayal';
    categoryTitle = 'Çok Düşük / Hayal Tercih';
    categoryColor = 'bg-rose-600 text-white';
    riskScore = 10;
    advice = `Sıralamanız (${userRank.toLocaleString('tr-TR')}) ile bölümün 2024 tabanı (${lastYearRank.toLocaleString('tr-TR')}) arasında belirgin bir fark var. Listenizin en başına moral/hayal tercihi olarak 1-2 adet ekleyebilirsiniz.`;
  }

  return {
    percentage,
    category,
    categoryTitle,
    categoryColor,
    trendSlope,
    trendText,
    rankDiff,
    rankDiffPercentage,
    advice,
    riskScore,
  };
};
