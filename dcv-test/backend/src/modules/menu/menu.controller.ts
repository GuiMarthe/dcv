import { MenuService } from './menu.service'
import { Controller, Get } from '@nestjs/common'

@Controller('menu')
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  @Get('items')
  async GetItems() {
    return await this.menuService.getMenuItems()
  }

  @Get('items/most-ordered')
  async GetMostOrderedItems() {
    return await this.menuService.getMostOrderedItems()
  }
}
