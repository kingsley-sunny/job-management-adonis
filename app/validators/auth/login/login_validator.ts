import vine from '@vinejs/vine'
import { Infer } from '@vinejs/vine/types'
import User from '../../../models/user.js'

/**
 * Validates the create action
 */
export const createLoginValidator = vine.compile(
  vine.object({
    email: vine
      .string()
      .email()
      .exists(async (db, value, field) => {
        const user = await User.findWithQuery({ email: value }).first()

        if (!user) {
          field.report('User Does not exist', 'database.exists', field)
        }

        return true
      }),
    password: vine.string().minLength(3),
    nextUrl: vine.string().optional(),
  })
)

export type CreateLoginType = Infer<typeof createLoginValidator>

/**
 * Validates the update action
 */
export const updateLoginValidator = vine.compile(
  vine.object({
    name: vine.string(),
  })
)

export type UpdateLoginType = Infer<typeof updateLoginValidator>
