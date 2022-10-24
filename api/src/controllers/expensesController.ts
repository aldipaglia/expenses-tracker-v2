import { isMatch } from 'date-fns'
import { AuthenticatedRequest } from 'models/Auth'
import {
  Controller,
  Get,
  Put,
  Post,
  Delete,
  Route,
  Request,
  Security,
  Body,
  Res,
  TsoaResponse,
  Query,
  Path,
  Patch,
} from 'tsoa'
import * as expensesRepository from '../repositories/expensesRepository'
import * as categoriesRepository from '../repositories/categoriesRepository'
import type { BadRequestError, UnauthorizedError } from '../models/Response'
import { Expense } from '../models/Expenses'
import { Category } from '../models/Category'
import { RecurringExpense } from '../models/RecurringExpenses'
import { IncompleteExpense } from '../models/IncompleteExpenses'
import * as fixerService from '../services/fixer'

type CreateExpenseData = Pick<
  Expense,
  'name' | 'date' | 'currency' | 'total'
> & { category_id: Category['id'] }

type CreateRecurringExpenseData = Pick<
  RecurringExpense,
  'frequency' | 'currency' | 'name' | 'total'
> & { category_id: Category['id'] }

type CompleteExpenseData = Pick<Expense, 'total'>

type EditExpenseData = Partial<
  Pick<Expense, 'name' | 'date' | 'currency' | 'total'> & {
    category_id: Category['id']
  }
>

type EditRecurringExpenseData = Partial<
  Pick<
    RecurringExpense,
    'name' | 'date' | 'currency' | 'total' | 'frequency'
  > & {
    category_id: Category['id']
  }
>

type EditIncompleteExpenseData = Partial<
  Pick<IncompleteExpense, 'name' | 'date' | 'currency'> & {
    category_id: Category['id']
  }
>

const dateFormat = 'yyyy-MM-dd'
@Route('expenses')
export class ExpensesControllers extends Controller {
  @Get('/')
  @Security('jwt')
  async getExpensesForRange(
    @Request() request: AuthenticatedRequest,
    @Query() from: Expense['date'],
    @Query() to: Expense['date'],
    @Res() badRequestResponse: TsoaResponse<400, BadRequestError>
  ) {
    if (!isMatch(from, dateFormat) || !isMatch(to, dateFormat)) {
      return badRequestResponse(400, {
        message: `'from' and 'to' parameters have to be valid dates (${dateFormat}).`,
      })
    }
    return expensesRepository.fetchForRange(from, to, request.user.id)
  }

  @Post('/')
  @Security('jwt')
  async createExpense(
    @Request() request: AuthenticatedRequest,
    @Body() expenseData: CreateExpenseData,
    @Res() badRequestResponse: TsoaResponse<400, BadRequestError>
  ) {
    const categoryExists = await categoriesRepository.existsById(
      expenseData.category_id
    )
    if (!categoryExists) {
      return badRequestResponse(400, {
        message: "'category_id' parameter has to be an existing category id.",
      })
    }

    if (!isMatch(expenseData.date, dateFormat)) {
      return badRequestResponse(400, {
        message: `'date' parameter has to be a valid date (${dateFormat}).`,
      })
    }

    if (expenseData.total <= 0) {
      return badRequestResponse(400, {
        message: "'total' parameter has to be positive.",
      })
    }

    const { name, date, currency, total, category_id } = expenseData
    const rate = await fixerService.getRate(currency)

    return expensesRepository.insertExpense({
      name,
      date,
      currency,
      total,
      category_id,
      user_id: request.user.id,
      rate,
    })
  }

  @Get('/recurring')
  @Security('jwt')
  async getRecurringExpenses(@Request() request: AuthenticatedRequest) {
    return expensesRepository.fetchRecurring(request.user.id)
  }

  @Post('/recurring')
  @Security('jwt')
  async createRecurringExpense(
    @Request() request: AuthenticatedRequest,
    @Body() recurringExpenseData: CreateRecurringExpenseData,
    @Res() badRequestResponse: TsoaResponse<400, BadRequestError>
  ) {
    const categoryExists = await categoriesRepository.existsById(
      recurringExpenseData.category_id
    )

    if (!categoryExists) {
      return badRequestResponse(400, {
        message: "'category_id' parameter has to be an existing category id.",
      })
    }

    const { frequency, category_id, currency, total, name } =
      recurringExpenseData

    return expensesRepository.insertRecurringExpense({
      frequency,
      category_id,
      currency,
      total,
      name,
      user_id: request.user.id,
    })
  }

  @Get('/incomplete')
  @Security('jwt')
  async getIncompleteExpenses(@Request() request: AuthenticatedRequest) {
    return expensesRepository.fetchIncomplete(request.user.id)
  }

