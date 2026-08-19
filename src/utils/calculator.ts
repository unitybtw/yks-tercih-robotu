import { TytNets, AytSayNets, AytEaNets, AytSozNets, YdtNets, ScoreType } from '../types';

export const calculateNet = (correct: number, incorrect: number): number => {
  const net = (correct || 0) - (incorrect || 0) * 0.25;
  return Math.max(0, parseFloat(net.toFixed(2)));
};

// OBP Katkısı Hesaplama
export const calculateObpScore = (diplomaGrade: number, isBroken: boolean = false): number => {
  const obp = Math.min(100, Math.max(50, diplomaGrade || 50)) * 5; // 250 - 500 arası
  const multiplier = isBroken ? 0.06 : 0.12;
  return parseFloat((obp * multiplier).toFixed(2));
};

// TYT Puanı Hesaplama
export const calculateTytScore = (tyt: TytNets, diplomaGrade: number, isBroken: boolean) => {
  const turkceNet = calculateNet(tyt.turkce.correct, tyt.turkce.incorrect);
  const sosyalNet =
    calculateNet(tyt.sosyal.tarih.correct, tyt.sosyal.tarih.incorrect) +
    calculateNet(tyt.sosyal.cografya.correct, tyt.sosyal.cografya.incorrect) +
    calculateNet(tyt.sosyal.felsefe.correct, tyt.sosyal.felsefe.incorrect) +
    calculateNet(tyt.sosyal.din.correct, tyt.sosyal.din.incorrect);
  const matNet = calculateNet(tyt.matematik.correct, tyt.matematik.incorrect);
  const fenNet =
    calculateNet(tyt.fen.fizik.correct, tyt.fen.fizik.incorrect) +
    calculateNet(tyt.fen.kimya.correct, tyt.fen.kimya.incorrect) +
    calculateNet(tyt.fen.biyoloji.correct, tyt.fen.biyoloji.incorrect);

  const totalNet = turkceNet + sosyalNet + matNet + fenNet;

  // ÖSYM Ham Puan Katsayıları (Standardize)
  const hamScore = 100 + turkceNet * 3.3 + sosyalNet * 3.4 + matNet * 3.3 + fenNet * 3.4;
  const clampedHam = Math.min(500, Math.max(100, parseFloat(hamScore.toFixed(3))));
  
  const obpKatki = calculateObpScore(diplomaGrade, isBroken);
  const yerlestirmeScore = parseFloat((clampedHam + obpKatki).toFixed(3));

  return {
    turkceNet,
    sosyalNet,
    matNet,
    fenNet,
    totalNet: parseFloat(totalNet.toFixed(2)),
    hamScore: clampedHam,
    yerlestirmeScore,
    obpKatki,
  };
};

// AYT SAY Puanı Hesaplama
export const calculateSayScore = (
  tyt: TytNets,
  ayt: AytSayNets,
  diplomaGrade: number,
  isBroken: boolean
) => {
  const tytRes = calculateTytScore(tyt, diplomaGrade, isBroken);
  const matNet = calculateNet(ayt.matematik.correct, ayt.matematik.incorrect);
  const fizikNet = calculateNet(ayt.fizik.correct, ayt.fizik.incorrect);
  const kimyaNet = calculateNet(ayt.kimya.correct, ayt.kimya.incorrect);
  const biyolojiNet = calculateNet(ayt.biyoloji.correct, ayt.biyoloji.incorrect);

  const aytTotalNet = matNet + fizikNet + kimyaNet + biyolojiNet;

  // SAY: TYT %40 + AYT %60
  const tytKatki = (tytRes.hamScore - 100) * 0.4;
  const aytKatki = matNet * 3.0 + fizikNet * 2.85 + kimyaNet * 3.07 + biyolojiNet * 3.07;
  const hamScore = Math.min(500, Math.max(100, parseFloat((100 + tytKatki + aytKatki).toFixed(3))));

  const obpKatki = calculateObpScore(diplomaGrade, isBroken);
  const yerlestirmeScore = parseFloat((hamScore + obpKatki).toFixed(3));

  return {
    matNet,
    fizikNet,
    kimyaNet,
    biyolojiNet,
    aytTotalNet: parseFloat(aytTotalNet.toFixed(2)),
    hamScore,
    yerlestirmeScore,
  };
};

