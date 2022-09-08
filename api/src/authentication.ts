import { Request } from 'express'
import * as jwt from 'jsonwebtoken'
import config from './config'

// import { JWTData } from './models/Auth'

export function expressAuthentication(
  request: Request,
  securityName: string,
  _: string[]
): Promise<any> {
  if (securityName !== 'jwt') {
    return Promise.reject(new Error('Not supported authentication type'))
  }

  const headerValue = request.headers.authorization as string

  return new Promise((resolve, reject) => {
    if (!headerValue) {
      reject(new Error('No token provided'))
    }

    if (!headerValue.startsWith('Bearer ')) {
      reject(new Error('Wrong token format'))
    }

    const token = headerValue.substring(7)

    jwt.verify(token, config.jwt_secret, (err: any, decoded: any) => {
      if (err) return reject(err)
      resolve(decoded)

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
    })
  })
}
