// import type { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'
import { BaseController } from '../../base/base_controller.js'
import {
  createApplicationValidator,
  deleteApplicationValidator,
  updateApplicationValidator,
} from '../../validators/application/application_validator.js'
import ApplicationService from './application_service.js'

@inject()
export default class ApplicationController extends BaseController {
  constructor(
    protected ctx: HttpContext,
    private readonly applicationService: ApplicationService
  ) {
    super()
  }

  /**
   * @create
   * @operationId getProducts
   * @description returns the health of the server
   * @requestBody <createApplicationValidator> 200
   * @responseBody 200 - <Application> - OK
   * @responseHeader 200 - X-pages - A description of the header - @example(test)
   */
  async create() {
    const isApiRequest = this.ctx.request.header('accept')?.includes('application/json') as boolean
    const body = await this.ctx.request.validateUsing(createApplicationValidator)
    const data = await this.applicationService.create(body)

    if (isApiRequest) {
      return this.transformResponse(data, 'Success')
    }

    return this.ctx.response.redirect('/admin/applications')
  }

  /**
   * @update
   * @operationId getProducts
   * @description returns the health of the server
   * @requestBody <updateApplicationValidator> 200
   * @paramPath id - The ID of the source - @type(number) @required
   * @responseBody 200 - <Application> - OK
   * @responseHeader 200 - X-pages - A description of the header - @example(test)
   */
  async update() {
    const id = await this.ctx.params?.id
    const isApiRequest = this.ctx.request.header('accept')?.includes('application/json') as boolean
    const body = await this.ctx.request.validateUsing(updateApplicationValidator)
    const data = await this.applicationService.update(id, body)

    if (isApiRequest) {
      return this.transformResponse(data, 'Success')
    }

    return this.ctx.response.redirect('/admin/applications')
  }

  /**
   * @find
   * @operationId getProducts
   * @description returns the health of the server
   * @paramUse(sortable, filterable)
   * @responseBody 200 - <Application[]>.paginated() - OK
   * @responseHeader 200 - X-pages - A description of the header - @example(test)
   */
  async find() {
    const view = this.ctx.view
    const isApiRequest = this.ctx.request.header('accept')?.includes('application/json') as boolean
    const query = this.ctx.request.qs()
    const user = this.ctx.auth.user
    const data = await this.applicationService.find({ ...query, user_id: user?.id }, query)

    if (isApiRequest) {
      return this.transformResponse(data, 'Success')
    }

    return view.render('pages/applications', { applications: data })
  }

  async adminFind() {
    const view = this.ctx.view
    const isApiRequest = this.ctx.request.header('accept')?.includes('application/json') as boolean
    const query = this.ctx.request.qs()
    const data = await this.applicationService.find(query, query)

    if (isApiRequest) {
      return this.transformResponse(data, 'Success')
    }

    return view.render('pages/admin/applications', { applications: data })
  }

  /**
   * @findById
   * @operationId getProducts
   * @description returns the health of the server
   * @paramPath id - The ID of the source - @type(number) @required
   * @responseBody 200 - <Application> - OK
   * @responseHeader 200 - X-pages - A description of the header - @example(test)
   */
  async findById() {
    const view = this.ctx.view
    const isApiRequest = this.ctx.request.header('accept')?.includes('application/json') as boolean
    const id = this.ctx.params?.id
    const data = await this.applicationService.findById(id)

    if (isApiRequest) {
      return this.transformResponse(data, 'Success')
    }

    return view.render('home', { data })
  }

  /**
   * @delete
   * @operationId getProducts
   * @description returns the health of the server
   * @paramPath id - The ID of the source - @type(number) @required
   * @responseBody 200 - <Application> - OK
   * @responseHeader 200 - X-pages - A description of the header - @example(test)
   */
  async delete() {
    const id = this.ctx.params?.id
    const isApiRequest = this.ctx.request.header('accept')?.includes('application/json') as boolean
    const body = await this.ctx.request.validateUsing(deleteApplicationValidator)
    const data: any = await this.applicationService.delete(body.id)

    if (isApiRequest) {
      return this.transformResponse(data, 'Success')
    }

    const user = this.ctx.auth.user

    if (user?.role === 'ADMIN') {
      return this.ctx.response.redirect('/admin/applications')
    }

    return this.ctx.response.redirect('/applications')
  }
}
