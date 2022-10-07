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
import type { ConflictError } from '../models/Response'
import { Expense } from '../models/Expenses'
import { Category } from 'models/Category'
import { RecurringExpense } from 'models/RecurringExpenses'

type CreateExpenseData = Pick<
  Expense,
  'name' | 'date' | 'currency' | 'total'
> & { category_id: Category['id'] }

type CreateRecurringExpenseData = Pick<
  RecurringExpense,
  'frequency' | 'currency' | 'name' | 'total'
> & { category_id: Category['id'] }

type CompleteExpenseData = Pick<Expense, 'total'>

@Route('expenses')
export class ExpensesControllers extends Controller {
  @Get('/')
  @Security('jwt')
  async getExpensesForRange(
    @Request() request: AuthenticatedRequest,
    @Query() from: Expense['date'],
    @Query() to: Expense['date']
  ) {}

  @Post('/')
  @Security('jwt')
  async createExpense(
    @Request() request: AuthenticatedRequest,
    @Body() expenseData: CreateExpenseData
  ) {}

  @Get('/recurring')
  @Security('jwt')
  async getRecurringExpenses(@Request() request: AuthenticatedRequest) {}

  @Post('/recurring')
  @Security('jwt')
  async createRecurringExpense(
    @Request() request: AuthenticatedRequest,
    @Body() recurringExpenseData: CreateRecurringExpenseData
  ) {}

  @Get('/incomplete')
  @Security('jwt')
  async getIncompleteExpenses(@Request() request: AuthenticatedRequest) {}
  @Put('incomplete/{expenseId}')
  @Security('jwt')
  async completeExpense(
    @Request() request: AuthenticatedRequest,
    @Path() expenseId: Expense['id'],
    @Body() completeExpenseData: CompleteExpenseData
  ) {}
}
