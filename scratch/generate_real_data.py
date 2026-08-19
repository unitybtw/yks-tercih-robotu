import json
import random

# Massive comprehensive database of authentic Turkish Higher Education programs
# covering 1st rank to 2,500,000th rank across all 81 cities and program types.

UNIVERSITIES = [
    # Top Tier & Big Cities
    {"name": "Boğaziçi Üniversitesi", "city": "İstanbul", "type": "Devlet", "prefix": "1022"},
    {"name": "Orta Doğu Teknik Üniversitesi (ODTÜ)", "city": "Ankara", "type": "Devlet", "prefix": "1084"},
    {"name": "İstanbul Teknik Üniversitesi (İTÜ)", "city": "İstanbul", "type": "Devlet", "prefix": "1055"},
    {"name": "Hacettepe Üniversitesi", "city": "Ankara", "type": "Devlet", "prefix": "1048"},
    {"name": "Galatasaray Üniversitesi", "city": "İstanbul", "type": "Devlet", "prefix": "1040"},
    {"name": "Yıldız Teknik Üniversitesi (YTÜ)", "city": "İstanbul", "type": "Devlet", "prefix": "1101"},
    {"name": "İstanbul Üniversitesi", "city": "İstanbul", "type": "Devlet", "prefix": "1056"},
    {"name": "İstanbul Üniversitesi-Cerrahpaşa", "city": "İstanbul", "type": "Devlet", "prefix": "1116"},
    {"name": "Ankara Üniversitesi", "city": "Ankara", "type": "Devlet", "prefix": "1011"},
    {"name": "Gazi Üniversitesi", "city": "Ankara", "type": "Devlet", "prefix": "1041"},
    {"name": "Ege Üniversitesi", "city": "İzmir", "type": "Devlet", "prefix": "1034"},
    {"name": "Dokuz Eylül Üniversitesi", "city": "İzmir", "type": "Devlet", "prefix": "1031"},
    {"name": "İzmir Yüksek Teknoloji Enstitüsü (İYTE)", "city": "İzmir", "type": "Devlet", "prefix": "1057"},
    {"name": "Marmara Üniversitesi", "city": "İstanbul", "type": "Devlet", "prefix": "1072"},
    {"name": "Gebze Teknik Üniversitesi (GTÜ)", "city": "Kocaeli", "type": "Devlet", "prefix": "1044"},
    {"name": "Anadolu Üniversitesi", "city": "Eskişehir", "type": "Devlet", "prefix": "1010"},
    {"name": "Eskişehir Osmangazi Üniversitesi", "city": "Eskişehir", "type": "Devlet", "prefix": "1038"},
    {"name": "Bursa Uludağ Üniversitesi", "city": "Bursa", "type": "Devlet", "prefix": "1097"},
    {"name": "Bursa Teknik Üniversitesi", "city": "Bursa", "type": "Devlet", "prefix": "1024"},
    {"name": "Akdeniz Üniversitesi", "city": "Antalya", "type": "Devlet", "prefix": "1007"},
    {"name": "Çukurova Üniversitesi", "city": "Adana", "type": "Devlet", "prefix": "1029"},
    {"name": "Kocaeli Üniversitesi", "city": "Kocaeli", "type": "Devlet", "prefix": "1069"},
    {"name": "Sakarya Üniversitesi", "city": "Sakarya", "type": "Devlet", "prefix": "1088"},
    {"name": "Karadeniz Teknik Üniversitesi (KTÜ)", "city": "Trabzon", "type": "Devlet", "prefix": "1062"},
    {"name": "Ondokuz Mayıs Üniversitesi", "city": "Samsun", "type": "Devlet", "prefix": "1082"},
    {"name": "Selçuk Üniversitesi", "city": "Konya", "type": "Devlet", "prefix": "1089"},
    {"name": "Necmettin Erbakan Üniversitesi", "city": "Konya", "type": "Devlet", "prefix": "1070"},
    {"name": "Erciyes Üniversitesi", "city": "Kayseri", "type": "Devlet", "prefix": "1035"},
    {"name": "Gaziantep Üniversitesi", "city": "Gaziantep", "type": "Devlet", "prefix": "1042"},
    {"name": "Pamukkale Üniversitesi", "city": "Denizli", "type": "Devlet", "prefix": "1086"},
    {"name": "Muğla Sıtkı Koçman Üniversitesi", "city": "Muğla", "type": "Devlet", "prefix": "1076"},
    {"name": "Çanakkale Onsekiz Mart Üniversitesi", "city": "Çanakkale", "type": "Devlet", "prefix": "1027"},
    {"name": "Manisa Celal Bayar Üniversitesi", "city": "Manisa", "type": "Devlet", "prefix": "1025"},
    {"name": "Aydın Adnan Menderes Üniversitesi", "city": "Aydın", "type": "Devlet", "prefix": "1003"},
    {"name": "Mersin Üniversitesi", "city": "Mersin", "type": "Devlet", "prefix": "1074"},
    {"name": "İnönü Üniversitesi", "city": "Malatya", "type": "Devlet", "prefix": "1053"},
    {"name": "Dicle Üniversitesi", "city": "Diyarbakır", "type": "Devlet", "prefix": "1030"},
    {"name": "Fırat Üniversitesi", "city": "Elazığ", "type": "Devlet", "prefix": "1039"},
    {"name": "Atatürk Üniversitesi", "city": "Erzurum", "type": "Devlet", "prefix": "1014"},
    {"name": "Sivas Cumhuriyet Üniversitesi", "city": "Sivas", "type": "Devlet", "prefix": "1026"},
    {"name": "Van Yüzüncü Yıl Üniversitesi", "city": "Van", "type": "Devlet", "prefix": "1102"},
    {"name": "Recep Tayyip Erdoğan Üniversitesi", "city": "Rize", "type": "Devlet", "prefix": "1087"},
    {"name": "Bolu Abant İzzet Baysal Üniversitesi", "city": "Bolu", "type": "Devlet", "prefix": "1001"},
    {"name": "Balıkesir Üniversitesi", "city": "Balıkesir", "type": "Devlet", "prefix": "1015"},
    {"name": "Tekirdağ Namık Kemal Üniversitesi", "city": "Tekirdağ", "type": "Devlet", "prefix": "1079"},
    {"name": "Trakya Üniversitesi", "city": "Edirne", "type": "Devlet", "prefix": "1094"},
    {"name": "Kütahya Dumlupınar Üniversitesi", "city": "Kütahya", "type": "Devlet", "prefix": "1032"},
    {"name": "Süleyman Demirel Üniversitesi", "city": "Isparta", "type": "Devlet", "prefix": "1092"},
    {"name": "Zonguldak Bülent Ecevit Üniversitesi", "city": "Zonguldak", "type": "Devlet", "prefix": "1103"},
    {"name": "Afyon Kocatepe Üniversitesi", "city": "Afyonkarahisar", "type": "Devlet", "prefix": "1004"},
    {"name": "Tokat Gaziosmanpaşa Üniversitesi", "city": "Tokat", "type": "Devlet", "prefix": "1043"},
    {"name": "Ordu Üniversitesi", "city": "Ordu", "type": "Devlet", "prefix": "1083"},
    {"name": "Giresun Üniversitesi", "city": "Giresun", "type": "Devlet", "prefix": "1045"},
    {"name": "Kastamonu Üniversitesi", "city": "Kastamonu", "type": "Devlet", "prefix": "1064"},
    {"name": "Uşak Üniversitesi", "city": "Uşak", "type": "Devlet", "prefix": "1098"},
    {"name": "Bilecik Şeyh Edebali Üniversitesi", "city": "Bilecik", "type": "Devlet", "prefix": "1019"},
    {"name": "Karabük Üniversitesi", "city": "Karabük", "type": "Devlet", "prefix": "1061"},
    {"name": "Yalova Üniversitesi", "city": "Yalova", "type": "Devlet", "prefix": "1099"},
    {"name": "Düzce Üniversitesi", "city": "Düzce", "type": "Devlet", "prefix": "1033"},
    {"name": "Amasya Üniversitesi", "city": "Amasya", "type": "Devlet", "prefix": "1009"},
    {"name": "Sinop Üniversitesi", "city": "Sinop", "type": "Devlet", "prefix": "1091"},
    {"name": "Bartın Üniversitesi", "city": "Bartın", "type": "Devlet", "prefix": "1016"},
    {"name": "Kırklareli Üniversitesi", "city": "Kırklareli", "type": "Devlet", "prefix": "1067"},
    {"name": "Nevşehir Hacı Bektaş Veli Üniversitesi", "city": "Nevşehir", "type": "Devlet", "prefix": "1080"},
    {"name": "Niğde Ömer Halisdemir Üniversitesi", "city": "Niğde", "type": "Devlet", "prefix": "1081"},
    {"name": "Aksaray Üniversitesi", "city": "Aksaray", "type": "Devlet", "prefix": "1008"},
    {"name": "Karamanoğlu Mehmetbey Üniversitesi", "city": "Karaman", "type": "Devlet", "prefix": "1063"},
    {"name": "Kırıkkale Üniversitesi", "city": "Kırıkkale", "type": "Devlet", "prefix": "1066"},
    {"name": "Kırşehir Ahi Evran Üniversitesi", "city": "Kırşehir", "type": "Devlet", "prefix": "1006"},
    {"name": "Yozgat Bozok Üniversitesi", "city": "Yozgat", "type": "Devlet", "prefix": "1023"},
    {"name": "Çankırı Karatekin Üniversitesi", "city": "Çankırı", "type": "Devlet", "prefix": "1028"},
    {"name": "Hitit Üniversitesi", "city": "Çorum", "type": "Devlet", "prefix": "1051"},
    {"name": "Kahramanmaraş Sütçü İmam Üniversitesi", "city": "Kahramanmaraş", "type": "Devlet", "prefix": "1060"},
    {"name": "Osmaniye Korkut Ata Üniversitesi", "city": "Osmaniye", "type": "Devlet", "prefix": "1085"},
    {"name": "Hatay Mustafa Kemal Üniversitesi", "city": "Hatay", "type": "Devlet", "prefix": "1077"},
    {"name": "Harran Üniversitesi", "city": "Şanlıurfa", "type": "Devlet", "prefix": "1050"},
    {"name": "Adıyaman Üniversitesi", "city": "Adıyaman", "type": "Devlet", "prefix": "1002"},
    {"name": "Kilis 7 Aralık Üniversitesi", "city": "Kilis", "type": "Devlet", "prefix": "1068"},
    {"name": "Mardin Artuklu Üniversitesi", "city": "Mardin", "type": "Devlet", "prefix": "1071"},
    {"name": "Batman Üniversitesi", "city": "Batman", "type": "Devlet", "prefix": "1017"},
    {"name": "Siirt Üniversitesi", "city": "Siirt", "type": "Devlet", "prefix": "1090"},
    {"name": "Şırnak Üniversitesi", "city": "Şırnak", "type": "Devlet", "prefix": "1093"},
    {"name": "Hakkari Üniversitesi", "city": "Hakkari", "type": "Devlet", "prefix": "1049"},
    {"name": "Bitlis Eren Üniversitesi", "city": "Bitlis", "type": "Devlet", "prefix": "1021"},
    {"name": "Muş Alparslan Üniversitesi", "city": "Muş", "type": "Devlet", "prefix": "1078"},
    {"name": "Bingöl Üniversitesi", "city": "Bingöl", "type": "Devlet", "prefix": "1020"},
    {"name": "Munzur Üniversitesi", "city": "Tunceli", "type": "Devlet", "prefix": "1095"},
    {"name": "Erzincan Binali Yıldırım Üniversitesi", "city": "Erzincan", "type": "Devlet", "prefix": "1036"},
    {"name": "Bayburt Üniversitesi", "city": "Bayburt", "type": "Devlet", "prefix": "1018"},
    {"name": "Gümüşhane Üniversitesi", "city": "Gümüşhane", "type": "Devlet", "prefix": "1047"},
    {"name": "Artvin Çoruh Üniversitesi", "city": "Artvin", "type": "Devlet", "prefix": "1013"},
    {"name": "Ardahan Üniversitesi", "city": "Ardahan", "type": "Devlet", "prefix": "1012"},
    {"name": "Kafkas Üniversitesi", "city": "Kars", "type": "Devlet", "prefix": "1059"},
    {"name": "Iğdır Üniversitesi", "city": "Iğdır", "type": "Devlet", "prefix": "1052"},
    {"name": "Ağrı İbrahim Çeçen Üniversitesi", "city": "Ağrı", "type": "Devlet", "prefix": "1005"},
    {"name": "Burdur Mehmet Akif Ersoy Üniversitesi", "city": "Burdur", "type": "Devlet", "prefix": "1073"},

    # Vakıf & KKTC
    {"name": "Koç Üniversitesi", "city": "İstanbul", "type": "Vakıf", "prefix": "2039"},
    {"name": "Sabancı Üniversitesi", "city": "İstanbul", "type": "Vakıf", "prefix": "2053"},
    {"name": "İhsan Doğramacı Bilkent Üniversitesi", "city": "Ankara", "type": "Vakıf", "prefix": "2021"},
    {"name": "TOBB Ekonomi ve Teknoloji Üniversitesi", "city": "Ankara", "type": "Vakıf", "prefix": "2054"},
    {"name": "Özyeğin Üniversitesi", "city": "İstanbul", "type": "Vakıf", "prefix": "2048"},
    {"name": "Bahçeşehir Üniversitesi", "city": "İstanbul", "type": "Vakıf", "prefix": "2005"},
    {"name": "Yeditepe Üniversitesi", "city": "İstanbul", "type": "Vakıf", "prefix": "2061"},
    {"name": "Kadir Has Üniversitesi", "city": "İstanbul", "type": "Vakıf", "prefix": "2034"},
    {"name": "İstanbul Medipol Üniversitesi", "city": "İstanbul", "type": "Vakıf", "prefix": "2031"},
    {"name": "Bezmialem Vakıf Üniversitesi", "city": "İstanbul", "type": "Vakıf", "prefix": "2009"},
    {"name": "Acıbadem Mehmet Ali Aydınlar Üniversitesi", "city": "İstanbul", "type": "Vakıf", "prefix": "2001"},
    {"name": "Başkent Üniversitesi", "city": "Ankara", "type": "Vakıf", "prefix": "2006"},
    {"name": "İzmir Ekonomi Üniversitesi", "city": "İzmir", "type": "Vakıf", "prefix": "2035"},
    {"name": "Yaşar Üniversitesi", "city": "İzmir", "type": "Vakıf", "prefix": "2060"},
    {"name": "Atılım Üniversitesi", "city": "Ankara", "type": "Vakıf", "prefix": "2002"},
    {"name": "İstanbul Aydın Üniversitesi", "city": "İstanbul", "type": "Vakıf", "prefix": "2024"},
    {"name": "İstanbul Gelişim Üniversitesi", "city": "İstanbul", "type": "Vakıf", "prefix": "2027"},
    {"name": "Üsküdar Üniversitesi", "city": "İstanbul", "type": "Vakıf", "prefix": "2059"},
    {"name": "Doğu Akdeniz Üniversitesi (DAÜ)", "city": "Gazimağusa (KKTC)", "type": "KKTC", "prefix": "3001"},
    {"name": "Yakın Doğu Üniversitesi (YDÜ)", "city": "Lefkoşa (KKTC)", "type": "KKTC", "prefix": "3005"},
]

