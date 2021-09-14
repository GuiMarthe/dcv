import { Request, Response } from 'express'
import { HttpException, Catch, ExceptionFilter, ArgumentsHost } from '@nestjs/common'

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost): void {
    const context = host.switchToHttp()
    const response = context.getResponse<Response>()
    const request = context.getRequest<Request>()
    const status = exception.getStatus()
    const errors = exception.getResponse()['message']

    response.status(status).json({
      statusCode: status,
      errors,
      message: exception.message,
      path: request.url
    })
  }
}
