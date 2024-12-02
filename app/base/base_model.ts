import { errors as lucidErrors } from '@adonisjs/lucid'
import { BaseModel } from '@adonisjs/lucid/orm'
import { LucidModel, LucidRow, ModelAttributes } from '@adonisjs/lucid/types/model'
import { PAGE_SIZE } from './base_constant.js'
import { FetchQuery } from './base_interface.js'

export class DefaultModel extends BaseModel implements LucidRow {
  constructor() {
    super()
  }

  static table: string

  static findWithQuery<T extends LucidModel>(
    this: T,
    columns?: Partial<ModelAttributes<InstanceType<T>>>,
    query?: FetchQuery
  ) {
    try {
      const search = query?.search
      let filterBy = query?.filterBy
      const order = query?.order
      let orderBy = query?.orderBy

      // delete sensitive fields like password
      delete (columns as any).password

      let queryBuilder = this.query()
      if (columns) {
        queryBuilder = queryBuilder.where(columns)
      }

      if (orderBy?.includes('password')) {
        orderBy = 'updated_at'
      }

      if (filterBy?.includes('password')) {
        filterBy = 'id'
      }

      if (search && filterBy) {
        queryBuilder = queryBuilder.where(filterBy, 'like', `%${search}%`)
      } else {
        filterBy = 'id'
        queryBuilder = queryBuilder.where(filterBy, 'like', `%${search}%`)
      }

      queryBuilder = queryBuilder.orderBy(orderBy || 'updated_at', order || 'desc')
      return queryBuilder
    } catch (error) {
      console.log(error)
      throw new lucidErrors.E_RUNTIME_EXCEPTION(error.message)
    }
  }

  static async findWithQueryAndPaginate<T extends LucidModel>(
    this: T,
    columns: Partial<ModelAttributes<InstanceType<T>>>,
    query?: FetchQuery
  ) {
    const page = query?.page ?? 1
    const perPage = query?.perPage ?? PAGE_SIZE
    try {
      const data = await DefaultModel.findWithQuery(columns || {}, query).paginate(page, perPage)

      return data
    } catch (error) {
      console.log(error)
      throw new lucidErrors.E_RUNTIME_EXCEPTION(error.message)
    }
  }
}

export function BaseModelMixin(tableName: string) {
  return class NackModel extends BaseModel {
    constructor() {
      super()
    }

    static table = tableName

    static findWithQuery<T extends LucidModel>(
      this: T,
      columns?: Partial<ModelAttributes<InstanceType<T>>>,
      query?: FetchQuery
    ) {
      try {
        const search = query?.search
        let filterBy = query?.filterBy
        const order = query?.order
        let orderBy = query?.orderBy

        // delete sensitive fields like password
        delete (columns as any).password

        let queryBuilder = this.query()

        if (columns) {
          queryBuilder = queryBuilder.where(columns)
        }

        if (orderBy?.includes('password')) {
          orderBy = 'created_at'
        }

        if (filterBy?.includes('password')) {
          filterBy = 'name'
        }

        if (search && filterBy) {
          queryBuilder = queryBuilder.where(filterBy, 'like', `%${search}%`)
        }

        queryBuilder = queryBuilder.orderBy(orderBy || 'created_at', order || 'desc')

        console.log('🚀 ~~ NackModel ~~ BaseModelMixin ~~ queryBuilder:', queryBuilder.toQuery())
        return queryBuilder
      } catch (error) {
        console.log(error)
        throw new lucidErrors.E_RUNTIME_EXCEPTION(error.message)
      }
    }

    static async findWithQueryAndPaginate<T extends LucidModel>(
      this: T,
      columns: Partial<ModelAttributes<InstanceType<T>>>,
      query?: FetchQuery
    ) {
      const page = query?.page ?? 1
      const perPage = query?.perPage ?? PAGE_SIZE
      try {
        const data = await (this as any).findWithQuery(columns, query).paginate(page, perPage)

        return data
      } catch (error) {
        console.log(error)
        throw new lucidErrors.E_RUNTIME_EXCEPTION(error.message)
      }
    }

    static async touch<T extends LucidModel>(
      this: T,
      columns: Partial<ModelAttributes<InstanceType<T>>>,
      query?: FetchQuery
    ) {
      try {
        const data = await (this as any).findWithQuery(columns, query).first()

        return !!data
      } catch (error) {
        console.log(error)
        throw new lucidErrors.E_RUNTIME_EXCEPTION(error.message)
      }
    }
  }
}

export function applyMixins(derivedCtor: any, baseCtors: any[]) {
  baseCtors.forEach((baseCtor) => {
    Object.getOwnPropertyNames(baseCtor.prototype).forEach((name) => {
      if (name !== 'constructor') {
        Object.defineProperty(
          derivedCtor.prototype,
          name,
          Object.getOwnPropertyDescriptor(baseCtor.prototype, name)!
        )
      }
    })
    Object.getOwnPropertyNames(baseCtor).forEach((name) => {
      if (name !== 'prototype') {
        Object.defineProperty(derivedCtor, name, Object.getOwnPropertyDescriptor(baseCtor, name)!)
      }
    })
  })
}