  @Put('incomplete/{expenseId}')
  @Security('jwt')
  async completeExpense(
    @Request() request: AuthenticatedRequest,
    @Path() expenseId: IncompleteExpense['id'],
    @Body() completeExpenseData: CompleteExpenseData,
    @Res() badRequestResponse: TsoaResponse<400, BadRequestError>
  ) {
    const incompleteExpense = await expensesRepository.fetchIncompleteByID(
      expenseId
    )

    if (!incompleteExpense) {
      return badRequestResponse(400, {
        message: 'route parameter has to be an existing incomplete expense id.',
      })
    }

    // this loads rate from the day the expense is being completed, not the day that the payment is fulfilled
    // @ts-ignore
    const rate = await fixerService.getRate(incompleteExpense.currency)

    const { name, date, currency, category_id } = incompleteExpense

    const newExpense = await expensesRepository.insertExpense({
      // @ts-ignore
      name,
      // @ts-ignore
      date,
      // @ts-ignore
      currency,
      // @ts-ignore
      category_id,
      rate,
      total: completeExpenseData.total,
      user_id: request.user.id,
    })

    await expensesRepository.deleteIncompleteByID(expenseId)

    return newExpense
  }

  @Delete('/{expenseId}')
  @Security('jwt')
  async deleteExpense(
    @Request() request: AuthenticatedRequest,
    @Path() expenseId: Expense['id'],
    @Res() badRequestResponse: TsoaResponse<400, BadRequestError>,
    @Res() unauthorizedResponse: TsoaResponse<401, UnauthorizedError>
  ) {
    const expenseExists = await expensesRepository.existsByID(expenseId)

    if (!expenseExists) {
      return badRequestResponse(400, {
        message: "'expense_id' parameter has to be an existing expense id.",
      })
    }

    const userOwnsExpense = await expensesRepository.existsByIdAndUserId(
      expenseId,
      request.user.id
    )

    if (!userOwnsExpense) {
      return unauthorizedResponse(401, {
        message: 'Unauthorized',
        details: 'User does not own this expense',
      })
    }

    return expensesRepository.deleteExpenseByID(expenseId)
  }

  @Delete('/recurring/{expenseId}')
  @Security('jwt')
  async deleteRecurringExpense(
    @Request() request: AuthenticatedRequest,
    @Path() expenseId: RecurringExpense['id'],
    @Res() badRequestResponse: TsoaResponse<400, BadRequestError>,
    @Res() unauthorizedResponse: TsoaResponse<401, UnauthorizedError>
  ) {
    const expenseExists = await expensesRepository.recurringExistsById(
      expenseId
    )

    if (!expenseExists) {
      return badRequestResponse(400, {
        message:
          "'expense_id' parameter has to be an existing recurring expense id.",
      })
    }

    const userOwnsExpense = await expensesRepository.existsByIdAndUserId(
      expenseId,
      request.user.id
    )

    if (!userOwnsExpense) {
      return unauthorizedResponse(401, {
        message: 'Unauthorized',
        details: 'User does not own this expense',
      })
    }

    return expensesRepository.deleteRecurringExpenseByID(expenseId)
  }

  @Delete('/incomplete/{expenseId}')
  @Security('jwt')
  async deleteIncompleteExpense(
    @Request() request: AuthenticatedRequest,
    @Path() expenseId: IncompleteExpense['id'],
    @Res() badRequestResponse: TsoaResponse<400, BadRequestError>,
    @Res() unauthorizedResponse: TsoaResponse<401, UnauthorizedError>
  ) {
    const expenseExists = await expensesRepository.incompleteExistsByID(
      expenseId
    )

    if (!expenseExists) {
      return badRequestResponse(400, {
        message: "'expense_id' parameter has to be an existing expense id.",
      })
    }

    const userOwnsExpense =
      await expensesRepository.incompleteExistsByIdAndUserId(
        expenseId,
        request.user.id
      )

    if (!userOwnsExpense) {
      return unauthorizedResponse(401, {
        message: 'Unauthorized',
        details: 'User does not own this expense',
      })
    }

    return expensesRepository.deleteExpenseByID(expenseId)
  }

