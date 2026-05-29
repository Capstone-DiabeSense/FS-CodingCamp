import { NextResponse } from 'next/server'
import { mapValidationErrors, getErrorMessage } from '@/lib/screening/errors'
import { MLServiceCallError, predictBasic } from '@/lib/services/ml.service'
import type { BasicScreeningRequest } from '@/lib/types/ml-screening'

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as BasicScreeningRequest
    const result = await predictBasic(body)
    return NextResponse.json(result)
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
