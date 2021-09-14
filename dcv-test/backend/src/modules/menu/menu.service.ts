import { Model } from 'mongoose'
import { MenuItemDto } from './dtos'
import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { OnEvent } from '@nestjs/event-emitter'
import { MenuItem, MenuItemDocument } from './schemas'

interface OrderUpdatedEvent {
  customerName: string
  state: string
  items: {
    id: string
    name: string
    value: number
    qty: number
  }[]
}

@Injectable()
export class MenuService {
  private readonly mostOrderedLimit = 3

  constructor(@InjectModel(MenuItem.name) private menuItemCollection: Model<MenuItemDocument>) {}

  @OnEvent('orderSheet.finished', { async: true })
  async handleOrderUpdated(e: OrderUpdatedEvent) {
    for (const item of e.items) {
      await this.increaseItemOrderCounter(item.id, item.qty)
    }
  }

  async getMenuItem(id: string): Promise<MenuItemDto> {
    return this.menuItemCollection.findOne({ _id: id })
  }

  async getMenuItems(): Promise<MenuItemDto[]> {
    return this.menuItemCollection.find()
  }

  async increaseItemOrderCounter(id: string, ammount: number): Promise<void> {
    try {
      await this.menuItemCollection.findByIdAndUpdate(id, { $inc: { orderCount: ammount } })
    } catch (err) {
      console.error(`could not increase the orderAmmount for menu item with id: ${id}`)
    }
  }

  async getMostOrderedItems(): Promise<MenuItemDto[]> {
    return this.menuItemCollection.find({}, {}, { sort: { orderCount: -1 }, limit: this.mostOrderedLimit })
  }
}
