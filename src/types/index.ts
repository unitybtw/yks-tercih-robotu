export type ScoreType = 'SAY' | 'EA' | 'SOZ' | 'DIL' | 'TYT';

export type UniversityType = 'Devlet' | 'Vakıf' | 'KKTC' | 'Yurt Dışı';

export type ScholarshipType = 'Ücretsiz' | 'Burslu' | '%50 İndirimli' | '%25 İndirimli' | 'Ücretli';

export interface YearStats {
  year: number;
  baseRank: number; // Taban Sıralama (örn: 24500)
  baseScore: number; // Taban Puan (örn: 462.85)
  quota: number; // Kontenjan
  filledQuota: number; // Yerleşen sayısı
}

export interface Department {
  id: string;
  code: string; // ÖSYM Program Kodu
  universityName: string;
  facultyName: string;
  departmentName: string;
  city: string;
  universityType: UniversityType;
  scoreType: ScoreType;
  scholarship: ScholarshipType;
  language: 'Türkçe' | 'İngilizce' | 'Almanca' | 'Fransızca';
  educationType: 'Örgün' | 'İkinci Öğretim' | 'Açıköğretim' | 'Uzaktan';
  history: YearStats[]; // 2020-2024 ve 2025 projeksiyonu
  websiteUrl?: string;
  tags?: string[];
}

export interface TytNets {
  turkce: { correct: number; incorrect: number }; // 40
  sosyal: {
    tarih: { correct: number; incorrect: number }; // 5
    cografya: { correct: number; incorrect: number }; // 5
    felsefe: { correct: number; incorrect: number }; // 5
    din: { correct: number; incorrect: number }; // 5
  };
  matematik: { correct: number; incorrect: number }; // 40
  fen: {
    fizik: { correct: number; incorrect: number }; // 7
    kimya: { correct: number; incorrect: number }; // 7
    biyoloji: { correct: number; incorrect: number }; // 6
  };
}

export interface AytSayNets {
  matematik: { correct: number; incorrect: number }; // 40
  fizik: { correct: number; incorrect: number }; // 14
  kimya: { correct: number; incorrect: number }; // 13
  biyoloji: { correct: number; incorrect: number }; // 13
}

export interface AytEaNets {
  matematik: { correct: number; incorrect: number }; // 40
  edebiyat: { correct: number; incorrect: number }; // 24
  tarih1: { correct: number; incorrect: number }; // 10
  cografya1: { correct: number; incorrect: number }; // 6
}

export interface AytSozNets {
  edebiyat: { correct: number; incorrect: number }; // 24
  tarih1: { correct: number; incorrect: number }; // 10
  cografya1: { correct: number; incorrect: number }; // 6
  tarih2: { correct: number; incorrect: number }; // 11
  cografya2: { correct: number; incorrect: number }; // 11
  felsefe: { correct: number; incorrect: number }; // 12
  din: { correct: number; incorrect: number }; // 6
}

export interface YdtNets {
  dil: { correct: number; incorrect: number }; // 80
}

export interface UserScores {
  diplomaGrade: number; // 50 - 100
  isBrokenObp: boolean; // Önceki yıl yerleşti mi (Kırık OBP)
  
  // Hesaplanan Puanlar (Yerleştirme Puanları)
  tytScore: number;
  sayScore: number;
  eaScore: number;
  sozScore: number;
  dilScore: number;

  // Hesaplanan / Girilen Sıralamalar
  tytRank: number;
  sayRank: number;
  eaRank: number;
  sozRank: number;
  dilRank: number;

  // Aktif Seçili Alan
  activeScoreType: ScoreType;
}

export type ProbabilityCategory = 'garanti' | 'ideal' | 'dengeli' | 'riskli' | 'hayal';

export interface ProbabilityAnalysis {
  percentage: number; // 0 - 100
  category: ProbabilityCategory;
  categoryTitle: string;
  categoryColor: string; // Tailwind color class
  trendSlope: 'hizli_yukselis' | 'hafif_yukselis' | 'stabil' | 'hafif_dusus' | 'hizli_dusus';
  trendText: string;
  rankDiff: number; // Kullanıcı sıralaması - 2024 taban sıralaması
  rankDiffPercentage: number;
  advice: string;
  riskScore: number; // 1-10
}

export interface PreferenceItem {
  order: number;
  department: Department;
  probability: ProbabilityAnalysis;
  notes?: string;
}

export interface FilterState {
  searchQuery: string;
  city: string;
  universityType: string;
  scoreType: string;
  scholarship: string;
  minRank?: number;
  maxRank?: number;
  sortBy: 'rank_asc' | 'rank_desc' | 'prob_desc' | 'score_desc' | 'name_asc';
}
