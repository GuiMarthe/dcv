import { Module } from '@nestjs/common'
import { MenuService } from './menu.service'
import { SeedMenuService } from './seed.service'
import { MenuItemSchema, MenuItem } from './schemas'
import { MongooseModule } from '@nestjs/mongoose'
import { MenuController } from './menu.controller'

@Module({
  exports: [MenuService],
  imports: [MongooseModule.forFeature([{ name: MenuItem.name, schema: MenuItemSchema, collection: 'menu_items' }])],
  providers: [MenuService, SeedMenuService],
  controllers: [MenuController]
})
export class MenuModule {}