// AYT EA Puanı Hesaplama
export const calculateEaScore = (
  tyt: TytNets,
  ayt: AytEaNets,
  diplomaGrade: number,
  isBroken: boolean
) => {
  const tytRes = calculateTytScore(tyt, diplomaGrade, isBroken);
  const matNet = calculateNet(ayt.matematik.correct, ayt.matematik.incorrect);
  const edebiyatNet = calculateNet(ayt.edebiyat.correct, ayt.edebiyat.incorrect);
  const tarih1Net = calculateNet(ayt.tarih1.correct, ayt.tarih1.incorrect);
  const cografya1Net = calculateNet(ayt.cografya1.correct, ayt.cografya1.incorrect);

  const aytTotalNet = matNet + edebiyatNet + tarih1Net + cografya1Net;

  const tytKatki = (tytRes.hamScore - 100) * 0.4;
  const aytKatki = matNet * 3.0 + edebiyatNet * 3.0 + tarih1Net * 2.8 + cografya1Net * 3.33;
  const hamScore = Math.min(500, Math.max(100, parseFloat((100 + tytKatki + aytKatki).toFixed(3))));

  const obpKatki = calculateObpScore(diplomaGrade, isBroken);
  const yerlestirmeScore = parseFloat((hamScore + obpKatki).toFixed(3));

  return {
    matNet,
    edebiyatNet,
    tarih1Net,
    cografya1Net,
    aytTotalNet: parseFloat(aytTotalNet.toFixed(2)),
    hamScore,
    yerlestirmeScore,
  };
};

// AYT SOZ Puanı Hesaplama
export const calculateSozScore = (
  tyt: TytNets,
  ayt: AytSozNets,
  diplomaGrade: number,
  isBroken: boolean
) => {
  const tytRes = calculateTytScore(tyt, diplomaGrade, isBroken);
  const edebiyatNet = calculateNet(ayt.edebiyat.correct, ayt.edebiyat.incorrect);
  const tarih1Net = calculateNet(ayt.tarih1.correct, ayt.tarih1.incorrect);
  const cografya1Net = calculateNet(ayt.cografya1.correct, ayt.cografya1.incorrect);
  const tarih2Net = calculateNet(ayt.tarih2.correct, ayt.tarih2.incorrect);
  const cografya2Net = calculateNet(ayt.cografya2.correct, ayt.cografya2.incorrect);
  const felsefeNet = calculateNet(ayt.felsefe.correct, ayt.felsefe.incorrect);
  const dinNet = calculateNet(ayt.din.correct, ayt.din.incorrect);

  const aytTotalNet =
    edebiyatNet + tarih1Net + cografya1Net + tarih2Net + cografya2Net + felsefeNet + dinNet;

  const tytKatki = (tytRes.hamScore - 100) * 0.4;
  const aytKatki =
    edebiyatNet * 3.0 +
    tarih1Net * 2.8 +
    cografya1Net * 3.33 +
    tarih2Net * 2.91 +
    cografya2Net * 2.91 +
    felsefeNet * 3.0 +
    dinNet * 3.33;
  const hamScore = Math.min(500, Math.max(100, parseFloat((100 + tytKatki + aytKatki).toFixed(3))));

  const obpKatki = calculateObpScore(diplomaGrade, isBroken);
  const yerlestirmeScore = parseFloat((hamScore + obpKatki).toFixed(3));

  return {
    edebiyatNet,
    tarih1Net,
    cografya1Net,
    tarih2Net,
    cografya2Net,
    felsefeNet,
    dinNet,
    aytTotalNet: parseFloat(aytTotalNet.toFixed(2)),
    hamScore,
    yerlestirmeScore,
  };
};

// YDT Puanı Hesaplama
export const calculateDilScore = (
  tyt: TytNets,
  ydt: YdtNets,
  diplomaGrade: number,
  isBroken: boolean
) => {
  const tytRes = calculateTytScore(tyt, diplomaGrade, isBroken);
  const dilNet = calculateNet(ydt.dil.correct, ydt.dil.incorrect);

  const tytKatki = (tytRes.hamScore - 100) * 0.4;
  const ydtKatki = dilNet * 3.75;
  const hamScore = Math.min(500, Math.max(100, parseFloat((100 + tytKatki + ydtKatki).toFixed(3))));

  const obpKatki = calculateObpScore(diplomaGrade, isBroken);
  const yerlestirmeScore = parseFloat((hamScore + obpKatki).toFixed(3));

  return {
    dilNet,
    hamScore,
    yerlestirmeScore,
  };
};

