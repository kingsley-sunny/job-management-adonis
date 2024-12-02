import { BaseCommand, args, flags } from '@adonisjs/core/ace'
import type { CommandOptions } from '@adonisjs/core/types/ace'
import fs from 'node:fs'
import { writeFile } from 'node:fs/promises'
import path from 'node:path'
import url from 'node:url'
import env from '../start/env.js'

export default class MakeModule extends BaseCommand {
  public static readonly commandName = 'make:module'
  public static readonly description = 'To make the controller and both service in a directory'
  public static readonly options: CommandOptions = {}

  @args.string()
  declare modulePath: string

  declare moduleName: string

  // @flags.string({
  //   flagName: 'model',
  //   description: 'The model to bind with',
  //   alias: ['m'],
  // })
  declare model: string

  @flags.boolean({
    flagName: 'validator',
    description: 'The validator to bind with',
    alias: ['v'],
  })
  declare validator: boolean

  modifyModuleName() {
    if (this.modulePath.includes('/')) {
      const arrays = this.modulePath.split('/')
      this.moduleName = arrays[arrays.length - 1]
      return
    }
    this.moduleName = this.modulePath
  }

  capitalize(str: string): string {
    if (str.length === 0) {
      return str // Return the empty string unchanged
    }
    return str.charAt(0).toUpperCase() + str.slice(1)
  }

  convertToSnakeCase(camelCaseStr: string): string {
    return camelCaseStr
      .split(/(?=[A-Z])/)
      .join('_')
      .toLowerCase()
  }

