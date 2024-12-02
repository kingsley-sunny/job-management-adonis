import vine from '@vinejs/vine'
import { Infer } from '@vinejs/vine/types'
import Application, { ApplicationStatus } from '../../models/application.js'
import Job from '../../models/job.js'
import User from '../../models/user.js'

/**
 * Validates the create action
 */
export const createApplicationValidator = vine.compile(
  vine.object({
    user_id: vine.string().exists(async (db, value, field) => {
      return !!(await User.findByOrFail({ id: value }))
    }),
    job_id: vine.string().exists(async (db, value, field) => {
      return !!(await Job.findByOrFail({ id: value }))
    }),
  })
)

export type CreateApplicationType = Infer<typeof createApplicationValidator>

/**
 * Validates the update action
 */
export const updateApplicationValidator = vine.compile(
  vine.object({
    status: vine.enum([
      ApplicationStatus.PENDING,
      ApplicationStatus.ACCEPTED,
      ApplicationStatus.REJECTED,
      ApplicationStatus.REVIEWED,
    ]),
  })
)

export type UpdateApplicationType = Infer<typeof updateApplicationValidator>

export const deleteApplicationValidator = vine.compile(
  vine.object({
    id: vine.string().exists(async (db, value, field) => {
      const job = await Application.find(value)

      if (!job) {
        field.report('Job Not found', 'database.exists', field)
      }

      return true
    }),
  })
)

export type DeleteApplicationType = Infer<typeof deleteApplicationValidator>