// ÖSYM Gerçekçi Sıralama Kestirim Eğrisi
// Puan aralıklarına göre geçmiş 3 yılın yığılma medyanı üzerinden sıralama tahmini
interface RankCurvePoint {
  score: number;
  rank: number;
}

const SAY_CURVE: RankCurvePoint[] = [
  { score: 550, rank: 50 },
  { score: 535, rank: 500 },
  { score: 520, rank: 1500 },
  { score: 500, rank: 5000 },
  { score: 480, rank: 12000 },
  { score: 460, rank: 22000 },
  { score: 440, rank: 35000 },
  { score: 420, rank: 50000 },
  { score: 400, rank: 70000 },
  { score: 375, rank: 100000 },
  { score: 350, rank: 140000 },
  { score: 320, rank: 200000 },
  { score: 290, rank: 280000 },
  { score: 260, rank: 380000 },
  { score: 230, rank: 500000 },
  { score: 200, rank: 700000 },
  { score: 150, rank: 1200000 },
];

const EA_CURVE: RankCurvePoint[] = [
  { score: 550, rank: 20 },
  { score: 520, rank: 300 },
  { score: 490, rank: 1200 },
  { score: 460, rank: 4500 },
  { score: 430, rank: 12000 },
  { score: 400, rank: 25000 },
  { score: 370, rank: 50000 },
  { score: 340, rank: 90000 },
  { score: 310, rank: 150000 },
  { score: 280, rank: 240000 },
  { score: 250, rank: 360000 },
  { score: 220, rank: 520000 },
  { score: 190, rank: 750000 },
  { score: 150, rank: 1100000 },
];

const SOZ_CURVE: RankCurvePoint[] = [
  { score: 550, rank: 10 },
  { score: 510, rank: 250 },
  { score: 470, rank: 1500 },
  { score: 430, rank: 5500 },
  { score: 390, rank: 16000 },
  { score: 350, rank: 40000 },
  { score: 310, rank: 85000 },
  { score: 270, rank: 160000 },
  { score: 230, rank: 280000 },
  { score: 190, rank: 450000 },
  { score: 150, rank: 800000 },
];

const DIL_CURVE: RankCurvePoint[] = [
  { score: 550, rank: 50 },
  { score: 510, rank: 500 },
  { score: 470, rank: 2000 },
  { score: 430, rank: 5000 },
  { score: 390, rank: 10000 },
  { score: 350, rank: 18000 },
  { score: 300, rank: 32000 },
  { score: 250, rank: 52000 },
  { score: 200, rank: 80000 },
  { score: 150, rank: 120000 },
];

const TYT_CURVE: RankCurvePoint[] = [
  { score: 550, rank: 50 },
  { score: 520, rank: 800 },
  { score: 480, rank: 4000 },
  { score: 440, rank: 15000 },
  { score: 400, rank: 45000 },
  { score: 360, rank: 110000 },
  { score: 320, rank: 240000 },
  { score: 280, rank: 450000 },
  { score: 240, rank: 750000 },
  { score: 200, rank: 1200000 },
  { score: 160, rank: 1800000 },
  { score: 130, rank: 2500000 },
];

export const estimateRankFromScore = (score: number, type: ScoreType): number => {
  let curve: RankCurvePoint[] = SAY_CURVE;
  if (type === 'EA') curve = EA_CURVE;
  else if (type === 'SOZ') curve = SOZ_CURVE;
  else if (type === 'DIL') curve = DIL_CURVE;
  else if (type === 'TYT') curve = TYT_CURVE;

  if (score >= curve[0].score) return curve[0].rank;
  if (score <= curve[curve.length - 1].score) return curve[curve.length - 1].rank;

  for (let i = 0; i < curve.length - 1; i++) {
    const higher = curve[i];
    const lower = curve[i + 1];
    if (score <= higher.score && score >= lower.score) {
      // Logaritmik / Eksponansiyel İnterpolasyon
      const fraction = (higher.score - score) / (higher.score - lower.score);
      const estimatedRank =
        higher.rank * Math.pow(lower.rank / higher.rank, fraction);
      return Math.round(estimatedRank);
    }
  }

  return 500000;
};
