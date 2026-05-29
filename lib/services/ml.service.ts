import type {
  BasicScreeningRequest,
  ComprehensiveScreeningRequest,
  PredictionResponse,
  ValidationErrorDetail,
} from '@/lib/types/ml-screening'

const ML_SERVICE_URL =
  process.env.ML_SERVICE_URL ?? 'https://iqbaalraihan-ai-engineer-diabesense.hf.space'

const REQUEST_TIMEOUT_MS = 10_000
const RETRY_DELAY_MS = 2_500
const MAX_ATTEMPTS = 2

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export class MLServiceCallError extends Error {
  status: number
  fieldErrors?: Record<string, string>
  details?: ValidationErrorDetail[]

  constructor(
    message: string,
    status: number,
    fieldErrors?: Record<string, string>,
    details?: ValidationErrorDetail[],
  ) {
    super(message)
    this.name = 'MLServiceCallError'
    this.status = status
    this.fieldErrors = fieldErrors
    this.details = details
  }
}

async function fetchWithTimeout(
  url: string,
  init: RequestInit,
): Promise<Response> {
  return fetch(url, {
    ...init,
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
  })
}

async function callEndpoint(
  endpoint: string,
  body: BasicScreeningRequest | ComprehensiveScreeningRequest,
): Promise<PredictionResponse> {
  let lastError: unknown

  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
    try {
      const res = await fetchWithTimeout(`${ML_SERVICE_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      if (res.status === 503 && attempt < MAX_ATTEMPTS - 1) {
        await delay(RETRY_DELAY_MS)
        continue
      }

      if (!res.ok) {
        let details: ValidationErrorDetail[] | undefined
        try {
          const errBody = await res.json()
          details = errBody.detail
        } catch {
          // ignore parse error
        }

        throw new MLServiceCallError(
          `ML service responded with ${res.status}`,
          res.status,
          undefined,
          details,
        )
      }

      return (await res.json()) as PredictionResponse
    } catch (err) {
      lastError = err

      if (err instanceof MLServiceCallError) {
        if (err.status === 503 && attempt < MAX_ATTEMPTS - 1) {
          await delay(RETRY_DELAY_MS)
          continue
        }
        throw err
      }

      if (attempt < MAX_ATTEMPTS - 1) {
        await delay(RETRY_DELAY_MS)
        continue
      }
    }
  }

  if (lastError instanceof MLServiceCallError) throw lastError
  throw new MLServiceCallError(
    'Gagal menghubungi layanan ML. Periksa koneksi internet Anda.',
    503,
  )
}

export async function predictBasic(body: BasicScreeningRequest): Promise<PredictionResponse> {
  return callEndpoint('/predict/basic', body)
}

export async function predictComprehensive(
  body: ComprehensiveScreeningRequest,
): Promise<PredictionResponse> {
  return callEndpoint('/predict/comprehensive', body)
}

export async function checkMLHealth(): Promise<boolean> {
  try {
    const res = await fetchWithTimeout(`${ML_SERVICE_URL}/health`, { method: 'GET' })
    return res.ok
  } catch {
    return false
  }
}
