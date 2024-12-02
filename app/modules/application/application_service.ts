// import type { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'
import { Exception } from '@adonisjs/core/exceptions'
import { HttpContext } from '@adonisjs/core/http'
import HttpStatus from 'http-status'
import { FetchColumn, FetchQuery } from '../../base/base_interface.js'
import Application from '../../models/application.js'
import User from '../../models/user.js'
import {
  CreateApplicationType,
  UpdateApplicationType,
} from '../../validators/application/application_validator.js'

@inject()
export default class ApplicationService {
  constructor(protected ctx: HttpContext) {}

  async create(data: CreateApplicationType) {
    try {
      const { user_id, job_id } = data
      let application = await Application.findWithQuery({
        user_id: user_id,
        job_id: job_id,
      }).first()

      if (!application) {
        application = await Application.create({ job_id, user_id })
      }

      return application
    } catch (error) {
      throw new Exception(error.message, {
        code: HttpStatus['500_NAME'],
        status: HttpStatus.INTERNAL_SERVER_ERROR,
      })
    }
  }

  async update(id: string, data: UpdateApplicationType) {
    try {
      const application = await this.findById(id)

      if (!application) {
        throw new Exception('Application not found')
      }

      application.status = data.status
      await application.save()

      return application
    } catch (error) {
      throw new Exception(error.message, {
        code: HttpStatus['500_NAME'],
        status: HttpStatus.INTERNAL_SERVER_ERROR,
      })
    }
  }

  async find(columns: FetchColumn<Application>, query: FetchQuery) {
    try {
      const applications = await Application.findWithQuery(columns, query)
        .preload('job')
        .preload('user')

      return applications
    } catch (error) {
      throw new Exception(error.message, {
        code: HttpStatus['500_NAME'],
        status: HttpStatus.INTERNAL_SERVER_ERROR,
      })
    }
  }

  async findOne(columns?: FetchColumn<Application>) {
    try {
      const application = await Application.findWithQuery(columns)
        .preload('job')
        .preload('user')
        .first()

      if (!application) {
        throw new Exception('Application not found')
      }

      return application
    } catch (error) {
      throw new Exception(error.message, {
        code: HttpStatus['500_NAME'],
        status: HttpStatus.INTERNAL_SERVER_ERROR,
      })
    }
  }

  async findById(id: string) {
    try {
      const application = await Application.findOrFail(id)

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
      // check if the user is an admin or the user is the one that applied for the job
      const user = this.ctx.auth.user as User
      let application: any = await this.findById(id)

      if (user.role === 'ADMIN' || user.id === application.user_id) {
        application = await application.delete()
      }

      return application
    } catch (error) {
      throw new Exception(error.message, {
        code: HttpStatus['500_NAME'],
        status: HttpStatus.INTERNAL_SERVER_ERROR,
      })
    }
  }
}
