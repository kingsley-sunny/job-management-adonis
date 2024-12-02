import { BaseCommand, args } from '@adonisjs/core/ace'
import type { CommandOptions } from '@adonisjs/core/types/ace'
import fs from 'node:fs'
import { writeFile } from 'node:fs/promises'
import path from 'node:path'
import url from 'node:url'
import env from '../start/env.js'

export default class AddModel extends BaseCommand {
  static commandName = 'add:model'
  static description = 'Edit make model, to make my base Model'

  static options: CommandOptions = {}

  @args.string()
  declare modulePath: string

  declare moduleName: string

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
    return camelCaseStr.replace(/([A-Z])/g, '_$1').toLowerCase()
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

  convertSnakeToCamel(snakeStr: string): string {
    return snakeStr
      .split('_')
      .map((word, index) => {
        // Capitalize the first letter of each word except the first one
        if (index === 0) {
          return word
        } else {
          return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        }
      })
      .join('')
  }

  private async createModelFile(fileName: string) {
    const serviceFileContent = /*typescript*/ `
    import { BaseModel, beforeCreate, column, manyToMany, hasMany, hasManyThrough, belongsTo, hasOne } from '@adonisjs/lucid/orm'
    import { DateTime } from 'luxon'
    import { cuid } from '@adonisjs/core/helpers'
    import type { BaseModelInterface } from '../base/base_interface.js'
    import type { ManyToMany, HasManyThrough, HasMany, BelongsTo,HasOne } from '@adonisjs/lucid/types/relations'
    import { DATABASE_TABLES } from '../base/base_constant.js'
    import { BaseModelMixin } from '../base/base_model.js'

    export default class ${this.capitalize(fileName)} extends BaseModelMixin(DATABASE_TABLES.${fileName}) {
      @column({ isPrimary: true })
      declare id: string

      @column.dateTime({ autoCreate: true })
      declare created_at: DateTime

      @column.dateTime({ autoCreate: true, autoUpdate: true })
      declare updated_at: DateTime

      /**
       * Runs before creating a new record
       */
      @beforeCreate()
      static async addCuid(data: BaseModelInterface) {
        data.id = cuid()
      }
    }

    `
    const modelFilePath = path.join(
      path.dirname(url.fileURLToPath(import.meta.url)),
      '../',
      'app',
      'models',
      `${this.convertToSnakeCase(this.moduleName)}.ts`
    )

    if (!this.checkIfFileExists(modelFilePath)) {
      this.ensureDirectoryExistence(modelFilePath)
      await writeFile(modelFilePath, serviceFileContent)
      return modelFilePath
    }

    // if the directory exists
    const overwriteDir = await this.prompt.ask(
      `This file (${modelFilePath}) exist, Do you want to overwrite it ? (y/n)`
    )

    if (overwriteDir.toLowerCase() === 'y') {
      await writeFile(modelFilePath, serviceFileContent)
      return modelFilePath
    }

    return 'File Not Created'
  }

  async run() {
    // incase of hackers
    if (env.get('NODE_ENV') === 'production') {
      this.logger.fatal('Cannot edit the fucking file you hacker')

      return this.terminate()
    }

    // modify the module name
    this.modifyModuleName()

    // convert the moduleName to snake case
    const fileName = this.convertToSnakeCase(this.modulePath)
    const className = this.convertSnakeToCamel(fileName)

    // Create the service file with the arguments
    const serviceFilePath = await this.createModelFile(className)

    // then create the controller file

    this.logger.success(`DONE:     ${serviceFilePath}`)
  }
}
