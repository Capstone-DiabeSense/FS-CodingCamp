import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

const resources = {
  id: {
    translation: {
      "Dashboard": "Dashboard",
      "Skrining": "Skrining",
      "Riwayat": "Riwayat",
      "Reminder": "Pengingat",
      "Profile": "Profil",
      "Logout": "Keluar",
      "Login": "Masuk",
      "Language": "Bahasa",
      "Theme": "Tema",
      "Light": "Terang",
      "Dark": "Gelap",
      "hero_badge": "Platform Skrining Diabetes Terpercaya",
      "hero_title_1": "Kenali Risiko Diabetes Anda Lebih Awal dengan",
      "hero_subtitle": "Deteksi dini adalah kunci pencegahan. Lakukan skrining risiko diabetes secara mandiri, cepat, dan akurat dari mana saja.",
      "hero_btn_1": "Coba Skrining Sekarang",
      "hero_btn_2": "Lihat Dashboard Analitik"
    }
  },
  en: {
    translation: {
      "Dashboard": "Dashboard",
      "Skrining": "Screening",
      "Riwayat": "History",
      "Reminder": "Reminder",
      "Profile": "Profile",
      "Logout": "Logout",
      "Login": "Login",
      "Language": "Language",
      "Theme": "Theme",
      "Light": "Light",
      "Dark": "Dark",
      "hero_badge": "Trusted Diabetes Screening Platform",
      "hero_title_1": "Know Your Diabetes Risk Early with",
      "hero_subtitle": "Early detection is key to prevention. Screen your diabetes risk independently, quickly, and accurately from anywhere.",
      "hero_btn_1": "Try Screening Now",
      "hero_btn_2": "View Analytics Dashboard"
    }
  }
}

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'id', // default language
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  })

export default i18n
