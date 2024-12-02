import { BaseSchema } from '@adonisjs/lucid/schema'
import { DATABASE_TABLES } from '../../app/base/base_constant.js'

export default class extends BaseSchema {
  protected tableName = DATABASE_TABLES.jobs

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.string('id').notNullable().unique().primary()
      table.string('title').notNullable()
      table.text('description').notNullable()
      table.string('company_name').nullable()
      table.string('location').nullable()
      table.string('salary').notNullable()
      table.string('type').notNullable().defaultTo('REMOTE')
      table.string('created_by').notNullable().references('id').inTable(DATABASE_TABLES.users)

      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
