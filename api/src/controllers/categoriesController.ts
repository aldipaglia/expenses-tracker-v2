import { AuthenticatedRequest } from 'models/Auth'
import {
  Controller,
  Get,
  Post,
  Route,
  Request,
  Security,
  Body,
  Res,
  TsoaResponse,
} from 'tsoa'
import * as categoriesRepository from '../repositories/categoriesRepository'
import type { ConflictError } from 'models/Response'

@Route('categories')
export class CategoriesControllers extends Controller {
  @Get('/')
  @Security('jwt')
  getCategories(@Request() request: AuthenticatedRequest) {
    return categoriesRepository.fetchCategories(request.user.id)
  }

  @Post('/')
  @Security('jwt')
  async createCategory(
    @Request() request: AuthenticatedRequest,
    @Body() categoryData: { name: string }, // TODO: see how to use type
    @Res() conflictResponse: TsoaResponse<409, ConflictError> // TODO: see how to use type
  ) {
    const exists = await categoriesRepository.existsByNameAndUserId(
      categoryData.name,
      request.user.id
    )

    if (exists) {
      return conflictResponse(409, {
        message: `A category with name '${categoryData.name}' already exists.`,
      })
    }

    return categoriesRepository.insertCategory(
      categoryData.name,
      request.user.id
    )
  }
}
