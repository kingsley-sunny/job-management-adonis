import { cuid } from '@adonisjs/core/helpers'
import { beforeCreate, belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import { DateTime } from 'luxon'
import { DATABASE_TABLES } from '../base/base_constant.js'
import type { BaseModelInterface } from '../base/base_interface.js'
import { BaseModelMixin } from '../base/base_model.js'
import Job from './job.js'
import User from './user.js'

export enum ApplicationStatus {
  PENDING = 'PENDING',
  REVIEWED = 'REVIEWED',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
}

export default class Application extends BaseModelMixin(DATABASE_TABLES.applications) {
  @column({ isPrimary: true })
  declare id: string

  @column()
  declare job_id: string

  @column()
  declare user_id: string

  @column()
  declare status: ApplicationStatus

  @column.dateTime({ autoCreate: true })
  declare created_at: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updated_at: DateTime

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  @belongsTo(() => Job)
  declare job: BelongsTo<typeof Job>

  /**
   * Runs before creating a new record
   */
  @beforeCreate()
  static async addCuid(data: BaseModelInterface) {
    data.id = cuid()
  }
}
