import vine from '@vinejs/vine'
import { Infer } from '@vinejs/vine/types'

/**
 * Validates the create action
 */
export const createLoanValidator = vine.compile(
  vine.object({
    amount: vine.number(),
    term_months: vine.number(),
    purpose: vine.string().minLength(8),
  })
)

export type CreateLoanType = Infer<typeof createLoanValidator>

/**
 * Validates the update action
 */
export const updateLoanValidator = vine.compile(
  vine.object({
    name: vine.string(),
  })
)

export type UpdateLoanType = Infer<typeof updateLoanValidator>
