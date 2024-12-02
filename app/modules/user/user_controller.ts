// import type { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'
import { BaseController } from '../../base/base_controller.js'
import { createUserValidator, updateUserValidator } from '../../validators/user/user_validator.js'
import UserService from './user_service.js'

@inject()
export default class UserController extends BaseController {
  constructor(
    protected ctx: HttpContext,
    private readonly userService: UserService
  ) {
    super()
  }

  /**
   * @create
   * @operationId getProducts
   * @description returns the health of the server
   * @requestBody <createUserValidator> 200
   * @responseBody 200 - <User> - OK
   * @responseHeader 200 - X-pages - A description of the header - @example(test)
   */
  async create() {
    const isApiRequest = this.ctx.request.header('accept')?.includes('application/json') as boolean
    const body = await this.ctx.request.validateUsing(createUserValidator)
    const data = this.userService.create(body)

    if (isApiRequest) {
      return this.transformResponse(data, 'Success')
    }

    return this.ctx.response.redirect('home')
  }

  /**
   * @update
   * @operationId getProducts
   * @description returns the health of the server
   * @requestBody <updateUserValidator> 200
   * @paramPath id - The ID of the source - @type(number) @required
   * @responseBody 200 - <User> - OK
   * @responseHeader 200 - X-pages - A description of the header - @example(test)
   */
  async update() {
    const id = await this.ctx.params?.id
    const isApiRequest = this.ctx.request.header('accept')?.includes('application/json') as boolean
    const body = await this.ctx.request.validateUsing(updateUserValidator)
    const data = this.userService.update(id, body)

    if (isApiRequest) {
      return this.transformResponse(data, 'Success')
    }

    return this.ctx.response.redirect('home')
  }

  /**
   * @find
   * @operationId getProducts
   * @description returns the health of the server
   * @paramUse(sortable, filterable)
   * @responseBody 200 - <User[]>.paginated() - OK
   * @responseHeader 200 - X-pages - A description of the header - @example(test)
   */
  async find() {
    const view = this.ctx.view
    const query = this.ctx.request.qs()
    const isApiRequest = this.ctx.request.header('accept')?.includes('application/json') as boolean
    const data = await this.userService.find(query, query)

    if (isApiRequest) {
      return this.transformResponse(data, 'Success')
    }

    return view.render('pages/admin/users', { users: data })
  }

  /**
   * @findById
   * @operationId getProducts
   * @description returns the health of the server
   * @paramPath id - The ID of the source - @type(number) @required
   * @responseBody 200 - <User> - OK
   * @responseHeader 200 - X-pages - A description of the header - @example(test)
   */
  async findById() {
    const id = this.ctx.params?.id
    const data = this.userService.findById(id)

    return this.transformResponse(data, 'Success')
  }

  /**
   * @delete
   * @operationId getProducts
   * @description returns the health of the server
   * @paramPath id - The ID of the source - @type(number) @required
   * @responseBody 200 - <User> - OK
   * @responseHeader 200 - X-pages - A description of the header - @example(test)
   */
  async delete() {
    const id = this.ctx.params?.id
    const isApiRequest = this.ctx.request.header('accept')?.includes('application/json') as boolean
    const data = this.userService.delete(id)

    if (isApiRequest) {
      return this.transformResponse(data, 'Success')
    }

    return this.ctx.response.redirect('home')
  }
}
