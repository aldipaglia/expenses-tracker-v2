import {
  Body,
  Controller,
  Post,
  Res,
  Response,
  Route,
  TsoaResponse,
} from 'tsoa'
import { SignJWT } from 'jose'
import { User } from '../models/User'
import {
  BadRequestError,
  UnauthorizedError,
  ValidationError,
} from '../models/Response'
import * as usersRepository from '../repositories/usersRepository'
import { JWTData } from '../models/Auth'
import config from '../config'
import { JwtPayload } from 'jsonwebtoken'

type LoginParams = Pick<User, 'email' | 'password'>
type SignupParams = Omit<User, 'id'>
type LoginResponse = { access_token: string }

@Route('auth')
export class AuthController extends Controller {
  @Post('login')
  @Response<ValidationError>(400, 'Validation Failed')
  @Response<UnauthorizedError>(401, 'Unauthorized')
  async login(
    @Body() body: LoginParams,
    @Res() unauthorizedResponse: TsoaResponse<401, UnauthorizedError>
  ): Promise<LoginResponse> {
    const user = await usersRepository.fetchByEmail(body.email)

    if (!user || !(await this.comparePassword(body.password, user.password))) {
      this.setStatus(401)
      return unauthorizedResponse(401, {
        message: 'Unauthorized',
        details: 'User not found or password mismatch',
      })
    }

    return {
      access_token: await this.signToken({
        id: user.id,
        email: user.email,
        scopes: [],
      }),
    }
  }

  @Post('signup')
  @Response<ValidationError>(400, 'Validation Failed')
  async signup(
    @Body() body: SignupParams,
    @Res() validationResponse: TsoaResponse<400, BadRequestError>
  ): Promise<LoginResponse> {
    const existingUser = await usersRepository.fetchByEmail(body.email)

    if (existingUser) {
      return validationResponse(400, { message: 'Email already registered' })
    }

    const newUser = await usersRepository.create(
      body.email,
      this.hashPassword(body.password)
    )

    return {
      access_token: await this.signToken({
        id: newUser.id,
        email: newUser.email,
        scopes: [],
      }),
    }
  }

  private hashPassword(password: string): string {
    return password
  }

  private comparePassword(raw: string, hash: string): Promise<boolean> {
    return Promise.resolve(raw === hash)
  }

  private async signToken(data: JWTData): Promise<string> {
    const secretKey = new TextEncoder().encode(config.jwt_secret)

    return await new SignJWT(data as JwtPayload)
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setIssuer('issuer')
      .setAudience('audience')
      .setExpirationTime('2h')
      .sign(secretKey)
  }
}
