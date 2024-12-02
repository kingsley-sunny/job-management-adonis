import { HttpContext } from '@adonisjs/core/http'
import { ExceptionResponse, ResponseType } from './base_interface.js'

export class BaseService {
  static async transformResponse(
    data: Promise<Record<any, any>> | Record<any, any>,
    message = 'Successful',
    statusCode = 200
  ): Promise<ResponseType> {
    data = await data

    const dateTime = new Date().toISOString()
    return {
      statusCode,
      message,
      data,
      timestamp: dateTime,
    }
  }

  transformException(error: any, ctx: HttpContext, message?: string): ExceptionResponse {
    const dateTime = new Date().toISOString()

    return {
      statusCode: error.status,
      message: message || error.message || 'Internal server error',
      timestamp: dateTime,
      error: true,
      path: ctx.request.url(),
      resource: ctx.request.url(true),
    }
  }
}
