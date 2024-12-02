import { BaseSchema } from '@adonisjs/lucid/schema'
import { DATABASE_TABLES } from '../../app/base/base_constant.js'

export default class extends BaseSchema {
  protected tableName = DATABASE_TABLES.saved_jobs

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.string('id').notNullable().unique().primary()

      table.string('job_id').references('id').inTable(DATABASE_TABLES.jobs)
      table.string('user_id').references('id').inTable(DATABASE_TABLES.users)

      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
