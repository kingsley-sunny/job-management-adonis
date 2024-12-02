import { errors as authErrors } from '@adonisjs/auth'
import { inject } from '@adonisjs/core'
import { ExceptionHandler, HttpContext, errors as httpErrors } from '@adonisjs/core/http'
import app from '@adonisjs/core/services/app'
import { StatusPageRange, StatusPageRenderer } from '@adonisjs/core/types/http'
import { errors as lucidErrors } from '@adonisjs/lucid'
import { errors as vineErrors } from '@vinejs/vine'
import httpStatus from 'http-status'
import { BaseService } from '../base/base_service.js'
@inject()
export default class HttpExceptionHandler extends ExceptionHandler {
  constructor(protected baseService: BaseService) {
    super()
  }

  /**
   * In debug mode, the exception handler will display verbose errors
   * with pretty printed stack traces.
   */
  protected debug = !app.inProduction

  /**
   * The method is used for handling errors and returning
   * response to the client
   */

  /**
   * Status pages are used to display a custom HTML pages for certain error
   * codes. You might want to enable them in production only, but feel
   * free to enable them in development as well.
   */
  protected renderStatusPages = app.inProduction

  /**
   * Status pages is a collection of error code range and a callback
   * to return the HTML contents to send as a response.
   */
  protected statusPages: Record<StatusPageRange, StatusPageRenderer> = {
    '422': (error, { view }) => {
      return view.render('components/error', {
        title: error.message,
        message: error.messages?.map((m: any) => m.message),
      })
    },
    '500..599': (error, { view }) => {
      return view.render('pages/errors/server_error', { error })
    },
  }

  async handle(error: unknown, ctx: HttpContext) {
    if (!ctx.request.headers().accept?.includes('application/json')) {
      return super.handle(error, ctx)
    }

    if (error instanceof vineErrors.E_VALIDATION_ERROR) {
      const message = error.messages.map((msg: any) => msg.message)

      return ctx.response
        .status(httpStatus.BAD_REQUEST)
        .send(this.baseService.transformException(error, ctx, message))
    }

    if (error instanceof authErrors.E_INVALID_CREDENTIALS) {
      return ctx.response
        .status(httpStatus.BAD_REQUEST)
        .send(this.baseService.transformException(error, ctx, error.message))
    }

    if (error instanceof authErrors.E_UNAUTHORIZED_ACCESS) {
      return ctx.response
        .status(httpStatus.UNAUTHORIZED)
        .send(this.baseService.transformException(error, ctx))
    }

    if (error instanceof httpErrors.E_HTTP_REQUEST_ABORTED) {
      return ctx.response
        .status(httpStatus.INTERNAL_SERVER_ERROR)
        .send(this.baseService.transformException(error, ctx))
    }

    if (error instanceof httpErrors.E_ROUTE_NOT_FOUND) {
      return ctx.response
        .status(httpStatus.NOT_FOUND)
        .send(this.baseService.transformException(error, ctx))
    }

    if (error instanceof lucidErrors.E_ROW_NOT_FOUND) {
      return ctx.response
        .status(httpStatus.INTERNAL_SERVER_ERROR)
        .send(this.baseService.transformException(error, ctx))
    }

    if (error instanceof lucidErrors.E_ROW_NOT_FOUND) {
      return ctx.response
        .status(httpStatus.INTERNAL_SERVER_ERROR)
        .send(this.baseService.transformException(error, ctx))
    }

    if ((error as any)?.code === 'SQLITE_CONSTRAINT_NOTNULL') {
      return ctx.response
        .status(httpStatus.INTERNAL_SERVER_ERROR)
        .send(this.baseService.transformException(error, ctx))
    }

    return ctx.response
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .send(this.baseService.transformException(error, ctx))
  }

  /**
   * The method is used to report error to the logging service or
   * the third party error monitoring service.
   *
   * @note You should not attempt to send a response from this method.
   */
  async report(error: unknown, ctx: HttpContext) {
    console.log('report', error)

    return super.report(error, ctx)
  }
}
