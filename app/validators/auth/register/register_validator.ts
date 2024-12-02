import vine from '@vinejs/vine'
import { Infer } from '@vinejs/vine/types'
import User from '../../../models/user.js'

/**
 * Validates the create action
 */
export const createRegisterValidator = vine.compile(
  vine.object({
    name: vine.string(),
    email: vine
      .string()
      .email()
      .exists(async (db, value, field) => {
        const user = await User.findWithQuery({ email: value }).first()

        if (user) {
          field.report('User exist already', 'database.exists', field)
        }

        return true
      }),
    password: vine.string().minLength(3),
    nextUrl: vine.string().optional(),
  })
)

export type CreateRegisterType = Infer<typeof createRegisterValidator>

/**
 * Validates the update action
 */
export const updateRegisterValidator = vine.compile(
  vine.object({
    name: vine.string(),
  })
)

export type UpdateRegisterType = Infer<typeof updateRegisterValidator>
