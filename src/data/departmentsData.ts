import { Department, ScoreType } from '../types';
import compactData from './departmentsData.json';

interface CompactBundle {
  u: string[];
  f: string[];
  d: string[];
  c: string[];
  ut: string[];
  st: ScoreType[];
  sc: string[];
  l: string[];
  et: string[];
  t: string[];
  r: [
    string, // id
    string, // code
    number, // uni
    number, // fac
    number, // dept
    number, // city
    number, // uniType
    number, // scoreType
    number, // scholarship
    number, // lang
    number, // eduType
    number[], // tags
    [number, number, number, number, number][] // history
  ][];
}

const bundle = compactData as unknown as CompactBundle;

export const DEPARTMENTS_DATA: Department[] = bundle.r.map((row) => ({
  id: row[0],
  code: row[1],
  universityName: bundle.u[row[2]],
  facultyName: bundle.f[row[3]],
  departmentName: bundle.d[row[4]],
  city: bundle.c[row[5]],
  universityType: bundle.ut[row[6]] as any,
  scoreType: bundle.st[row[7]],
  scholarship: bundle.sc[row[8]] as any,
  language: bundle.l[row[9]] as any,
  educationType: bundle.et[row[10]] as any,
  tags: row[11].map((idx) => bundle.t[idx]),
  history: row[12].map((h) => ({
    year: h[0],
    baseRank: h[1],
    baseScore: h[2],
    quota: h[3],
    filledQuota: h[4],
  })),
}));

export const CITIES = ['Tümü', ...bundle.c];
export const UNIVERSITY_TYPES = ['Tümü', ...bundle.ut];
export const SCORE_TYPES = ['Tümü', 'SAY', 'EA', 'SOZ', 'DIL', 'TYT'];
export const SCHOLARSHIPS = ['Tümü', 'Ücretsiz', 'Burslu', '%50 İndirimli', 'Ücretli'];

