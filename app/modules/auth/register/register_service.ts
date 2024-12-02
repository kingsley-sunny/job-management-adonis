// import type { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'
import { CreateRegisterType } from '../../../validators/auth/register/register_validator.js'
import UserService from '../../user/user_service.js'

@inject()
export default class RegisterService {
  constructor(
    protected ctx: HttpContext,
    protected userService: UserService
  ) {}

  async create(data: CreateRegisterType) {
    const user = await this.userService.create(data)

    return user
  }
}
