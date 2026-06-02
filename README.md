# Capstone-DiabeSense / FS-CodingCamp

Repository pengerjaan Capstone bagian Full Stack. Proyek ini dibangun menggunakan [Next.js](https://nextjs.org/) dan berbagai ekosistem modern untuk pengembangan web yang cepat dan andal.

## 🚀 Tech Stack Utama

- **Framework:** [Next.js 16](https://nextjs.org/) (React 19)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
- **UI Components:** [Radix UI](https://www.radix-ui.com/)
- **Backend/BaaS:** [Supabase](https://supabase.com/)
- **Form & Validation:** [React Hook Form](https://react-hook-form.com/) & [Zod](https://zod.dev/)
- **Icons:** [Lucide React](https://lucide.dev/)
- **Animation:** [Framer Motion](https://www.framer.com/motion/)

## 🛠️ Prasyarat (Prerequisites)

Pastikan sistem Anda sudah terinstal:
- [Node.js](https://nodejs.org/) (Versi terbaru atau LTS direkomendasikan)
- Package manager seperti `npm`, `yarn`, atau `pnpm` (disarankan menggunakan `pnpm` berdasarkan history terminal)

## 📦 Instalasi

1. Clone repositori ini:
   ```bash
   git clone https://github.com/Capstone-DiabeSense/FS-CodingCamp.git
   cd FS-CodingCamp
   ```

2. Instal dependensi:
   ```bash
   pnpm install
   # atau npm install / yarn install
   ```

3. Siapkan *Environment Variables*:
   Buat file `.env.local` di root folder proyek dan salin variabel dari `.env.example` (jika ada) dan sesuaikan nilainya, terutama untuk konfigurasi Supabase.

## 🚀 Menjalankan Server Pengembangan

Untuk menjalankan aplikasi di lingkungan pengembangan lokal:

```bash
pnpm dev
# atau npm run dev / yarn dev
```

Buka [http://localhost:3000](http://localhost:3000) di browser Anda untuk melihat hasilnya. Anda dapat mulai mengedit halaman dengan memodifikasi `app/page.tsx`. Halaman akan otomatis diperbarui saat Anda mengedit file.

## 📜 Skrip yang Tersedia

Dalam direktori proyek, Anda dapat menjalankan skrip berikut:

- `pnpm dev` : Menjalankan server pengembangan.
- `pnpm build` : Membangun aplikasi untuk tahap produksi (*production ready*).
- `pnpm start` : Menjalankan aplikasi yang sudah dibangun dalam mode produksi.
- `pnpm lint` : Menjalankan ESLint untuk memeriksa masalah statis di dalam kode.

## 📁 Struktur Direktori

Berikut adalah gambaran umum struktur direktori utama:
- `app/` - Direktori utama untuk App Router Next.js (berisi halaman, layout, dll).
- `components/` - Komponen UI React yang dapat digunakan kembali.
- `lib/` - Berisi utilitas pendukung (misal: konfigurasi database, helper functions).
- `public/` - Aset statis seperti gambar dan ikon.

## 🤝 Kontribusi (Contributing)

Jika Anda ingin berkontribusi pada repositori ini:
1. Pastikan Anda berada di branch `development` saat menarik (*pull*) perubahan terbaru.
2. Buat branch baru untuk setiap fitur atau perbaikan.
3. Gunakan panduan *commit message* yang jelas.
4. Buat Pull Request untuk me-review kode sebelum digabungkan ke `development`.
