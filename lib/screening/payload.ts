import type {
  BasicScreeningRequest,
  ComprehensiveScreeningRequest,
  ScreeningFormState,
} from '@/lib/types/ml-screening'

export function calculateBMI(weightKg: number, heightCm: number): number {
  const heightM = heightCm / 100
  return Math.round((weightKg / (heightM * heightM)) * 10) / 10
}

export function buildBasicPayload(form: ScreeningFormState): BasicScreeningRequest {
  return {
    Age: Number(form.ageGroup),
    BMI: calculateBMI(Number(form.weight), Number(form.height)),
    HighBP: Number(form.highBP),
    GenHlth: Number(form.genHlth),
    PhysActivity: Number(form.physActivity),
    DiffWalk: Number(form.diffWalk),
    Smoker: Number(form.smoker),
  }
}

export function buildComprehensivePayload(
  form: ScreeningFormState,
): ComprehensiveScreeningRequest {
  return {
    HighBP: Number(form.highBP),
    HighChol: Number(form.highChol),
    BMI: calculateBMI(Number(form.weight), Number(form.height)),
    Smoker: Number(form.smoker),
    Stroke: Number(form.stroke),
    HeartDiseaseorAttack: Number(form.heartDisease),
    PhysActivity: Number(form.physActivity),
    Veggies: Number(form.veggies),
    HvyAlcoholConsump: Number(form.hvyAlcohol),
    GenHlth: Number(form.genHlth),
    MentHlth: Number(form.mentHlth),
    PhysHlth: Number(form.physHlth),
    DiffWalk: Number(form.diffWalk),
    Age: Number(form.ageGroup),
    Income: Number(form.income),
    NoDocbcCost: Number(form.noDocbcCost),
  }
}

export function mapRiskCategoryToLevel(
  category: 'rendah' | 'sedang' | 'tinggi',
): 'low' | 'medium' | 'high' {
  switch (category) {
    case 'rendah':
      return 'low'
    case 'sedang':
      return 'medium'
    case 'tinggi':
      return 'high'
  }
}

export const initialFormState: ScreeningFormState = {
  ageGroup: '',
  weight: '',
  height: '',
  highBP: '',
  genHlth: '',
  physActivity: '',
  diffWalk: '',
  smoker: '',
  highChol: '',
  stroke: '',
  heartDisease: '',
  veggies: '',
  hvyAlcohol: '',
  mentHlth: '',
  physHlth: '',
  income: '',
  noDocbcCost: '',
}
