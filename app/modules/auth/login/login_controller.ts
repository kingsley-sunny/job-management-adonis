// import type { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'
import { BaseController } from '../../../base/base_controller.js'
import { createLoginValidator } from '../../../validators/auth/login/login_validator.js'
import LoginService from './login_service.js'

@inject()
export default class LoginController extends BaseController {
  constructor(
    protected ctx: HttpContext,
    private readonly loginService: LoginService
  ) {
    super()
  }

  /**
   * @create
   * @operationId getProducts
   * @description returns the health of the server
   * @requestBody <createLoginValidator> 200
   * @responseBody 200 - {} - OK
   * @responseHeader 200 - X-pages - A description of the header - @example(test)
   */
  async create() {
    const isApiRequest = this.ctx.request.header('accept')?.includes('application/json') as boolean
    const body = await this.ctx.request.validateUsing(createLoginValidator)
    const data = await this.loginService.create(body)
    console.log('🚀 ~~ LoginController ~~ create ~~ data:', data)

    if (isApiRequest) {
      return this.transformResponse(data, 'Success')
    }

    console.log('🚀 ~~ LoginController ~~ create ~~ nextUrl:', this.ctx.auth)

    if (body.nextUrl) {
      if (data.role === 'USER' && body.nextUrl.includes('/admin')) {
        return this.ctx.response.redirect('/')
      }
      return this.ctx.response.redirect(body.nextUrl)
    }

    if (data.role === 'ADMIN') {
      return this.ctx.response.redirect('/admin')
    }

    return this.ctx.response.redirect('/')
  }
}
