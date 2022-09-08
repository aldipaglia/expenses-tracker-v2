/**
 * User objects allow you to associate actions performed
 * in the system with the user that performed them.
 * The User object contains common information across
 * every user in the system regardless of status and role.
 *
 * @example {
 *  "id": 235342,
 *  "username": "carlos",
 *  "password": "34bfyu3fg243yfh893fn=",
 * }
 */
export interface User {
  id: number
  /**
   * @minLength 8 password must have at least 8 characters
   */
  password: string
  email: string
}
