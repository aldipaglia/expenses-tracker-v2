import { AuthenticatedRequest } from 'models/Auth'
import {
  Controller,
  Get,
  Post,
  Route,
  Delete,
  Request,
  Security,
  Body,
  Res,
  TsoaResponse,
  Path,
  Patch,
} from 'tsoa'
import * as categoriesRepository from '../repositories/categoriesRepository'
import type {
  BadRequestError,
  ConflictError,
  ForbiddenError,
  UnauthorizedError,
} from '../models/Response'
import { Category } from '../models/Category'

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
    @Body() categoryData: Pick<Category, 'name'>,
    @Res() conflictResponse: TsoaResponse<409, ConflictError>
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

  @Delete('/{categoryId}')
  @Security('jwt')
  async deleteCategory(
    @Request() request: AuthenticatedRequest,
    @Path() categoryId: Category['id'],
    @Res() badRequestResponse: TsoaResponse<400, BadRequestError>,
    @Res() unauthorizedResponse: TsoaResponse<401, UnauthorizedError>,
    @Res() forbiddenResponse: TsoaResponse<403, ForbiddenError>
  ) {
    const categoryExists = await categoriesRepository.existsById(categoryId)

    if (!categoryExists) {
      return badRequestResponse(400, {
        message: "'category_id' parameter has to be an existing category id.",
      })
    }

    const userOwnsCategory = await categoriesRepository.existsByIdAndUserId(
      categoryId,
      request.user.id
    )

    if (!userOwnsCategory) {
      return unauthorizedResponse(401, {
        message: 'Unauthorized',
        details: 'User does not own this category',
      })
    }

    const categoryIsNotEmpty = await categoriesRepository.categoryIsNotEmpty(
      categoryId
    )

    if (categoryIsNotEmpty) {
      return forbiddenResponse(403, {
        message: 'Forbidden',
        details: 'This category has one or more expenses attached to it',
      })
    }

    return categoriesRepository.deleteCategoryByID(categoryId)
  }

  @Patch('/{categoryId}')
  @Security('jwt')
  async editCategoryName(
    @Request() request: AuthenticatedRequest,
    @Path() categoryId: Category['id'],
    @Body() categoryData: Pick<Category, 'name' | 'id'>,
    @Res() badRequestResponse: TsoaResponse<400, BadRequestError>,
    @Res() unauthorizedResponse: TsoaResponse<401, UnauthorizedError>
  ) {
    if (!Object.keys(categoryData).length) {
      return badRequestResponse(400, {
        message: 'Patch body must have at least one value',
      })
    }

    const categoryExists = await categoriesRepository.existsById(categoryId)

    if (!categoryExists) {
      return badRequestResponse(400, {
        message: "'category_id' parameter has to be an existing expense id.",
      })
    }

    const userOwnsCategory = await categoriesRepository.existsByIdAndUserId(
      categoryId,
      request.user.id
    )

    if (!userOwnsCategory) {
      return unauthorizedResponse(401, {
        message: 'Unauthorized',
        details: 'User does not own this category',
      })
    }

    if (categoryData.id) {
      const categoryExists = await categoriesRepository.existsById(
        categoryData.id
      )

      if (!categoryExists) {
        return badRequestResponse(400, {
          message: "'category_id' parameter has to be an existing category id.",
        })
      }

      const userOwnsCategory = await categoriesRepository.existsByIdAndUserId(
        categoryData.id,
        request.user.id
      )

      if (!userOwnsCategory) {
        return unauthorizedResponse(401, {
          message: 'Unauthorized',
          details: 'User does not own this category',
        })
      }
    }
    return categoriesRepository.editCategory(categoryData.id, categoryData.name)
  }
}
