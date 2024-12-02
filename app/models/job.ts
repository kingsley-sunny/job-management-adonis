import { cuid } from '@adonisjs/core/helpers'
import { beforeCreate, belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import { DateTime } from 'luxon'
import { DATABASE_TABLES } from '../base/base_constant.js'
import type { BaseModelInterface } from '../base/base_interface.js'
import { BaseModelMixin } from '../base/base_model.js'
import User from './user.js'

export enum JobType {
  FULL_TIME = 'FULL_TIME',
  PART_TIME = 'PART_TIME',
  INTERNSHIP = 'INTERNSHIP',
  REMOTE = 'REMOTE',
}

export default class Job extends BaseModelMixin(DATABASE_TABLES.jobs) {
  @column({ isPrimary: true })
  declare id: string

  @column()
  declare title: string

  @column()
  declare description: string

  @column()
  declare company_name: string

  @column()
  declare location: string

  @column()
  declare salary: string

  @column()
  declare type: JobType

  @column()
  declare created_by: string

  @column.dateTime({ autoCreate: true })
  declare created_at: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updated_at: DateTime

  @belongsTo(() => User, { foreignKey: 'created_by' })
  declare createdBy: BelongsTo<typeof User>

  /**
   * Runs before creating a new record
   */
  @beforeCreate()
  static async addCuid(data: BaseModelInterface) {
    data.id = cuid()
  }
}
