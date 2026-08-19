import React from 'react';
import { GraduationCap, ShieldCheck, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 transition-colors mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Logo & Açıklama */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center space-x-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-600 to-orange-400 flex items-center justify-center text-white shadow-md">
                <GraduationCap className="w-5 h-5" />
              </div>
              <span className="font-black text-lg tracking-tight text-slate-900 dark:text-white">
                YKS Tercih Robotu
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md leading-relaxed">
              YKS adaylarının puan, net ve tahmini sıralama verilerini geçmiş 5 yılın ÖSYM ve YÖK Atlas taban sıralama eğilimleri ve istatistiksel trend modelleriyle birleştiren yeni nesil tercih ve analiz platformu.
            </p>
          </div>

          {/* Hızlı Bilgi & Metodoloji */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              Hesaplama Metodolojisi
            </h4>
            <ul className="text-xs text-slate-500 dark:text-slate-400 space-y-1.5">
              <li>• ÖSYM standart katsayı formülleri</li>
              <li>• 2020-2024 YÖK Atlas taban verileri</li>
              <li>• 5 Yıllık lineer regresyon eğimi</li>
              <li>• Kontenjan ve yığılma katsayısı</li>
            </ul>
          </div>

          {/* Yasal Uyarı */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center">
              <ShieldCheck className="w-4 h-4 mr-1 text-emerald-500" />
              Önemli Bilgilendirme
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Sitemizdeki yerleşme ihtimalleri ve sıralama tahminleri istatistiksel analiz ve simülasyon amaçlıdır. Nihai yerleştirme kuralları ve resmi kılavuz ÖSYM tarafından yayımlanır.
            </p>
          </div>

        </div>

        {/* Alt Telif Çizgisi */}
        <div className="border-t border-slate-100 dark:border-slate-800 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-2">
          <p>© {new Date().getFullYear()} YKS Tercih & Yerleşme Robotu. Tüm hakları saklıdır.</p>
          <div className="flex items-center space-x-1">
            <span>YKS adayları için özenle geliştirildi</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline" />
          </div>
        </div>

      </div>
    </footer>
  );
};
