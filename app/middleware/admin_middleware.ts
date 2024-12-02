import { HttpContext } from '@adonisjs/core/http'
import { NextFn } from '@adonisjs/core/types/http'

export default class AdminMiddleware {
  async handle(ctx: HttpContext, next: NextFn) {
    const user = ctx.auth.user

    if (!user || user.role !== 'ADMIN') {
      return ctx.response.redirect().toRoute('/')
    }

    return next()
  }
}
