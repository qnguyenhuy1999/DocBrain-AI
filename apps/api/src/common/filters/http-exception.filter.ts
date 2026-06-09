import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from '@nestjs/common'

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost): void {
    const ctx = host.switchToHttp()
    const reply = ctx.getResponse<{ status(code: number): { send(body: unknown): void } }>()
    const statusCode = exception.getStatus()
    const response = exception.getResponse()

    let message: string
    if (typeof response === 'string') {
      message = response
    } else if (typeof response === 'object' && response !== null && 'message' in response) {
      const raw = (response as { message: unknown }).message
      message = Array.isArray(raw) ? raw.join(', ') : String(raw)
    } else {
      message = exception.message
    }

    reply.status(statusCode).send({ message, statusCode })
  }
}
