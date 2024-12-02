import path from 'node:path'
import url from 'node:url'

console.log(url.fileURLToPath(import.meta.url))
// ---

export default {
  // path: __dirname + "/../", for AdonisJS v5
  path: path.dirname(url.fileURLToPath(import.meta.url)) + '/../', // for AdonisJS v6
  title: 'Blum app', // use info instead
  version: '1.0.0', // use info instead
  description: '', // use info instead
  tagIndex: 2,
  info: {
    title: 'Blum Quotes',
    version: '1.0.0',
    description: 'A quote generator (also with AI)',
  },
  snakeCase: true,
  debug: false, // set to true, to get some useful debug output
  ignore: ['/swagger', '/docs'],
  preferredPutPatch: 'PUT', // if PUT/PATCH are provided for the same route, prefer PUT
  common: {
    parameters: {
      sortable: [
        {
          in: 'query',
          name: 'orderBy',
          schema: { type: 'string' },
        },
        {
          in: 'query',
          name: 'order',
          schema: { type: 'string' },
        },
        {
          in: 'query',
          name: 'search',
          schema: { type: 'string' },
        },
        {
          in: 'query',
          name: 'filterBy',
          schema: { type: 'string' },
        },
        {
          in: 'query',
          name: 'limit',
          schema: { type: 'number' },
        },
        {
          in: 'query',
          name: 'startDate',
          schema: { type: 'string' },
        },
        {
          in: 'query',
          name: 'endDate',
          schema: { type: 'string' },
        },
        {
          in: 'query',
          name: 'endDateCol',
          schema: { type: 'string' },
        },
        {
          in: 'query',
          name: 'page',
          schema: { type: 'number' },
        },
      ],
    },
    // OpenAPI conform parameters that are commonly used
    headers: {}, // OpenAPI conform headers that are commonly used
  },
  securitySchemes: {}, // optional
  authMiddlewares: ['auth', 'auth:api'], // optional
  defaultSecurityScheme: 'BearerAuth', // optional
  persistAuthorization: true, // persist authorization between reloads on the swagger page
  showFullPath: false, // the path displayed after endpoint summary,
}
