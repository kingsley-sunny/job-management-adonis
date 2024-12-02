// import type { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'
import { FetchColumn, FetchQuery } from '../../base/base_interface.js'
import User from '../../models/user.js'
import { CreateUserType, UpdateUserType } from '../../validators/user/user_validator.js'

@inject()
export default class UserService {
  constructor(protected ctx: HttpContext) {}

  async create(data: CreateUserType) {
    const user = await User.create(data)

    return user
  }

  async update(id: string, data: UpdateUserType) {}

  async find(columns: FetchColumn<User>, query: FetchQuery) {
    const users = await User.findWithQuery(columns, query)

    return users
  }

  async findOne(columns?: FetchColumn<User>) {}

  async findById(id: string) {}

  async delete(id: string) {}
}
