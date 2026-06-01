export type RiskCategory = 'rendah' | 'sedang' | 'tinggi'
export type ScreeningMode = 'basic' | 'comprehensive'

export interface BasicScreeningRequest {
  Age: number
  BMI: number
  HighBP: number
  GenHlth: number
  PhysActivity: number
  DiffWalk: number
  Smoker: number
}

export interface ComprehensiveScreeningRequest {
  HighBP: number
  HighChol: number
  BMI: number
  Smoker: number
  Stroke: number
  HeartDiseaseorAttack: number
  PhysActivity: number
  Veggies: number
  HvyAlcoholConsump: number
  GenHlth: number
  MentHlth: number
  PhysHlth: number
  DiffWalk: number
  Age: number
  Income: number
  NoDocbcCost: number
}

export interface PredictionResponse {
  probability: number
  risk_category: RiskCategory
  threshold_used: number
  mode: ScreeningMode
  disclaimer?: string
}

export interface ExplainRequest {
  probability: number
  risk_category: RiskCategory
}

export interface ExplainResponse {
  penjelasan: string
}

export interface PredictionWithExplainResponse extends PredictionResponse {
  penjelasan?: string | null
}

export interface ValidationErrorDetail {
  loc: (string | number)[]
  msg: string
  type: string
}

export interface MLServiceError {
  status: number
  message: string
  fieldErrors?: Record<string, string>
}

export interface ScreeningFormState {
  ageGroup: string
  weight: string
  height: string
  highBP: string
  genHlth: string
  physActivity: string
  diffWalk: string
  smoker: string
  highChol: string
  stroke: string
  heartDisease: string
  veggies: string
  hvyAlcohol: string
  mentHlth: string
  physHlth: string
  income: string
  noDocbcCost: string
}
