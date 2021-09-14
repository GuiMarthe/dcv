import seed from './menu.seed'
import { Model } from 'mongoose'
import { InjectModel } from '@nestjs/mongoose'
import { MenuItem, MenuItemDocument } from './schemas'
import { Injectable, OnModuleInit } from '@nestjs/common'

@Injectable()
export class SeedMenuService implements OnModuleInit {
  constructor(@InjectModel(MenuItem.name) private menuItemCollection: Model<MenuItemDocument>) {}

  async onModuleInit() {
    await this.clearDatabase()
    await this.seedDatabase()
  }

  async clearDatabase() {
    try {
      await this.menuItemCollection.collection.drop()
    } catch (err) {
      // this error code happens when trying to drop a non-existing collection
      if (err.code && err.code === 26) return

      console.error(err)
    }
  }

  async seedDatabase() {
    for (const menuItem of seed) {
      try {
        await this.menuItemCollection.create(menuItem)
      } catch (err) {
        console.error(`could not create menu item: ${menuItem.name}`)
      }
    }
  }
}
