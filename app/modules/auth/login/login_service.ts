// import type { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'
import User from '../../../models/user.js'
import { CreateLoginType } from '../../../validators/auth/login/login_validator.js'

@inject()
export default class LoginService {
  constructor(protected ctx: HttpContext) {}

  async create(data: CreateLoginType) {
    const { email, password } = data
    const user = await User.verifyCredentials(email, password)
    const guard = this.ctx.auth.use('web')

    await guard.login(user)

    return user
  }
}
