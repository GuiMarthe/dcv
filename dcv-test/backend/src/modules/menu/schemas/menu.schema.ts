import { Document } from 'mongoose'
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'

export type MenuItemDocument = MenuItem & Document

@Schema()
export class MenuItem {
  @Prop({ required: true })
  type: string

  @Prop({ required: true })
  name: string

  @Prop({ required: true })
  value: number

  @Prop({ default: 0 })
  orderCount: number
}

export const MenuItemSchema = SchemaFactory.createForClass(MenuItem)