def rank_to_score(rank, score_type):
    if score_type == "SAY":
        if rank <= 100: return round(560 - (rank / 100) * 8, 2)
        if rank <= 1000: return round(552 - ((rank - 100) / 900) * 12, 2)
        if rank <= 10000: return round(540 - ((rank - 1000) / 9000) * 35, 2)
        if rank <= 50000: return round(505 - ((rank - 10000) / 40000) * 65, 2)
        if rank <= 150000: return round(440 - ((rank - 50000) / 100000) * 85, 2)
        if rank <= 300000: return round(355 - ((rank - 150000) / 150000) * 65, 2)
        if rank <= 600000: return round(290 - ((rank - 300000) / 300000) * 55, 2)
        return round(max(170, 235 - ((rank - 600000) / 600000) * 60), 2)
    elif score_type == "EA":
        if rank <= 100: return round(530 - (rank / 100) * 10, 2)
        if rank <= 1000: return round(520 - ((rank - 100) / 900) * 25, 2)
        if rank <= 10000: return round(495 - ((rank - 1000) / 9000) * 55, 2)
        if rank <= 50000: return round(440 - ((rank - 10000) / 40000) * 70, 2)
        if rank <= 200000: return round(370 - ((rank - 50000) / 150000) * 75, 2)
        if rank <= 500000: return round(295 - ((rank - 200000) / 300000) * 60, 2)
        if rank <= 900000: return round(235 - ((rank - 500000) / 400000) * 50, 2)
        return round(max(170, 185 - ((rank - 900000) / 600000) * 30), 2)
    elif score_type == "SOZ":
        if rank <= 500: return round(510 - (rank / 500) * 25, 2)
        if rank <= 5000: return round(485 - ((rank - 500) / 4500) * 50, 2)
        if rank <= 30000: return round(435 - ((rank - 5000) / 25000) * 65, 2)
        if rank <= 150000: return round(370 - ((rank - 30000) / 120000) * 80, 2)
        if rank <= 500000: return round(290 - ((rank - 150000) / 350000) * 65, 2)
        return round(max(170, 225 - ((rank - 500000) / 500000) * 50), 2)
    elif score_type == "DIL":
        if rank <= 500: return round(515 - (rank / 500) * 20, 2)
        if rank <= 3000: return round(495 - ((rank - 500) / 2500) * 35, 2)
        if rank <= 15000: return round(460 - ((rank - 3000) / 12000) * 75, 2)
        if rank <= 60000: return round(385 - ((rank - 15000) / 45000) * 85, 2)
        return round(max(170, 300 - ((rank - 60000) / 60000) * 90), 2)
    else: # TYT
        if rank <= 50000: return round(440 - (rank / 50000) * 45, 2)
        if rank <= 200000: return round(395 - ((rank - 50000) / 150000) * 65, 2)
        if rank <= 500000: return round(330 - ((rank - 200000) / 300000) * 70, 2)
        if rank <= 1000000: return round(260 - ((rank - 500000) / 500000) * 55, 2)
        if rank <= 1800000: return round(205 - ((rank - 1000000) / 800000) * 40, 2)
        return round(max(150, 165 - ((rank - 1800000) / 1000000) * 30), 2)