  @Patch('/{expenseId}')
  @Security('jwt')
  async editExpense(
    @Request() request: AuthenticatedRequest,
    @Path() expenseId: Expense['id'],
    @Body() expenseData: EditExpenseData,
    @Res() badRequestResponse: TsoaResponse<400, BadRequestError>,
    @Res() unauthorizedResponse: TsoaResponse<401, UnauthorizedError>
  ) {
    if (!Object.keys(expenseData).length) {
      return badRequestResponse(400, {
        message: 'Patch body must have at least one value',
      })
    }

    const expenseExists = await expensesRepository.existsByID(expenseId)

    if (!expenseExists) {
      return badRequestResponse(400, {
        message: "'expense_id' parameter has to be an existing expense id.",
      })
    }

    const userOwnsExpense = await expensesRepository.existsByIdAndUserId(
      expenseId,
      request.user.id
    )

    if (!userOwnsExpense) {
      return unauthorizedResponse(401, {
        message: 'Unauthorized',
        details: 'User does not own this expense',
      })
    }

    if (expenseData.category_id) {
      const categoryExists = await categoriesRepository.existsById(
        expenseData.category_id
      )

      if (!categoryExists) {
        return badRequestResponse(400, {
          message: "'category_id' parameter has to be an existing category id.",
        })
      }

      const userOwnsCategory = await categoriesRepository.existsByIdAndUserId(
        expenseData.category_id,
        request.user.id
      )

      if (!userOwnsCategory) {
        return unauthorizedResponse(401, {
          message: 'Unauthorized',
          details: 'User does not own this category',
        })
      }
    }

    const { currency, ...rest } = expenseData

    return expensesRepository.editExpense({
      id: expenseId,
      ...rest,
      ...(currency && {
        currency,
        rate: await fixerService.getRate(currency),
      }),
    })
  }

  @Patch('/recurring/{expenseId}')
  @Security('jwt')
  async editRecurringExpense(
    @Request() request: AuthenticatedRequest,
    @Path() expenseId: RecurringExpense['id'],
    @Body() recurringExpenseData: EditRecurringExpenseData,
    @Res() badRequestResponse: TsoaResponse<400, BadRequestError>,
    @Res() unauthorizedResponse: TsoaResponse<401, UnauthorizedError>
  ) {
    if (!Object.keys(recurringExpenseData).length) {
      return badRequestResponse(400, {
        message: 'Patch body must have at least one value',
      })
    }

    const recurringExpenseExists = await expensesRepository.recurringExistsById(
      expenseId
    )

    if (!recurringExpenseExists) {
      return badRequestResponse(400, {
        message: "'expense_id' parameter has to be an existing expense id.",
      })
    }

    const userOwnsExpense =
      await expensesRepository.recurringExistsByIdAndUserId(
        expenseId,
        request.user.id
      )

    if (!userOwnsExpense) {
      return unauthorizedResponse(401, {
        message: 'Unauthorized',
        details: 'User does not own this expense',
      })
    }

    if (recurringExpenseData.category_id) {
      const categoryExists = await categoriesRepository.existsById(
        recurringExpenseData.category_id
      )

      if (!categoryExists) {
        return badRequestResponse(400, {
          message: "'category_id' parameter has to be an existing category id.",
        })
      }

      const userOwnsCategory = await categoriesRepository.existsByIdAndUserId(
        recurringExpenseData.category_id,
        request.user.id
      )

      if (!userOwnsCategory) {
        return unauthorizedResponse(401, {
          message: 'Unauthorized',
          details: 'User does not own this category',
        })
      }
    }

    return expensesRepository.editRecurringExpense({
      id: expenseId,
      ...recurringExpenseData,
    })
  }

  @Patch('/incomplete/{expenseId}')
  @Security('jwt')
  async editIncompleteExpense(
    @Request() request: AuthenticatedRequest,
    @Path() expenseId: IncompleteExpense['id'],
    @Body() incompleteExpenseData: EditIncompleteExpenseData,
    @Res() badRequestResponse: TsoaResponse<400, BadRequestError>,
    @Res() unauthorizedResponse: TsoaResponse<401, UnauthorizedError>
  ) {
    if (!Object.keys(incompleteExpenseData).length) {
      return badRequestResponse(400, {
        message: 'Patch body must have at least one value',
      })
    }

    const incompleteExpenseExists =
      await expensesRepository.incompleteExistsByID(expenseId)

    if (!incompleteExpenseExists) {
      return badRequestResponse(400, {
        message: "'expense_id' parameter has to be an existing expense id.",
      })
    }

    const userOwnsExpense =
      await expensesRepository.incompleteExistsByIdAndUserId(
        expenseId,
        request.user.id
      )

    if (!userOwnsExpense) {
      return unauthorizedResponse(401, {
        message: 'Unauthorized',
        details: 'User does not own this expense',
      })
    }

    if (incompleteExpenseData.category_id) {
      const categoryExists = await categoriesRepository.existsById(
        incompleteExpenseData.category_id
      )

      if (!categoryExists) {
        return badRequestResponse(400, {
          message: "'category_id' parameter has to be an existing category id.",
        })
      }

      const userOwnsCategory = await categoriesRepository.existsByIdAndUserId(
        incompleteExpenseData.category_id,
        request.user.id
      )

      if (!userOwnsCategory) {
        return unauthorizedResponse(401, {
          message: 'Unauthorized',
          details: 'User does not own this category',
        })
      }
    }

    return expensesRepository.editIncompleteExpense({
      id: expenseId,
      ...incompleteExpenseData,
    })
  }
}
