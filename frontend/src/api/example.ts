import { get, post } from '../utils/api'
import type { ExampleResource } from '../models/ExampleResource'

const exampleAPI = {
  fetchPublicResource: (param: string) =>
    get<ExampleResource>(
      '/example/public-resource',
      { param },
      { authenticated: false }
    ),

  fetchProtectedResource: (param: string) =>
    get<ExampleResource>('/example/protected-resource', { param }),

  createExampleResource: (
    thing: ExampleResource['thing'],
    stuff: ExampleResource['stuff']
  ) =>
    post<ExampleResource>(
      '/example/public-resource',
      { thing, stuff },
      { authenticated: false }
    ),
}

export default exampleAPI