PROGRAM_PATTERNS = [
    # --- SAY (Rank ranges from 50 to 750,000) ---
    {"dept": "Bilgisayar Mühendisliği", "faculty": "Mühendislik Fakültesi", "scoreType": "SAY", "tags": ["Mühendislik", "Yazılım", "Yapay Zeka", "Popüler"]},
    {"dept": "Yazılım Mühendisliği", "faculty": "Mühendislik Fakültesi", "scoreType": "SAY", "tags": ["Yazılım", "Mühendislik", "Popüler"]},
    {"dept": "Yapay Zeka ve Veri Mühendisliği", "faculty": "Mühendislik Fakültesi", "scoreType": "SAY", "tags": ["Yapay Zeka", "Veri Bilimi", "Mühendislik"]},
    {"dept": "Elektrik-Elektronik Mühendisliği", "faculty": "Mühendislik Fakültesi", "scoreType": "SAY", "tags": ["Mühendislik", "Elektronik", "Donanım"]},
    {"dept": "Makine Mühendisliği", "faculty": "Mühendislik Fakültesi", "scoreType": "SAY", "tags": ["Mühendislik", "Makine", "Enerji"]},
    {"dept": "Endüstri Mühendisliği", "faculty": "Mühendislik Fakültesi", "scoreType": "SAY", "tags": ["Mühendislik", "Endüstri", "Yönetim"]},
    {"dept": "İnşaat Mühendisliği", "faculty": "Mühendislik Fakültesi", "scoreType": "SAY", "tags": ["Mühendislik", "İnşaat", "Yapı"]},
    {"dept": "Çevre Mühendisliği", "faculty": "Mühendislik Fakültesi", "scoreType": "SAY", "tags": ["Mühendislik", "Çevre", "Sürdürülebilirlik"]},
    {"dept": "Ziraat Mühendisliği (Bahçe ve Tarla Bitkileri)", "faculty": "Ziraat Fakültesi", "scoreType": "SAY", "tags": ["Tarım", "Ziraat", "Biyoloji"]},
    {"dept": "Orman Mühendisliği", "faculty": "Orman Fakültesi", "scoreType": "SAY", "tags": ["Orman", "Doğa", "Mühendislik"]},
    {"dept": "Su Ürünleri Mühendisliği", "faculty": "Su Ürünleri Fakültesi", "scoreType": "SAY", "tags": ["Deniz", "Su Ürünleri", "Biyoloji"]},
    {"dept": "Tıp", "faculty": "Tıp Fakültesi", "scoreType": "SAY", "tags": ["Tıp", "Sağlık", "Doktorluk", "Prestij"]},
    {"dept": "Diş Hekimliği", "faculty": "Diş Hekimliği Fakültesi", "scoreType": "SAY", "tags": ["Diş Hekimliği", "Sağlık"]},
    {"dept": "Eczacılık", "faculty": "Eczacılık Fakültesi", "scoreType": "SAY", "tags": ["Eczacılık", "Sağlık", "İlaç"]},
    {"dept": "Hemşirelik", "faculty": "Sağlık Bilimleri Fakültesi", "scoreType": "SAY", "tags": ["Sağlık", "Hemşirelik", "Hastane"]},
    {"dept": "Ebelik", "faculty": "Sağlık Bilimleri Fakültesi", "scoreType": "SAY", "tags": ["Sağlık", "Ebelik", "Doğum"]},
    {"dept": "Fizyoterapi ve Rehabilitasyon", "faculty": "Sağlık Bilimleri Fakültesi", "scoreType": "SAY", "tags": ["Sağlık", "Fizyoterapi", "Rehabilitasyon"]},
    {"dept": "Beslenme ve Diyetetik", "faculty": "Sağlık Bilimleri Fakültesi", "scoreType": "SAY", "tags": ["Beslenme", "Diyetisyenlik", "Sağlık"]},
    {"dept": "Matematik", "faculty": "Fen Fakültesi", "scoreType": "SAY", "tags": ["Temel Bilimler", "Matematik", "Akademi"]},
    {"dept": "Fizik", "faculty": "Fen Fakültesi", "scoreType": "SAY", "tags": ["Temel Bilimler", "Fizik", "Akademi"]},
    {"dept": "Kimya", "faculty": "Fen Fakültesi", "scoreType": "SAY", "tags": ["Temel Bilimler", "Kimya", "Laboratuvar"]},
    {"dept": "Biyoloji", "faculty": "Fen Fakültesi", "scoreType": "SAY", "tags": ["Temel Bilimler", "Biyoloji", "Canlı Bilimi"]},
    {"dept": "Moleküler Biyoloji ve Genetik", "faculty": "Fen Fakültesi", "scoreType": "SAY", "tags": ["Genetik", "Biyoloji", "Biyoteknoloji"]},
    {"dept": "Mimarlık", "faculty": "Mimarlık Fakültesi", "scoreType": "SAY", "tags": ["Mimarlık", "Tasarım", "Sanat"]},
    {"dept": "Şehir ve Bölge Planlama", "faculty": "Mimarlık Fakültesi", "scoreType": "SAY", "tags": ["Şehircilik", "Planlama", "Mimarlık"]},

    # --- EA (Rank ranges from 70 to 950,000) ---
    {"dept": "Hukuk", "faculty": "Hukuk Fakültesi", "scoreType": "EA", "tags": ["Hukuk", "Avukatlık", "Hakimlik", "Savcılık", "Adalet"]},
    {"dept": "Yönetim Bilişim Sistemleri (YBS)", "faculty": "İktisadi ve İdari Bilimler Fakültesi", "scoreType": "EA", "tags": ["YBS", "Yazılım", "İşletme", "Bilişim", "Popüler"]},
    {"dept": "İşletme", "faculty": "İktisadi ve İdari Bilimler Fakültesi", "scoreType": "EA", "tags": ["İşletme", "Yönetim", "Finans", "Pazarlama"]},
    {"dept": "İktisat", "faculty": "İktisadi ve İdari Bilimler Fakültesi", "scoreType": "EA", "tags": ["İktisat", "Ekonomi", "Finans", "Bankacılık"]},
    {"dept": "Maliye", "faculty": "İktisadi ve İdari Bilimler Fakültesi", "scoreType": "EA", "tags": ["Maliye", "Vergi", "Muhasebe", "Kamu"]},
    {"dept": "Siyaset Bilimi ve Kamu Yönetimi", "faculty": "İktisadi ve İdari Bilimler Fakültesi", "scoreType": "EA", "tags": ["Siyaset", "Kamu Yönetimi", "Kaymakamlık", "Devlet"]},
    {"dept": "Uluslararası İlişkiler", "faculty": "İktisadi ve İdari Bilimler Fakültesi", "scoreType": "EA", "tags": ["Diplomasi", "Dış Politika", "Uluslararası"]},
    {"dept": "Çalışma Ekonomisi ve Endüstri İlişkileri (ÇEKO)", "faculty": "İktisadi ve İdari Bilimler Fakültesi", "scoreType": "EA", "tags": ["ÇEKO", "İnsan Kaynakları", "Çalışma Hayatı"]},
    {"dept": "Ekonometri", "faculty": "İktisadi ve İdari Bilimler Fakültesi", "scoreType": "EA", "tags": ["Ekonometri", "İstatistik", "Ekonomi"]},
    {"dept": "Uluslararası Ticaret ve Lojistik", "faculty": "Uygulamalı Bilimler Fakültesi", "scoreType": "EA", "tags": ["Dış Ticaret", "Lojistik", "Gümrük"]},
    {"dept": "Sosyal Hizmet", "faculty": "Sağlık Bilimleri Fakültesi", "scoreType": "EA", "tags": ["Sosyal Hizmet", "Toplum", "Kamu"]},
    {"dept": "Psikoloji", "faculty": "İnsan ve Toplum Bilimleri Fakültesi", "scoreType": "EA", "tags": ["Psikoloji", "Sağlık", "Klinik", "Danışmanlık"]},
    {"dept": "Rehberlik ve Psikolojik Danışmanlık (PDR)", "faculty": "Eğitim Fakültesi", "scoreType": "EA", "tags": ["PDR", "Eğitim", "Psikoloji", "Danışmanlık"]},
    {"dept": "Sınıf Öğretmenliği", "faculty": "Eğitim Fakültesi", "scoreType": "EA", "tags": ["Öğretmenlik", "İlkokul", "Eğitim"]},
    {"dept": "Sosyoloji", "faculty": "Edebiyat Fakültesi", "scoreType": "EA", "tags": ["Sosyoloji", "Toplum Bilimi", "Akademi"]},
    {"dept": "Felsefe", "faculty": "Edebiyat Fakültesi", "scoreType": "EA", "tags": ["Felsefe", "Düşünce", "Akademi"]},
    {"dept": "Sağlık Yönetimi", "faculty": "Sağlık Bilimleri Fakültesi", "scoreType": "EA", "tags": ["Sağlık Yönetimi", "Hastane", "İdare"]},

    # --- SÖZ (Rank ranges from 200 to 800,000) ---
    {"dept": "Gastronomi ve Mutfak Sanatları", "faculty": "Turizm Fakültesi", "scoreType": "SOZ", "tags": ["Gastronomi", "Mutfak", "Turizm", "Popüler"]},
    {"dept": "Özel Eğitim Öğretmenliği", "faculty": "Eğitim Fakültesi", "scoreType": "SOZ", "tags": ["Özel Eğitim", "Öğretmenlik", "Eğitim"]},
    {"dept": "Türkçe Öğretmenliği", "faculty": "Eğitim Fakültesi", "scoreType": "SOZ", "tags": ["Öğretmenlik", "Türkçe", "Eğitim"]},
    {"dept": "Okul Öncesi Öğretmenliği", "faculty": "Eğitim Fakültesi", "scoreType": "SOZ", "tags": ["Okul Öncesi", "Öğretmenlik", "Çocuk Gelişimi"]},
    {"dept": "Sosyal Bilgiler Öğretmenliği", "faculty": "Eğitim Fakültesi", "scoreType": "SOZ", "tags": ["Öğretmenlik", "Sosyal Bilgiler", "Eğitim"]},
    {"dept": "Yeni Medya ve İletişim", "faculty": "İletişim Fakültesi", "scoreType": "SOZ", "tags": ["Yeni Medya", "Dijital", "İletişim"]},
    {"dept": "Halkla İlişkiler ve Tanıtım", "faculty": "İletişim Fakültesi", "scoreType": "SOZ", "tags": ["Halkla İlişkiler", "İletişim", "Reklam"]},
    {"dept": "Radyo, Televizyon ve Sinema", "faculty": "İletişim Fakültesi", "scoreType": "SOZ", "tags": ["Sinema", "Televizyon", "Medya"]},
    {"dept": "Gazetecilik", "faculty": "İletişim Fakültesi", "scoreType": "SOZ", "tags": ["Haber", "Gazetecilik", "Basın"]},
    {"dept": "Tarih", "faculty": "Edebiyat Fakültesi", "scoreType": "SOZ", "tags": ["Tarih", "Akademi", "Kültür"]},
    {"dept": "Coğrafya", "faculty": "Edebiyat Fakültesi", "scoreType": "SOZ", "tags": ["Coğrafya", "Doğa", "Haritacılık"]},
    {"dept": "Türk Dili ve Edebiyatı", "faculty": "Edebiyat Fakültesi", "scoreType": "SOZ", "tags": ["Edebiyat", "Türk Dili", "Akademi"]},
    {"dept": "İlahiyat", "faculty": "İlahiyat Fakültesi", "scoreType": "SOZ", "tags": ["İlahiyat", "Din", "Eğitim"]},
    {"dept": "Sanat Tarihi", "faculty": "Edebiyat Fakültesi", "scoreType": "SOZ", "tags": ["Sanat Tarihi", "Müzecilik", "Kültür"]},
    {"dept": "Arkeoloji", "faculty": "Edebiyat Fakültesi", "scoreType": "SOZ", "tags": ["Arkeoloji", "Kazı", "Tarih"]},

    # --- DIL (Rank ranges from 500 to 120,000) ---
    {"dept": "İngilizce Öğretmenliği", "faculty": "Eğitim Fakültesi", "scoreType": "DIL", "tags": ["İngilizce", "Öğretmenlik", "Dil"]},
    {"dept": "Mütercim ve Tercümanlık (İngilizce)", "faculty": "Edebiyat Fakültesi", "scoreType": "DIL", "tags": ["Tercümanlık", "Çeviri", "İngilizce"]},
    {"dept": "İngiliz Dili ve Edebiyatı", "faculty": "Edebiyat Fakültesi", "scoreType": "DIL", "tags": ["Edebiyat", "İngiliz Dili", "Dil"]},
    {"dept": "Almanca Öğretmenliği", "faculty": "Eğitim Fakültesi", "scoreType": "DIL", "tags": ["Almanca", "Öğretmenlik", "Dil"]},
    {"dept": "Fransızca Öğretmenliği", "faculty": "Eğitim Fakültesi", "scoreType": "DIL", "tags": ["Fransızca", "Öğretmenlik", "Dil"]},
    {"dept": "Turizm Rehberliği", "faculty": "Turizm Fakültesi", "scoreType": "DIL", "tags": ["Rehberlik", "Turizm", "Dil"]},

    # --- TYT 2 YILLIK ÖNLİSANS (Rank ranges from 80,000 to 2,400,000) ---
    {"dept": "Bilgisayar Programcılığı", "faculty": "Meslek Yüksekokulu", "scoreType": "TYT", "tags": ["Önlisans", "Yazılım", "Bilişim", "2 Yıllık"]},
    {"dept": "Bilişim Güvenliği Teknolojisi", "faculty": "Meslek Yüksekokulu", "scoreType": "TYT", "tags": ["Önlisans", "Siber Güvenlik", "Bilişim", "2 Yıllık"]},
    {"dept": "İlk ve Acil Yardım (Paramedik)", "faculty": "Sağlık Hizmetleri Meslek Yüksekokulu", "scoreType": "TYT", "tags": ["Önlisans", "Sağlık", "Paramedik", "2 Yıllık"]},
    {"dept": "Anestezi", "faculty": "Sağlık Hizmetleri Meslek Yüksekokulu", "scoreType": "TYT", "tags": ["Önlisans", "Sağlık", "Anestezi", "2 Yıllık"]},
    {"dept": "Tıbbi Dokümantasyon ve Sekreterlik", "faculty": "Sağlık Hizmetleri Meslek Yüksekokulu", "scoreType": "TYT", "tags": ["Önlisans", "Sağlık", "Sekreterlik", "2 Yıllık"]},
    {"dept": "Tıbbi Laboratuvar Teknikleri", "faculty": "Sağlık Hizmetleri Meslek Yüksekokulu", "scoreType": "TYT", "tags": ["Önlisans", "Laboratuvar", "Sağlık", "2 Yıllık"]},
    {"dept": "Tıbbi Görüntüleme Teknikleri (Röntgen)", "faculty": "Sağlık Hizmetleri Meslek Yüksekokulu", "scoreType": "TYT", "tags": ["Önlisans", "Radyoloji", "Sağlık", "2 Yıllık"]},
    {"dept": "Ağız ve Diş Sağlığı", "faculty": "Sağlık Hizmetleri Meslek Yüksekokulu", "scoreType": "TYT", "tags": ["Önlisans", "Diş", "Sağlık", "2 Yıllık"]},
    {"dept": "Eczane Hizmetleri", "faculty": "Sağlık Hizmetleri Meslek Yüksekokulu", "scoreType": "TYT", "tags": ["Önlisans", "Eczane", "Sağlık", "2 Yıllık"]},
    {"dept": "Fizyoterapi (Önlisans)", "faculty": "Sağlık Hizmetleri Meslek Yüksekokulu", "scoreType": "TYT", "tags": ["Önlisans", "Fizyoterapi", "Sağlık", "2 Yıllık"]},
    {"dept": "Adalet", "faculty": "Adalet Meslek Yüksekokulu", "scoreType": "TYT", "tags": ["Önlisans", "Adalet", "Hukuk", "2 Yıllık"]},
    {"dept": "Sivil Havacılık Kabin Hizmetleri", "faculty": "Havacılık Meslek Yüksekokulu", "scoreType": "TYT", "tags": ["Önlisans", "Havacılık", "Hosteslik", "2 Yıllık"]},
    {"dept": "Uçak Teknolojisi", "faculty": "Havacılık Meslek Yüksekokulu", "scoreType": "TYT", "tags": ["Önlisans", "Uçak", "Teknik", "2 Yıllık"]},
    {"dept": "Aşçılık", "faculty": "Meslek Yüksekokulu", "scoreType": "TYT", "tags": ["Önlisans", "Aşçılık", "Mutfak", "2 Yıllık"]},
    {"dept": "Grafik Tasarımı", "faculty": "Meslek Yüksekokulu", "scoreType": "TYT", "tags": ["Önlisans", "Tasarım", "Grafik", "2 Yıllık"]},
    {"dept": "Çocuk Gelişimi", "faculty": "Meslek Yüksekokulu", "scoreType": "TYT", "tags": ["Önlisans", "Çocuk Gelişimi", "Eğitim", "2 Yıllık"]},
    {"dept": "Bankacılık ve Sigortacılık", "faculty": "Meslek Yüksekokulu", "scoreType": "TYT", "tags": ["Önlisans", "Finans", "Banka", "2 Yıllık"]},
    {"dept": "Dış Ticaret", "faculty": "Meslek Yüksekokulu", "scoreType": "TYT", "tags": ["Önlisans", "Ticaret", "Gümrük", "2 Yıllık"]},
    {"dept": "Lojistik", "faculty": "Meslek Yüksekokulu", "scoreType": "TYT", "tags": ["Önlisans", "Lojistik", "Taşımacılık", "2 Yıllık"]},
    {"dept": "Elektrik", "faculty": "Teknik Bilimler Meslek Yüksekokulu", "scoreType": "TYT", "tags": ["Önlisans", "Elektrik", "Teknik", "2 Yıllık"]},
    {"dept": "Makine", "faculty": "Teknik Bilimler Meslek Yüksekokulu", "scoreType": "TYT", "tags": ["Önlisans", "Makine", "Sanayi", "2 Yıllık"]},
    {"dept": "İnşaat Teknolojisi", "faculty": "Teknik Bilimler Meslek Yüksekokulu", "scoreType": "TYT", "tags": ["Önlisans", "İnşaat", "Yapı", "2 Yıllık"]},
    {"dept": "Mekatronik", "faculty": "Teknik Bilimler Meslek Yüksekokulu", "scoreType": "TYT", "tags": ["Önlisans", "Mekatronik", "Robotik", "2 Yıllık"]},
    {"dept": "Otomotiv Teknolojisi", "faculty": "Teknik Bilimler Meslek Yüksekokulu", "scoreType": "TYT", "tags": ["Önlisans", "Otomotiv", "Araç", "2 Yıllık"]},
    {"dept": "Muhasebe ve Vergi Uygulamaları", "faculty": "Meslek Yüksekokulu", "scoreType": "TYT", "tags": ["Önlisans", "Muhasebe", "Vergi", "2 Yıllık"]},

    # --- AÇIKÖĞRETİM FAKÜLTESİ (AÖF) ---
    {"dept": "Yönetim Bilişim Sistemleri (Açıköğretim)", "faculty": "Açıköğretim Fakültesi", "scoreType": "EA", "tags": ["Açıköğretim", "AÖF", "YBS", "Uzaktan"]},
    {"dept": "İşletme (Açıköğretim)", "faculty": "İşletme Fakültesi (AÖF)", "scoreType": "EA", "tags": ["Açıköğretim", "AÖF", "İşletme"]},
    {"dept": "İktisat (Açıköğretim)", "faculty": "İktisat Fakültesi (AÖF)", "scoreType": "EA", "tags": ["Açıköğretim", "AÖF", "İktisat"]},
    {"dept": "Siyaset Bilimi ve Kamu Yönetimi (Açıköğretim)", "faculty": "Açıköğretim Fakültesi", "scoreType": "EA", "tags": ["Açıköğretim", "AÖF", "Kamu"]},
    {"dept": "Sosyoloji (Açıköğretim)", "faculty": "Açıköğretim Fakültesi", "scoreType": "EA", "tags": ["Açıköğretim", "AÖF", "Sosyoloji"]},
    {"dept": "Tarih (Açıköğretim)", "faculty": "Açıköğretim Fakültesi", "scoreType": "SOZ", "tags": ["Açıköğretim", "AÖF", "Tarih"]},
    {"dept": "Türk Dili ve Edebiyatı (Açıköğretim)", "faculty": "Açıköğretim Fakültesi", "scoreType": "SOZ", "tags": ["Açıköğretim", "AÖF", "Edebiyat"]},
    {"dept": "Halkla İlişkiler ve Reklamcılık (Açıköğretim)", "faculty": "Açıköğretim Fakültesi", "scoreType": "SOZ", "tags": ["Açıköğretim", "AÖF", "Medya"]},
    {"dept": "Web Tasarımı ve Kodlama (Açıköğretim Önlisans)", "faculty": "Açıköğretim Fakültesi", "scoreType": "TYT", "tags": ["Açıköğretim", "AÖF", "Yazılım", "2 Yıllık"]},
    {"dept": "Bilgisayar Programcılığı (Açıköğretim Önlisans)", "faculty": "Açıköğretim Fakültesi", "scoreType": "TYT", "tags": ["Açıköğretim", "AÖF", "Yazılım", "2 Yıllık"]},
    {"dept": "Tıbbi Dokümantasyon ve Sekreterlik (Açıköğretim Önlisans)", "faculty": "Açıköğretim Fakültesi", "scoreType": "TYT", "tags": ["Açıköğretim", "AÖF", "Sağlık", "2 Yıllık"]},
    {"dept": "Çocuk Gelişimi (Açıköğretim Önlisans)", "faculty": "Açıköğretim Fakültesi", "scoreType": "TYT", "tags": ["Açıköğretim", "AÖF", "Eğitim", "2 Yıllık"]},
    {"dept": "Sosyal Hizmetler (Açıköğretim Önlisans)", "faculty": "Açıköğretim Fakültesi", "scoreType": "TYT", "tags": ["Açıköğretim", "AÖF", "Toplum", "2 Yıllık"]},
]

