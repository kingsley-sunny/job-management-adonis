import { withAuthFinder } from '@adonisjs/auth/mixins/lucid'
import { compose, cuid } from '@adonisjs/core/helpers'
import hash from '@adonisjs/core/services/hash'
import { beforeCreate, column } from '@adonisjs/lucid/orm'
import { DateTime } from 'luxon'
import { DATABASE_TABLES } from '../base/base_constant.js'
import type { BaseModelInterface } from '../base/base_interface.js'
import { BaseModelMixin } from '../base/base_model.js'

const AuthFinder = withAuthFinder(() => hash.use('scrypt'), {
  uids: ['email'],
  passwordColumnName: 'password',
})

type UserRole = 'USER' | 'ADMIN'

export default class User extends compose(BaseModelMixin(DATABASE_TABLES.users), AuthFinder) {
  @column({ isPrimary: true })
  declare id: string

  @column()
  declare name: string | null

  @column()
  declare email: string

  @column({ serializeAs: null })
  declare password: string

  @column.dateTime({ autoCreate: true })
  declare created_at: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updated_at: DateTime

  @column()
  declare role: UserRole

  /**
   * Runs before creating a new record
   */
  @beforeCreate()
  static async addCuid(data: BaseModelInterface) {
    data.id = cuid()
  }
}
