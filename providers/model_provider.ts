import type { ApplicationService } from '@adonisjs/core/types'
import { BaseModel } from '@adonisjs/lucid/orm'
import { GlobalNamingStrategy } from '../app/models/strategies/global_strategy.js'

export default class ModelProvider {
  constructor(protected app: ApplicationService) {}

  /**
   * Register bindings to the container
   */
  register() {}

  /**
   * The container bindings have booted
   */
  async boot() {}

  /**
   * The application has been booted
   */
  async start() {
    BaseModel.namingStrategy = new GlobalNamingStrategy()
  }

  /**
   * The process has been started
   */
  async ready() {}

  /**
   * Preparing to shutdown the app
   */
  async shutdown() {}
}