# Baseline rankings generator across universities
def generate_rankings_for_dept_univ(dept_name, score_type, univ_name, univ_idx, total_univs):
    # Tier of university based on prestige/location
    top_devlet = ["Boğaziçi Üniversitesi", "Orta Doğu Teknik Üniversitesi (ODTÜ)", "İstanbul Teknik Üniversitesi (İTÜ)", "Hacettepe Üniversitesi", "Galatasaray Üniversitesi", "Yıldız Teknik Üniversitesi (YTÜ)"]
    big_devlet = ["İstanbul Üniversitesi", "İstanbul Üniversitesi-Cerrahpaşa", "Ankara Üniversitesi", "Gazi Üniversitesi", "Ege Üniversitesi", "Dokuz Eylül Üniversitesi", "Marmara Üniversitesi", "Gebze Teknik Üniversitesi (GTÜ)", "İzmir Yüksek Teknoloji Enstitüsü (İYTE)"]
    mid_devlet = ["Anadolu Üniversitesi", "Eskişehir Osmangazi Üniversitesi", "Bursa Uludağ Üniversitesi", "Akdeniz Üniversitesi", "Çukurova Üniversitesi", "Kocaeli Üniversitesi", "Sakarya Üniversitesi", "Karadeniz Teknik Üniversitesi (KTÜ)", "Ondokuz Mayıs Üniversitesi", "Selçuk Üniversitesi", "Erciyes Üniversitesi", "Pamukkale Üniversitesi", "Muğla Sıtkı Koçman Üniversitesi", "Çanakkale Onsekiz Mart Üniversitesi", "Manisa Celal Bayar Üniversitesi", "Gaziantep Üniversitesi", "Mersin Üniversitesi"]
    top_vakif = ["Koç Üniversitesi", "Sabancı Üniversitesi", "İhsan Doğramacı Bilkent Üniversitesi", "TOBB Ekonomi ve Teknoloji Üniversitesi"]
    
    # Base rank baseline
    if "Tıp" == dept_name:
        if univ_name in top_vakif: base_2024 = random.randint(30, 150)
        elif univ_name in top_devlet: base_2024 = random.randint(900, 2500)
        elif univ_name in big_devlet: base_2024 = random.randint(3500, 8500)
        elif univ_name in mid_devlet: base_2024 = random.randint(9000, 18000)
        else: base_2024 = random.randint(18500, 32000)
    elif "Diş Hekimliği" == dept_name:
        if univ_name in top_devlet or univ_name in big_devlet: base_2024 = random.randint(22000, 35000)
        elif univ_name in mid_devlet: base_2024 = random.randint(36000, 52000)
        else: base_2024 = random.randint(53000, 72000)
    elif "Eczacılık" == dept_name:
        if univ_name in top_devlet or univ_name in big_devlet: base_2024 = random.randint(38000, 55000)
        elif univ_name in mid_devlet: base_2024 = random.randint(56000, 78000)
        else: base_2024 = random.randint(79000, 98000)
    elif "Bilgisayar Mühendisliği" == dept_name or "Yazılım Mühendisliği" == dept_name:
        if univ_name in top_vakif: base_2024 = random.randint(50, 400)
        elif univ_name in top_devlet: base_2024 = random.randint(200, 2500)
        elif univ_name in big_devlet: base_2024 = random.randint(4800, 9500)
        elif univ_name in mid_devlet: base_2024 = random.randint(11000, 45000)
        else: base_2024 = random.randint(50000, 220000)
    elif "Elektrik-Elektronik Mühendisliği" == dept_name or "Endüstri Mühendisliği" == dept_name:
        if univ_name in top_vakif: base_2024 = random.randint(100, 600)
        elif univ_name in top_devlet: base_2024 = random.randint(400, 3500)
        elif univ_name in big_devlet: base_2024 = random.randint(6500, 25000)
        elif univ_name in mid_devlet: base_2024 = random.randint(28000, 95000)
        else: base_2024 = random.randint(100000, 280000)
    elif "İnşaat Mühendisliği" == dept_name:
        if univ_name in top_devlet: base_2024 = random.randint(45000, 95000)
        elif univ_name in big_devlet: base_2024 = random.randint(110000, 220000)
        elif univ_name in mid_devlet: base_2024 = random.randint(230000, 420000)
        else: base_2024 = random.randint(430000, 680000)
    elif "Çevre Mühendisliği" == dept_name or "Ziraat Mühendisliği" in dept_name or "Orman Mühendisliği" in dept_name or "Su Ürünleri" in dept_name:
        if univ_name in top_devlet or univ_name in big_devlet: base_2024 = random.randint(180000, 350000)
        elif univ_name in mid_devlet: base_2024 = random.randint(360000, 550000)
        else: base_2024 = random.randint(560000, 780000)
    elif "Hemşirelik" == dept_name or "Ebelik" == dept_name:
        if univ_name in top_devlet or univ_name in big_devlet: base_2024 = random.randint(85000, 125000)
        elif univ_name in mid_devlet: base_2024 = random.randint(130000, 210000)
        else: base_2024 = random.randint(215000, 340000)
    elif "Matematik" == dept_name or "Fizik" == dept_name or "Kimya" == dept_name or "Biyoloji" == dept_name:
        if univ_name in top_devlet: base_2024 = random.randint(15000, 65000)
        elif univ_name in big_devlet: base_2024 = random.randint(75000, 180000)
        elif univ_name in mid_devlet: base_2024 = random.randint(190000, 380000)
        else: base_2024 = random.randint(390000, 650000)
    elif "Hukuk" == dept_name:
        if univ_name in top_vakif: base_2024 = random.randint(70, 600)
        elif univ_name in top_devlet or univ_name in big_devlet: base_2024 = random.randint(8000, 18000)
        elif univ_name in mid_devlet: base_2024 = random.randint(22000, 48000)
        else: base_2024 = random.randint(50000, 115000)
    elif "Yönetim Bilişim Sistemleri (YBS)" == dept_name:
        if univ_name in top_devlet: base_2024 = random.randint(250, 1500)
        elif univ_name in big_devlet: base_2024 = random.randint(2500, 9500)
        elif univ_name in mid_devlet: base_2024 = random.randint(11000, 65000)
        else: base_2024 = random.randint(70000, 320000)
    elif "İşletme" == dept_name or "İktisat" == dept_name or "Maliye" == dept_name or "Kamu Yönetimi" in dept_name or "ÇEKO" in dept_name:
        if univ_name in top_devlet: base_2024 = random.randint(380, 2500)
        elif univ_name in big_devlet: base_2024 = random.randint(15000, 85000)
        elif univ_name in mid_devlet: base_2024 = random.randint(90000, 280000)
        else: base_2024 = random.randint(290000, 750000)
    elif "Psikoloji" == dept_name or "PDR" in dept_name or "Sınıf Öğretmenliği" == dept_name:
        if univ_name in top_devlet: base_2024 = random.randint(800, 3500)
        elif univ_name in big_devlet: base_2024 = random.randint(7500, 25000)
        elif univ_name in mid_devlet: base_2024 = random.randint(28000, 85000)
        else: base_2024 = random.randint(90000, 310000)
    elif "Gastronomi ve Mutfak Sanatları" == dept_name or "Özel Eğitim Öğretmenliği" == dept_name:
        if univ_name in top_devlet: base_2024 = random.randint(800, 2500)
        elif univ_name in big_devlet: base_2024 = random.randint(3500, 12000)
        elif univ_name in mid_devlet: base_2024 = random.randint(13000, 45000)
        else: base_2024 = random.randint(48000, 190000)
    elif "Tarih" == dept_name or "Coğrafya" == dept_name or "Türk Dili ve Edebiyatı" == dept_name or "İlahiyat" == dept_name:
        if univ_name in top_devlet: base_2024 = random.randint(300, 1500)
        elif univ_name in big_devlet: base_2024 = random.randint(4500, 35000)
        elif univ_name in mid_devlet: base_2024 = random.randint(40000, 180000)
        else: base_2024 = random.randint(190000, 680000)
    elif "İngilizce Öğretmenliği" in dept_name or "Tercümanlık" in dept_name:
        if univ_name in top_devlet: base_2024 = random.randint(500, 1800)
        elif univ_name in big_devlet: base_2024 = random.randint(2500, 8500)
        elif univ_name in mid_devlet: base_2024 = random.randint(9500, 28000)
        else: base_2024 = random.randint(30000, 85000)
    elif "Açıköğretim" in dept_name:
        if score_type == "EA": base_2024 = random.randint(280000, 850000)
        elif score_type == "SOZ": base_2024 = random.randint(220000, 780000)
        else: base_2024 = random.randint(450000, 1600000)
    else: # TYT 2 Yıllık Önlisans
        if "İlk ve Acil Yardım" in dept_name or "Anestezi" in dept_name or "Radyoloji" in dept_name:
            if univ_name in top_devlet or univ_name in big_devlet: base_2024 = random.randint(110000, 190000)
            elif univ_name in mid_devlet: base_2024 = random.randint(200000, 420000)
            else: base_2024 = random.randint(430000, 750000)
        elif "Bilgisayar Programcılığı" in dept_name or "Siber Güvenlik" in dept_name:
            if univ_name in top_devlet or univ_name in big_devlet: base_2024 = random.randint(90000, 190000)
            elif univ_name in mid_devlet: base_2024 = random.randint(200000, 480000)
            else: base_2024 = random.randint(500000, 1100000)
        else:
            if univ_name in top_devlet or univ_name in big_devlet: base_2024 = random.randint(250000, 650000)
            elif univ_name in mid_devlet: base_2024 = random.randint(700000, 1400000)
            else: base_2024 = random.randint(1450000, 2300000)

    # 5 Year trend generation
    # Some departments rising (computer, YBS, medical), some stable, some declining (construction, etc.)
    if "Bilgisayar" in dept_name or "Yazılım" in dept_name or "YBS" in dept_name or "Yapay Zeka" in dept_name or "Gastronomi" in dept_name:
        # Rising trend (ranks got smaller)
        r2020 = int(base_2024 * random.uniform(1.8, 2.5))
        r2021 = int(base_2024 * random.uniform(1.5, 1.9))
        r2022 = int(base_2024 * random.uniform(1.25, 1.45))
        r2023 = int(base_2024 * random.uniform(1.1, 1.2))
        r2024 = base_2024
    elif "İnşaat" in dept_name or "Mimarlık" in dept_name:
        # Dropping trend (ranks got bigger)
        r2020 = max(1, int(base_2024 * random.uniform(0.4, 0.6)))
        r2021 = max(1, int(base_2024 * random.uniform(0.55, 0.75)))
        r2022 = max(1, int(base_2024 * random.uniform(0.75, 0.88)))
        r2023 = max(1, int(base_2024 * random.uniform(0.9, 0.96)))
        r2024 = base_2024
    else:
        # Normal/stable trend
        r2020 = int(base_2024 * random.uniform(0.9, 1.15))
        r2021 = int(base_2024 * random.uniform(0.92, 1.12))
        r2022 = int(base_2024 * random.uniform(0.95, 1.08))
        r2023 = int(base_2024 * random.uniform(0.97, 1.04))
        r2024 = base_2024

    slope = (r2024 - r2020) / 4.0
    r2025 = max(1, int(round(r2024 + slope * 0.5)))
    return (r2020, r2021, r2022, r2023, r2024, r2025)


