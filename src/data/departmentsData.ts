import { Department } from '../types';
import rawData from './departmentsData.json';

export const DEPARTMENTS_DATA = rawData as unknown as Department[];

export const CITIES = Array.from(new Set(DEPARTMENTS_DATA.map((d) => d.city))).sort();
export const UNIVERSITY_TYPES = ['Tümü', 'Devlet', 'Vakıf', 'KKTC'];
export const SCORE_TYPES = ['Tümü', 'SAY', 'EA', 'SOZ', 'DIL', 'TYT'];
export const SCHOLARSHIPS = ['Tümü', 'Ücretsiz', 'Burslu', '%50 İndirimli', 'Ücretli'];
