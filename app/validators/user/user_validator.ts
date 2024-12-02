
    import vine from '@vinejs/vine'
    import { Infer } from '@vinejs/vine/types'
    
    /**
     * Validates the create action
     */
    export const createUserValidator = vine.compile(
      vine.object({
        name: vine.string(),
      })
    )

    export type CreateUserType = Infer<typeof createUserValidator>

    /**
     * Validates the update action
     */
    export const updateUserValidator = vine.compile(
      vine.object({
        name: vine.string(),
      })
    )

    export type UpdateUserType = Infer<typeof updateUserValidator>

    
    