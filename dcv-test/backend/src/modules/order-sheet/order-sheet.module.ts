import { Module } from '@nestjs/common'
import { MenuModule } from '../menu/menu.module'
import { MongooseModule } from '@nestjs/mongoose'
import { OrderSheet, OrderSheetSchema } from './schemas'
import { OrderSheetService } from './order-sheet.service'
import { OrderSheetController } from './order-sheet.controller'

@Module({
  imports: [
    MongooseModule.forFeature([{ name: OrderSheet.name, schema: OrderSheetSchema, collection: 'order_sheets' }]),
    MenuModule
  ],
  providers: [OrderSheetService],
  controllers: [OrderSheetController]
})
export class OrderSheetModule {}
