import { API_FIELD_TO_FORM, FIELD_LABELS } from '@/lib/screening/constants'
import type { ValidationErrorDetail } from '@/lib/types/ml-screening'

export function mapValidationErrors(
  details: ValidationErrorDetail[],
): Record<string, string> {
  const errors: Record<string, string> = {}

  for (const detail of details) {
    const apiField = detail.loc.find((l) => typeof l === 'string' && l !== 'body') as
      | string
      | undefined
    const formField = apiField ? (API_FIELD_TO_FORM[apiField] ?? apiField) : 'general'
    const label = FIELD_LABELS[formField] ?? apiField ?? 'Input'
    errors[formField] = `${label}: ${humanizeValidationMsg(detail.msg)}`
  }

  return errors
}

function humanizeValidationMsg(msg: string): string {
  if (msg.includes('greater than or equal')) return 'nilai terlalu kecil'
  if (msg.includes('less than or equal')) return 'nilai terlalu besar'
  if (msg.includes('Input should be a valid integer')) return 'harus berupa angka bulat'
  if (msg.includes('Input should be a valid number')) return 'harus berupa angka'
  if (msg.includes('Field required')) return 'wajib diisi'
  return 'tidak valid'
}

export function getErrorMessage(status: number, body?: { message?: string }): string {
  switch (status) {
    case 422:
      return 'Beberapa data tidak valid. Periksa kembali isian form Anda.'
    case 503:
      return 'Layanan sedang mempersiapkan model, coba lagi dalam beberapa detik.'
    case 500:
      return 'Terjadi kesalahan saat menghitung risiko. Silakan coba lagi.'
    default:
      return body?.message ?? 'Terjadi kesalahan. Silakan coba lagi.'
  }
}
