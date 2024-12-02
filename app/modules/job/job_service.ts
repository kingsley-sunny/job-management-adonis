// import type { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'
import { Exception } from '@adonisjs/core/exceptions'
import { HttpContext } from '@adonisjs/core/http'
import HttpStatus from 'http-status'
import { FetchColumn, FetchQuery } from '../../base/base_interface.js'
import Application from '../../models/application.js'
import Job from '../../models/job.js'
import User from '../../models/user.js'
import { ApplyJobType, CreateJobType, UpdateJobType } from '../../validators/job/job_validator.js'
import ApplicationService from '../application/application_service.js'

@inject()
export default class JobService {
  constructor(
    protected ctx: HttpContext,
    protected applicationService: ApplicationService
  ) {}

  async create(data: CreateJobType) {
    try {
      const { company_name, description, location, salary, title, type } = data

      const job = await Job.create({
        company_name,
        description,
        location,
        created_by: this.ctx.auth.user?.id,
        salary,
        title,
        type,
      })

      return job
    } catch (error) {
      throw new Exception(error.message, {
        code: HttpStatus['500_NAME'],
        status: HttpStatus.INTERNAL_SERVER_ERROR,
      })
    }
  }

  async update(id: string, data: UpdateJobType) {
    try {
      let job = await this.findById(id)

      if (!job) {
        throw new Exception('Job NOt found')
      }

      job = job.merge({ ...data })
      job = await job.save()
      return job
    } catch (error) {
      throw new Exception(error.message, {
        code: HttpStatus['500_NAME'],
        status: HttpStatus.INTERNAL_SERVER_ERROR,
      })
    }
  }

  async find(columns: FetchColumn<Job>, query: FetchQuery) {
    try {
      const jobs = await Job.findWithQuery(columns, query)

      return jobs
    } catch (error) {
      throw new Exception(error.message, {
        code: HttpStatus['500_NAME'],
        status: HttpStatus.INTERNAL_SERVER_ERROR,
      })
    }
  }

  async findOne(columns?: FetchColumn<Job>) {
    try {
      const job = await Job.findWithQuery(columns).preload('createdBy').first()

      if (!job) {
        throw new Exception('Job Not found')
      }

      return job
    } catch (error) {
      throw new Exception(error.message, {
        code: HttpStatus['500_NAME'],
        status: HttpStatus.INTERNAL_SERVER_ERROR,
      })
    }
  }

  async findById(id: string) {
    try {
      const job = await Job.find(id)

      return job
    } catch (error) {
      throw new Exception(error.message, {
        code: HttpStatus['500_NAME'],
        status: HttpStatus.INTERNAL_SERVER_ERROR,
      })
    }
  }

  async apply(body: ApplyJobType) {
    try {
      const { id: user_id } = this.ctx.auth.user as User
      const { job_id } = body

      // check if the user has applied for the job before
      let application = await Application.findWithQuery({ job_id, user_id }).first()

      if (application) {
        this.ctx.session.flash('notification', {
          type: 'success',
          message: 'Job has been applied',
        })
      }

      application = await this.applicationService.create({ job_id, user_id })

      return application
    } catch (error) {
      throw new Exception(error.message, {
        code: HttpStatus['500_NAME'],
        status: HttpStatus.INTERNAL_SERVER_ERROR,
      })
    }
  }

  async delete(id: string) {
    try {
      let job: any = await this.findById(id)
      job = await job?.delete()

      return job
    } catch (error) {
      throw new Exception(error.message, {
        code: HttpStatus['500_NAME'],
        status: HttpStatus.INTERNAL_SERVER_ERROR,
      })
    }
  }
}
