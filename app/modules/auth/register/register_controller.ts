// import type { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'
import { Exception } from '@adonisjs/core/exceptions'
import { HttpContext } from '@adonisjs/core/http'
import HttpStatus from 'http-status'
import { BaseController } from '../../../base/base_controller.js'
import { createRegisterValidator } from '../../../validators/auth/register/register_validator.js'
import RegisterService from './register_service.js'

@inject()
export default class RegisterController extends BaseController {
  constructor(
    protected ctx: HttpContext,
    private readonly registerService: RegisterService
  ) {
    super()
  }

  /**
   * @create
   * @operationId getProducts
   * @description returns the health of the server
   * @requestBody <createRegisterValidator> 200
   * @responseBody 200 - {} - OK
   * @responseHeader 200 - X-pages - A description of the header - @example(test)
   */
  async create() {
    try {
      const isApiRequest = this.ctx.request
        .header('accept')
        ?.includes('application/json') as boolean
      const body = await this.ctx.request.validateUsing(createRegisterValidator)
      const data = this.registerService.create(body)

      if (isApiRequest) {
        return this.transformResponse(data, 'Success')
      }

      console.log(body.nextUrl)

      let redirectLink = '/login'
      if (body.nextUrl) {
        redirectLink = '/login?nextUrl=' + body.nextUrl
      }

      return this.ctx.view.render('components/success', {
        buttonText: 'Continue to Login',
        message: 'Registration Successful',
        buttonLink: redirectLink,
      })
    } catch (error) {
      throw new Exception(error.message, {
        code: HttpStatus['500_NAME'],
        status: HttpStatus.INTERNAL_SERVER_ERROR,
      })
    }
  }
}
