import { isMatch } from 'date-fns'
import { AuthenticatedRequest } from 'models/Auth'
import {
  Controller,
  Get,
  Put,
  Post,
  Route,
  Request,
  Security,
  Body,
  Res,
  TsoaResponse,
  Query,
  Path,
} from 'tsoa'
import * as expensesRepository from '../repositories/expensesRepository'
import * as categoriesRepository from '../repositories/categoriesRepository'
import type { BadRequestError } from '../models/Response'
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
}
