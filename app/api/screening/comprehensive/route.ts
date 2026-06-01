import { NextResponse } from 'next/server'
import { extractBearerToken, verifyAuthToken } from '@/lib/auth-server'
import { mapValidationErrors, getErrorMessage } from '@/lib/screening/errors'
import {
  MLServiceCallError,
  fetchExplanationForPrediction,
  predictComprehensive,
} from '@/lib/services/ml.service'
import type { ComprehensiveScreeningRequest } from '@/lib/types/ml-screening'

export async function POST(request: Request) {
  const token = extractBearerToken(request)
  if (!token) {
    return NextResponse.json(
      { message: 'Autentikasi diperlukan untuk skrining komprehensif.' },
      { status: 401 },
    )
  }

  const user = await verifyAuthToken(token)
  if (!user) {
    return NextResponse.json(
      { message: 'Sesi tidak valid. Silakan login kembali.' },
      { status: 401 },
    )
  }

  try {
    const body = (await request.json()) as ComprehensiveScreeningRequest
    const result = await predictComprehensive(body)
    const penjelasan = await fetchExplanationForPrediction(result)
    return NextResponse.json({ ...result, penjelasan })
  } catch (err) {
    if (err instanceof MLServiceCallError) {
      if (err.status === 422 && err.details) {
        const fieldErrors = mapValidationErrors(err.details)
        return NextResponse.json(
          { message: getErrorMessage(422), fieldErrors },
          { status: 422 },
        )
      }
      return NextResponse.json(
        { message: getErrorMessage(err.status) },
        { status: err.status },
      )
    }
    return NextResponse.json(
      { message: getErrorMessage(500) },
      { status: 500 },
    )
  }
}
