import {
  Controller,
  Get,
  Query,
  Route,
  Security,
  Request,
  Post,
  Body,
  Response,
  Res,
  TsoaResponse,
  Middlewares,
} from 'tsoa'

import { AuthenticatedRequest } from '../models/Auth'
import { User } from '../models/User'
import { ConflictError } from '../models/Response'

// @ts-ignore
const testMiddleware = (req, res, next) => {
  console.log(req.body)
  next()
}

@Route('example')
export class ExampleController extends Controller {
  @Get('protected-resource')
  @Security('jwt')
  async getProtectedResource(
    @Request() request: AuthenticatedRequest,
    @Query('param_name') paramName: string
  ) {
    return { protected: 'resource', param: request.user, paramName }
  }

  @Middlewares(testMiddleware)
  @Get('public-resource')
  async getPublicResource() {
    return { public: 'resource' }
  }

  @Post('public-resource')
  @Response<ConflictError>(409, 'Conflict')
  async createPublicResource(
    @Body() body: Pick<User, 'email'>,
    @Res() conflictResponse: TsoaResponse<409, ConflictError>
  ) {
    if (body.email === 'existing@email.com') {
      return conflictResponse(409, { message: 'Email already in use' })
    }
    return { body }
  }
}
