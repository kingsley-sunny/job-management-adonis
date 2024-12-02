import vine from '@vinejs/vine'
import { Infer } from '@vinejs/vine/types'
import Job, { JobType } from '../../models/job.js'

/**
 * Validates the create action
 */
export const createJobValidator = vine.compile(
  vine.object({
    title: vine.string(),
    description: vine.string(),
    company_name: vine.string(),
    location: vine.string().optional(),
    salary: vine.string(),
    type: vine.enum([JobType.FULL_TIME, JobType.INTERNSHIP, JobType.REMOTE, JobType.PART_TIME]),
  })
)

export type CreateJobType = Infer<typeof createJobValidator>

/**
 * Validates the update action
 */
export const updateJobValidator = vine.compile(
  vine.object({
    title: vine.string().optional(),
    description: vine.string().optional(),
    company_name: vine.string().optional(),
    location: vine.string().optional().optional(),
    salary: vine.string().optional(),
    type: vine
      .enum([JobType.FULL_TIME, JobType.INTERNSHIP, JobType.REMOTE, JobType.PART_TIME])
      .optional(),
  })
)

export type UpdateJobType = Infer<typeof updateJobValidator>

export const deleteJobValidator = vine.compile(
  vine.object({
    id: vine.string(),
  })
)

export type DeleteJobType = Infer<typeof deleteJobValidator>

export const applyJobValidator = vine.compile(
  vine.object({
    job_id: vine.string().exists(async (db, value, field) => {
      const job = await Job.find(value)

      if (!job) {
        field.report('Job Not found', 'database.exists', field)
      }

      return true
    }),
  })
)

export type ApplyJobType = Infer<typeof applyJobValidator>
