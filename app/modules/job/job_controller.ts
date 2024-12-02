// import type { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'
import { BaseController } from '../../base/base_controller.js'
import {
  applyJobValidator,
  createJobValidator,
  deleteJobValidator,
  updateJobValidator,
} from '../../validators/job/job_validator.js'
import JobService from './job_service.js'

@inject()
export default class JobController extends BaseController {
  constructor(
    protected ctx: HttpContext,
    private readonly jobService: JobService
  ) {
    super()
  }

  /**
   * @create
   * @operationId getProducts
   * @description returns the health of the server
   * @requestBody <createJobValidator> 200
   * @responseBody 200 - <Job> - OK
   * @responseHeader 200 - X-pages - A description of the header - @example(test)
   */
  async create() {
    const isApiRequest = this.ctx.request.header('accept')?.includes('application/json') as boolean
    const body = await this.ctx.request.validateUsing(createJobValidator)
    const data = await this.jobService.create(body)

    if (isApiRequest) {
      return this.transformResponse(data, 'Success')
    }

    return this.ctx.response.redirect('/admin/jobs')
  }

  /**
   * @update
   * @operationId getProducts
   * @description returns the health of the server
   * @requestBody <updateJobValidator> 200
   * @paramPath id - The ID of the source - @type(number) @required
   * @responseBody 200 - <Job> - OK
   * @responseHeader 200 - X-pages - A description of the header - @example(test)
   */
  async update() {
    const id = await this.ctx.params?.id
    const isApiRequest = this.ctx.request.header('accept')?.includes('application/json') as boolean
    const body = await this.ctx.request.validateUsing(updateJobValidator)
    const data = await this.jobService.update(id, body)

    if (isApiRequest) {
      return this.transformResponse(data, 'Success')
    }

    return this.ctx.response.redirect('/admin/jobs')
  }

  /**
   * @find
   * @operationId getProducts
   * @description returns the health of the server
   * @paramUse(sortable, filterable)
   * @responseBody 200 - <Job[]>.paginated() - OK
   * @responseHeader 200 - X-pages - A description of the header - @example(test)
   */
  async find() {
    const view = this.ctx.view
    const isApiRequest = this.ctx.request.header('accept')?.includes('application/json') as boolean
    const query = this.ctx.request.qs()
    const data = await this.jobService.find(query, query)

    if (isApiRequest) {
      return this.transformResponse(data, 'Success')
    }

    return view.render('pages/jobs', { jobs: data })
  }

  async AdminFind() {
    const view = this.ctx.view
    const isApiRequest = this.ctx.request.header('accept')?.includes('application/json') as boolean
    const query = this.ctx.request.qs()
    const data = await this.jobService.find(query, query)

    if (isApiRequest) {
      return this.transformResponse(data, 'Success')
    }

    return view.render('pages/admin/jobs', { jobs: data })
  }

  /**
   * @findById
   * @operationId getProducts
   * @description returns the health of the server
   * @paramPath id - The ID of the source - @type(number) @required
   * @responseBody 200 - <Job> - OK
   * @responseHeader 200 - X-pages - A description of the header - @example(test)
   */
  async findById() {
    const view = this.ctx.view
    const isApiRequest = this.ctx.request.header('accept')?.includes('application/json') as boolean
    const id = this.ctx.params?.id
    const data = await this.jobService.findOne({ id })

    if (isApiRequest) {
      return this.transformResponse(data, 'Success')
    }

    return view.render('pages/job-details', { job: data })
  }

  async findByIdAdmin() {
    const view = this.ctx.view
    const isApiRequest = this.ctx.request.header('accept')?.includes('application/json') as boolean
    const id = this.ctx.params?.id
    const data = await this.jobService.findOne({ id })

    if (isApiRequest) {
      return this.transformResponse(data, 'Success')
    }

    return view.render('pages/admin/job-details', { job: data })
  }

  async apply() {
    const view = this.ctx.view
    const isApiRequest = this.ctx.request.header('accept')?.includes('application/json') as boolean
    const body = await this.ctx.request.validateUsing(applyJobValidator)
    const data = await this.jobService.apply(body)

    this.ctx.session.flash('notification', {
      type: 'success',
      message: 'Application Successful',
    })

    if (isApiRequest) {
      return this.transformResponse(data, 'Success')
    }

    return this.ctx.response.redirect(`/jobs/${body.job_id}`)
  }

  /**
   * @delete
   * @operationId getProducts
   * @description returns the health of the server
   * @paramPath id - The ID of the source - @type(number) @required
   * @responseBody 200 - <Job> - OK
   * @responseHeader 200 - X-pages - A description of the header - @example(test)
   */
  async delete() {
    const id = this.ctx.params?.id
    const isApiRequest = this.ctx.request.header('accept')?.includes('application/json') as boolean
    const body = await this.ctx.request.validateUsing(deleteJobValidator)
    const data = await this.jobService.delete(body.id)

    if (isApiRequest) {
      return this.transformResponse(data, 'Success')
    }

    return this.ctx.response.redirect('/admin/jobs')
  }
}
