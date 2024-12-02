import { cuid } from '@adonisjs/core/helpers'
import { beforeCreate, column } from '@adonisjs/lucid/orm'
import { DateTime } from 'luxon'
import { DATABASE_TABLES } from '../base/base_constant.js'
import type { BaseModelInterface } from '../base/base_interface.js'
import { BaseModelMixin } from '../base/base_model.js'

type JobType = 'FULL_TIME' | 'PART_TIME' | 'INTERNSHIP' | 'REMOTE'

export default class ContactInquiry extends BaseModelMixin(DATABASE_TABLES.contact_inquires) {
  @column({ isPrimary: true })
  declare id: string

  @column()
  declare name: string

  @column()
  declare email: string

  @column()
  declare message: string

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
