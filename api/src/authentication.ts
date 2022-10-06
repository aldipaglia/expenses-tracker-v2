import { Request } from 'express'
import { jwtVerify } from 'jose'
import config from './config'

// import { JWTData } from './models/Auth'

export async function expressAuthentication(
  request: Request,
  securityName: string,
  _: string[]
): Promise<any> {
  if (securityName !== 'jwt') {
    return Promise.reject(new Error('Not supported authentication type'))
  }

  const headerValue = request.headers.authorization as string

  if (!headerValue) {
    throw new Error('No token provided')
  }

  if (!headerValue.startsWith('Bearer ')) {
    throw new Error('Wrong token format')
  }

  const token = headerValue.substring(7)
  const secretKey = new TextEncoder().encode(config.jwt_secret)

  const {
    payload: { id, email, scopes },
  } = await jwtVerify(token, secretKey)

  return { id, email, scopes }
  // const jwtData = decoded as JWTData

  // if (scopes && !jwtData.scopes?.includes('admin')) {
  //   for (const scope of scopes) {
  //     if (!jwtData.scopes?.includes(scope)) {
  //       reject(
  //         new Error(`JWT does not contain required scope: "${scope}".`)
  //       )
  //     }
  //   }
  // }
}
