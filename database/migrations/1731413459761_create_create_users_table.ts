import { BaseSchema } from '@adonisjs/lucid/schema'
import { DATABASE_TABLES } from '../../app/base/base_constant.js'

export default class extends BaseSchema {
  protected tableName = DATABASE_TABLES.users

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.string('id').notNullable().unique().primary()
      table.string('name').nullable()
      table.string('email', 254).notNullable().unique()
      table.string('password').notNullable()
      table.string('role').notNullable().defaultTo('USER')

      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
