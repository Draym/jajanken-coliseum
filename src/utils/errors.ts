import { NextResponse } from 'next/server'

export class HttpError {
  constructor(public message: string, public code: number) {}
}

export class BadRequest extends HttpError {
  constructor(message?: string) {
    super(`Bad Request' ${message ? `: ${message}` : ''}`, 400)
  }
}

export class NotAuthorized extends HttpError {
  constructor(message?: string) {
    super(`Unauthorized ${message ? `: ${message}` : ''}`, 401)
  }
}

export class Forbidden extends HttpError {
  constructor(message?: string) {
    super(`Forbidden ${message ? `: ${message}` : ''}`, 403)
  }
}

export class ServerError extends HttpError {
  constructor(message?: string) {
    super(`ServerError ${message ? `: ${message}` : ''}`, 500)
  }
}

export const formatError = (error: any): NextResponse => {
  console.error(error)
  return NextResponse.json(
    { error: error.message },
    { status: error.code || 500 }
  )
}
