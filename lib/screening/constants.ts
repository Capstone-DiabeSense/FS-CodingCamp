export interface SelectOption {
  value: string
  label: string
}

export const AGE_GROUPS: SelectOption[] = [
  { value: '1', label: '18–24 tahun' },
  { value: '2', label: '25–29 tahun' },
  { value: '3', label: '30–34 tahun' },
  { value: '4', label: '35–39 tahun' },
  { value: '5', label: '40–44 tahun' },
  { value: '6', label: '45–49 tahun' },
  { value: '7', label: '50–54 tahun' },
  { value: '8', label: '55–59 tahun' },
  { value: '9', label: '60–64 tahun' },
  { value: '10', label: '65–69 tahun' },
  { value: '11', label: '70–74 tahun' },
  { value: '12', label: '75–79 tahun' },
  { value: '13', label: '80 tahun ke atas' },
]

/** Income 1 = terendah, 8 = tertinggi */
export const INCOME_BRACKETS: SelectOption[] = [
  { value: '1', label: 'Kurang dari Rp 2 juta/bulan' },
  { value: '2', label: 'Rp 2–4 juta/bulan' },
  { value: '3', label: 'Rp 4–6 juta/bulan' },
  { value: '4', label: 'Rp 6–8 juta/bulan' },
  { value: '5', label: 'Rp 8–12 juta/bulan' },
  { value: '6', label: 'Rp 12–16 juta/bulan' },
  { value: '7', label: 'Rp 16–25 juta/bulan' },
  { value: '8', label: 'Lebih dari Rp 25 juta/bulan' },
]

export const GENHLTH_OPTIONS: SelectOption[] = [
  { value: '1', label: 'Sangat baik' },
  { value: '2', label: 'Baik' },
  { value: '3', label: 'Cukup baik' },
  { value: '4', label: 'Kurang baik' },
  { value: '5', label: 'Buruk' },
]

export const BINARY_OPTIONS: SelectOption[] = [
  { value: '1', label: 'Ya' },
  { value: '0', label: 'Tidak' },
]

export const FIELD_LABELS: Record<string, string> = {
  ageGroup: 'Kelompok usia',
  weight: 'Berat badan',
  height: 'Tinggi badan',
  highBP: 'Tekanan darah tinggi',
  genHlth: 'Kesehatan umum',
  physActivity: 'Aktivitas fisik',
  diffWalk: 'Kesulitan berjalan',
  smoker: 'Pernah merokok',
  highChol: 'Kolesterol tinggi',
  stroke: 'Riwayat stroke',
  heartDisease: 'Penyakit jantung / serangan jantung',
  veggies: 'Konsumsi sayur',
  hvyAlcohol: 'Konsumsi alkohol berat',
  mentHlth: 'Hari kesehatan mental buruk',
  physHlth: 'Hari kesehatan fisik buruk',
  income: 'Tingkat penghasilan',
  noDocbcCost: 'Tidak periksa dokter karena biaya',
}

/** Map API PascalCase field → form field key */
export const API_FIELD_TO_FORM: Record<string, string> = {
  Age: 'ageGroup',
  BMI: 'bmi',
  HighBP: 'highBP',
  GenHlth: 'genHlth',
  PhysActivity: 'physActivity',
  DiffWalk: 'diffWalk',
  Smoker: 'smoker',
  HighChol: 'highChol',
  Stroke: 'stroke',
  HeartDiseaseorAttack: 'heartDisease',
  Veggies: 'veggies',
  HvyAlcoholConsump: 'hvyAlcohol',
  MentHlth: 'mentHlth',
  PhysHlth: 'physHlth',
  Income: 'income',
  NoDocbcCost: 'noDocbcCost',
}

export const DEFAULT_DISCLAIMER =
  'Hasil ini bersifat skrining indikatif, bukan diagnosis medis. Konsultasikan dengan tenaga medis untuk evaluasi dan penanganan yang tepat.'
