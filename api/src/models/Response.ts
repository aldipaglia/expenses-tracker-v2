export interface ValidationError {
  message: string
  fields: { [name: string]: unknown }
}

export interface BadRequestError {
  message: string
}

export interface UnauthorizedError {
  message: string
  details: string
}

export interface NotFoundError {
  message: string
}

export interface ConflictError {
  message: string
}