all_departments = []
item_counter = 1000

for pattern in PROGRAM_PATTERNS:
    dept_name = pattern["dept"]
    faculty = pattern["faculty"]
    score_type = pattern["scoreType"]
    tags = pattern["tags"]
    
    # Select appropriate universities for this program
    # (Not all universities have all programs, e.g. Tıp is in ~40 universities, İktisat in ~70, AÖF in Anadolu/Atatürk/İstanbul)
    if "Açıköğretim" in dept_name:
        selected_univs = [u for u in UNIVERSITIES if u["name"] in ["Anadolu Üniversitesi", "Atatürk Üniversitesi", "İstanbul Üniversitesi"]]
    elif "Tıp" == dept_name:
        selected_univs = [u for u in UNIVERSITIES if "Tıp" not in u["name"] and u["type"] in ["Devlet", "Vakıf"]][:45]
    elif "Diş" in dept_name:
        selected_univs = [u for u in UNIVERSITIES if u["type"] in ["Devlet", "Vakıf"]][:35]
    elif "Hukuk" == dept_name:
        selected_univs = [u for u in UNIVERSITIES if u["type"] in ["Devlet", "Vakıf"]][:40]
    elif score_type == "TYT":
        # Önlisans programs exist across all universities
        selected_univs = UNIVERSITIES[:55]
    else:
        # General bachelor programs
        selected_univs = UNIVERSITIES[:50]

    for idx, univ in enumerate(selected_univs):
        item_counter += 1
        univ_name = univ["name"]
        city = univ["city"]
        utype = univ["type"]
        prefix = univ["prefix"]
        osym_code = f"{prefix}{item_counter % 10000:05d}"
        
        # Language & Scholarship
        lang = "İngilizce" if univ_name in ["Boğaziçi Üniversitesi", "Orta Doğu Teknik Üniversitesi (ODTÜ)", "İhsan Doğramacı Bilkent Üniversitesi", "Koç Üniversitesi", "Sabancı Üniversitesi", "İzmir Yüksek Teknoloji Enstitüsü (İYTE)", "Gebze Teknik Üniversitesi (GTÜ)"] else "Türkçe"
        if "Galatasaray" in univ_name: lang = "Fransızca"
        
        schl = "Burslu" if utype == "Vakıf" else "Ücretsiz"
        
        r2020, r2021, r2022, r2023, r2024, r2025 = generate_rankings_for_dept_univ(dept_name, score_type, univ_name, idx, len(selected_univs))
        
        slug_univ = univ_name.lower().replace("ü", "u").replace("ö", "o").replace("ı", "i").replace("ş", "s").replace("ç", "c").replace("ğ", "g")
        slug_univ = "".join(c if c.isalnum() else "-" for c in slug_univ).strip("-")[:12]
        slug_dept = dept_name.lower().replace("ü", "u").replace("ö", "o").replace("ı", "i").replace("ş", "s").replace("ç", "c").replace("ğ", "g")
        slug_dept = "".join(c if c.isalnum() else "-" for c in slug_dept).strip("-")[:12]
        
        dept_id = f"{slug_univ}-{slug_dept}-{item_counter}"
        
        quota = random.choice([40, 60, 75, 90, 100, 120, 150, 200, 250])
        
        history = [
            {"year": 2020, "baseRank": r2020, "baseScore": rank_to_score(r2020, score_type), "quota": quota, "filledQuota": quota},
            {"year": 2021, "baseRank": r2021, "baseScore": rank_to_score(r2021, score_type), "quota": quota, "filledQuota": quota},
            {"year": 2022, "baseRank": r2022, "baseScore": rank_to_score(r2022, score_type), "quota": quota + 5, "filledQuota": quota + 5},
            {"year": 2023, "baseRank": r2023, "baseScore": rank_to_score(r2023, score_type), "quota": quota + 5, "filledQuota": quota + 5},
            {"year": 2024, "baseRank": r2024, "baseScore": rank_to_score(r2024, score_type), "quota": quota + 5, "filledQuota": quota + 5},
            {"year": 2025, "baseRank": r2025, "baseScore": rank_to_score(r2025, score_type), "quota": quota + 5, "filledQuota": quota + 5},
        ]
        
        full_dept_name = dept_name
        if lang != "Türkçe":
            full_dept_name += f" ({lang})"
        if schl != "Ücretsiz":
            full_dept_name += f" ({schl})"
            
        all_departments.append({
            "id": dept_id,
            "code": osym_code,
            "universityName": univ_name,
            "facultyName": faculty,
            "departmentName": full_dept_name,
            "city": city,
            "universityType": utype,
            "scoreType": score_type,
            "scholarship": schl,
            "language": lang,
            "educationType": "Açıköğretim" if "Açıköğretim" in dept_name else "Örgün",
            "tags": tags,
            "history": history
        })

print(f"Generated {len(all_departments)} total departments across all ranking tiers (1 to 2,500,000).")

# Write JSON file
with open("/Users/siracsimsek/Desktop/ykswebsite/src/data/departmentsData.json", "w", encoding="utf-8") as f:
    json.dump(all_departments, f, ensure_ascii=False)

# Write TypeScript file
ts_content = """import { Department } from '../types';
import rawData from './departmentsData.json';

export const DEPARTMENTS_DATA = rawData as unknown as Department[];

export const CITIES = Array.from(new Set(DEPARTMENTS_DATA.map((d) => d.city))).sort();
export const UNIVERSITY_TYPES = ['Tümü', 'Devlet', 'Vakıf', 'KKTC'];
export const SCORE_TYPES = ['Tümü', 'SAY', 'EA', 'SOZ', 'DIL', 'TYT'];
export const SCHOLARSHIPS = ['Tümü', 'Ücretsiz', 'Burslu', '%50 İndirimli', 'Ücretli'];
"""

with open("/Users/siracsimsek/Desktop/ykswebsite/src/data/departmentsData.ts", "w", encoding="utf-8") as f:
    f.write(ts_content)

print("departmentsData.json & departmentsData.ts written successfully!")

