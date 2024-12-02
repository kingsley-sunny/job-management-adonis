import { inject } from '@adonisjs/core'
import httpStatus from 'http-status'
import { ResponseType } from './base_interface.js'

@inject()
export class BaseController {
  async transformResponse(
    data: Promise<Record<any, any>> | Record<any, any> | null | undefined,
    message = 'Successful',
    statusCode = httpStatus.OK
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
}