  ensureDirectoryExistence(filePath: string): void {
    const dir = path.dirname(filePath)
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true })
    }
  }

  checkIfFileExists(filePath: string): boolean {
    if (fs.existsSync(filePath)) {
      return true
    }
    return false
  }

  async getModelName() {
    const modelName = await this.prompt.ask(`ModelClass to use: (Leave blank if empty)`)

    this.model = this.capitalize(modelName)
  }

  private async createServiceFile(fileName: string) {
    const createValidatorType = this.validator
      ? `Create${this.capitalize(this.moduleName)}Type`
      : null
    const updateValidatorType = this.validator
      ? `Update${this.capitalize(this.moduleName)}Type`
      : null

    const validatorImport = this.validator
      ? `import { Create${this.capitalize(this.moduleName)}Type, Update${this.capitalize(this.moduleName)}Type } from '../types'`
      : null

    const serviceFileContent = /*typescript*/ `
    // import type { HttpContext } from '@adonisjs/core/http'
    import { HttpContext } from '@adonisjs/core/http'
    import { inject } from '@adonisjs/core'
    import HttpStatus from 'http-status'
    import { Exception } from '@adonisjs/core/exceptions'
    
    
    @inject()
    export default class ${this.capitalize(this.moduleName)}Service {
      constructor(protected ctx: HttpContext) {}
      
      async create(${this.validator ? `data:${createValidatorType}` : null}) {
        try {

        } catch (error) {
          throw new Exception(error.message, {
          code: HttpStatus['500_NAME'],
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          })
        }
      }

      async update(id: string, ${this.validator ? `data:${updateValidatorType}` : null}) {
        try {

        } catch (error) {
          throw new Exception(error.message, {
          code: HttpStatus['500_NAME'],
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          })
        }
      }

      async find(columns: FetchColumn<${this.capitalize(this.model)}>, query: FetchQuery) {
        try {

        } catch (error) {
          throw new Exception(error.message, {
          code: HttpStatus['500_NAME'],
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          })
        }
      }

      async findOne(columns?: FetchColumn<${this.capitalize(this.model)}>) {
        try {

        } catch (error) {
          throw new Exception(error.message, {
          code: HttpStatus['500_NAME'],
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          })
        }
      }

      async findById(id: string) {
        try {

        } catch (error) {
          throw new Exception(error.message, {
          code: HttpStatus['500_NAME'],
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          })
        }
      }

      async delete(id: string) {
        try {

        } catch (error) {
          throw new Exception(error.message, {
          code: HttpStatus['500_NAME'],
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          })
        }
      }
    }
    
    `
    const serviceFilePath = path.join(
      path.dirname(url.fileURLToPath(import.meta.url)),
      '../',
      'app',
      'modules',
      fileName,
      `${this.convertToSnakeCase(this.moduleName)}_service.ts`
    )

    if (!this.checkIfFileExists(serviceFilePath)) {
      this.ensureDirectoryExistence(serviceFilePath)
      await writeFile(serviceFilePath, serviceFileContent)
      return serviceFilePath
    }

    // if the directory exists
    const overwriteDir = await this.prompt.ask(
      `This file (${serviceFilePath}) exist, Do you want to overwrite it ? (y/n)`
    )

    if (overwriteDir.toLowerCase() === 'y') {
      await writeFile(serviceFilePath, serviceFileContent)
      return serviceFilePath
    }

    return 'File Not Created'
  }

  private async createControllerFile(fileName: string) {
    const serviceName = `${this.moduleName}Service`
    const model = this.model ? `<${this.capitalize(this.model)}>` : `{}`
    const modelPaginated = this.model ? `<${this.capitalize(this.model)}[]>.paginated()` : `{}`
    const createValidatorName = this.validator
      ? `create${this.capitalize(this.moduleName)}Validator`
      : model
    const updateValidatorName = this.validator
      ? `update${this.capitalize(this.moduleName)}Validator`
      : model
    const createValidator = this.validator ? `<${createValidatorName}>` : model
    const updateValidator = this.validator ? `<${updateValidatorName}>` : model

    const controllerFileContent = /*typescript*/ `
    // import type { HttpContext } from '@adonisjs/core/http'
    import { HttpContext } from '@adonisjs/core/http'
    import { inject } from '@adonisjs/core'
    
    @inject()
    export default class ${this.capitalize(this.moduleName)}Controller extends BaseController {
      constructor(protected ctx: HttpContext, private readonly ${serviceName}: ${this.capitalize(this.moduleName)}Service) {
        super()
      }
      
      /**
       * @create
       * @operationId getProducts
       * @description returns the health of the server
       * @requestBody ${createValidator} 200 
       * @responseBody 200 - ${model} - OK
       * @responseHeader 200 - X-pages - A description of the header - @example(test)
       */
      async create() {
        const isApiRequest = this.ctx.request.header('accept')?.includes('application/json') as boolean
        ${this.validator ? `const body = await this.ctx.request.validateUsing(${createValidatorName})` : null}
        const data = await this.${serviceName}.create(${this.validator ? 'body' : null})

        if (isApiRequest) {
          return this.transformResponse(data, 'Success')
        }
    
        return this.ctx.response.redirect('home')
      }

      /**
       * @update
       * @operationId getProducts
       * @description returns the health of the server
       * @requestBody ${updateValidator} 200 
       * @paramPath id - The ID of the source - @type(number) @required
       * @responseBody 200 - ${model} - OK
       * @responseHeader 200 - X-pages - A description of the header - @example(test)
       */
      async update() {
        const id = await this.ctx.params?.id
        const isApiRequest = this.ctx.request.header('accept')?.includes('application/json') as boolean
        ${this.validator ? `const body = await this.ctx.request.validateUsing(${updateValidatorName})` : null}
        const data = await this.${serviceName}.update(id, ${this.validator ? 'body' : null})

        if (isApiRequest) {
          return this.transformResponse(data, 'Success')
        }
    
        return this.ctx.response.redirect('home')
      }

      /**
       * @find
       * @operationId getProducts
       * @description returns the health of the server
       * @paramUse(sortable, filterable)
       * @responseBody 200 - ${modelPaginated} - OK
       * @responseHeader 200 - X-pages - A description of the header - @example(test)
       */
      async find() {
        const view = this.ctx.view
        const isApiRequest = this.ctx.request.header('accept')?.includes('application/json') as boolean
        const query = this.ctx.request.qs()
        const data = await this.${serviceName}.find(query, query)

        if (isApiRequest) {
          return this.transformResponse(data, 'Success')
        }

        return view.render('home', { data })
      }

      /**
       * @findById
       * @operationId getProducts
       * @description returns the health of the server
       * @paramPath id - The ID of the source - @type(number) @required
       * @responseBody 200 - ${model} - OK
       * @responseHeader 200 - X-pages - A description of the header - @example(test)
       */
      async findById() {
        const view = this.ctx.view
        const isApiRequest = this.ctx.request.header('accept')?.includes('application/json') as boolean
        const id = this.ctx.params?.id
        const data = await this.${serviceName}.findById(id)

        if (isApiRequest) {
          return this.transformResponse(data, 'Success')
        }

        return view.render('home', { data })
      }

      /**
       * @delete
       * @operationId getProducts
       * @description returns the health of the server
       * @paramPath id - The ID of the source - @type(number) @required
       * @responseBody 200 - ${model} - OK
       * @responseHeader 200 - X-pages - A description of the header - @example(test)
       */
      async delete() {
        const id = this.ctx.params?.id
        const isApiRequest = this.ctx.request.header('accept')?.includes('application/json') as boolean
        const data = await this.${serviceName}.delete(id)

        if (isApiRequest) {
          return this.transformResponse(data, 'Success')
        }
    
        return this.ctx.response.redirect('home')
      }
    }
    
    `
    const controllerFilePath = path.join(
      path.dirname(url.fileURLToPath(import.meta.url)),
      '../',
      'app',
      'modules',
      fileName,
      `${this.convertToSnakeCase(this.moduleName)}_controller.ts`
    )

    if (!this.checkIfFileExists(controllerFilePath)) {
      this.ensureDirectoryExistence(controllerFilePath)
      await writeFile(controllerFilePath, controllerFileContent)
      return controllerFilePath
    }

    // if the directory exists
    const overwriteDir = await this.prompt.ask(
      `This file (${controllerFilePath}) exist, Do you want to overwrite it ? (y/n)`
    )

    if (overwriteDir.toLowerCase() === 'y') {
      await writeFile(controllerFilePath, controllerFileContent)
      return controllerFilePath
    }

    return 'File Not Created'
  }

  private async createValidatorFile(fileName: string) {
    const validatorFileContent = /*typescript*/ `
    import vine from '@vinejs/vine'
    import { Infer } from '@vinejs/vine/types'
    
    /**
     * Validates the create action
     */
    export const create${this.capitalize(this.moduleName)}Validator = vine.compile(
      vine.object({
        name: vine.string(),
      })
    )

    export type Create${this.capitalize(this.moduleName)}Type = Infer<typeof create${this.capitalize(this.moduleName)}Validator>

    /**
     * Validates the update action
     */
    export const update${this.capitalize(this.moduleName)}Validator = vine.compile(
      vine.object({
        name: vine.string(),
      })
    )

    export type Update${this.capitalize(this.moduleName)}Type = Infer<typeof update${this.capitalize(this.moduleName)}Validator>

    
    `
    const validatorFilePath = path.join(
      path.dirname(url.fileURLToPath(import.meta.url)),
      '../',
      'app',
      'validators',
      fileName,
      `${this.convertToSnakeCase(this.moduleName)}_validator.ts`
    )

    if (!this.checkIfFileExists(validatorFilePath)) {
      this.ensureDirectoryExistence(validatorFilePath)
      await writeFile(validatorFilePath, validatorFileContent)
      return validatorFilePath
    }

    // if the directory exists
    const overwriteDir = await this.prompt.ask(
      `This file (${validatorFilePath}) exist, Do you want to overwrite it ? (y/n)`
    )

    if (overwriteDir.toLowerCase() === 'y') {
      await writeFile(validatorFilePath, validatorFileContent)
      return validatorFilePath
    }

    return 'File Not Created'
  }

  async run() {
    // incase of hackers
    if (env.get('NODE_ENV') === 'production') {
      this.logger.fatal('Cannot edit the fucking file you hacker')

      return this.terminate()
    }

    // get the model name
    await this.getModelName()

    // modify the module name
    this.modifyModuleName()

    // convert the moduleName to snake case
    const fileName = this.convertToSnakeCase(this.modulePath)
    console.log('🚀 ~~ MakeModule ~~ run ~~ fileName:', fileName)

    // Create the service file with the arguments
    const serviceFilePath = await this.createServiceFile(fileName)

    // Create the service file with the arguments
    const controllerFilePath = await this.createControllerFile(fileName)

    // if there is validator flag, create validator file
    if (this.validator) {
      this.createValidatorFile(fileName)
    }

    // then create the controller file

    this.logger.success(`DONE:     ${serviceFilePath}, ${controllerFilePath}`)
  }
}
