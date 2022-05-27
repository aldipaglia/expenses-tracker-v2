import { Controller, Get, Query, Route, Security } from 'tsoa'

@Route('example')
export class ExampleController extends Controller {
  @Get('resource')
  @Security('jwt')
  async getProtectedResource(@Query('param_name') paramName: string) {
    return { param: paramName }
  }
}
