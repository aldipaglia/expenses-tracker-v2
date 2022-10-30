import {
  Body,
  Controller,
  Post,
  Res,
  Response,
  Route,
  TsoaResponse,
} from 'tsoa'

import { SignJWT, JWTPayload, jwtVerify } from 'jose'
import bcrypt from 'bcrypt'

import { User } from '../models/User'
import { JWTData } from '../models/Auth'

import {
  BadRequestError,
  UnauthorizedError,
  ValidationError,
} from '../models/Response'

import * as usersRepository from '../repositories/usersRepository'
import config from '../config'

type LoginParams = Pick<User, 'email' | 'password'>
type VerifyParams = { access_token: string }
type SignupParams = Omit<User, 'id'>

type LoginResponse = { access_token: string; user: Pick<User, 'id' | 'email'> }
type VerifyResponse = { verified: false } | ({ verified: true } & LoginResponse)

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
      user: {
        id: user.id,
        email: user.email,
      },
    }
  }

  @Post('verify')
  async verifyToken(@Body() body: VerifyParams): Promise<VerifyResponse> {
    const secretKey = new TextEncoder().encode(config.jwt_secret)

    try {
      const verifyResult = await jwtVerify(body.access_token, secretKey, {
        issuer: config.jwt_issuer,
        audience: config.jwt_audience,
      })

      const payload = verifyResult.payload as JWTPayload & JWTData

      return {
        verified: true,
        access_token: await this.signToken({
          id: payload.id,
          email: payload.email,
          scopes: [],
        }),
        user: {
          id: payload.id,
          email: payload.email,
        },
      }
    } catch (e) {
      return { verified: false }
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
      await this.hashPassword(body.password)
    )

    return {
      access_token: await this.signToken({
        id: newUser.id,
        email: newUser.email,
        scopes: [],
      }),
      user: {
        id: newUser.id,
        email: newUser.email,
      },
    }
  }

  private async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(config.salt_rounds)
    return bcrypt.hash(password, salt)
  }

  private comparePassword(raw: string, hash: string): Promise<boolean> {
    return bcrypt.compare(raw, hash)
  }

  private async signToken(data: JWTData): Promise<string> {
    const secretKey = new TextEncoder().encode(config.jwt_secret)

    return await new SignJWT(data as unknown as JWTPayload)
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setIssuer(config.jwt_issuer)
      .setAudience(config.jwt_audience)
      .setExpirationTime('2h')
      .sign(secretKey)
  }
}
