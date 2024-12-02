
    import vine from '@vinejs/vine'
    import { Infer } from '@vinejs/vine/types'
    
    /**
     * Validates the create action
     */
    export const createAuthValidator = vine.compile(
      vine.object({
        name: vine.string(),
      })
    )

    export type CreateAuthType = Infer<typeof createAuthValidator>

    /**
     * Validates the update action
     */
    export const updateAuthValidator = vine.compile(
      vine.object({
        name: vine.string(),
      })
    )

    export type UpdateAuthType = Infer<typeof updateAuthValidator>

    
    