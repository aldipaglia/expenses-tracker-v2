import { AuthenticatedRequest } from 'models/Auth'
import { Controller, Get, Query, Route, Security, Request } from 'tsoa'

@Route('example')
export class ExampleController extends Controller {
  @Get('protected-resource')
  @Security('jwt')
  async getProtectedResource(
    @Request() request: AuthenticatedRequest,
    @Query('param_name') paramName: string
  ) {
    return { param: request.user, paramName }
  }

  @Get('public-resource')
  async getPublicResource() {
    return { public: 'resource' }
  }
}
