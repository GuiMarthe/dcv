import { Document } from 'mongoose'
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { OrderSheetItemDto, ORDER_STATE, PaymentDto } from '../dtos'

export type OrderSheetDocument = OrderSheet & Document

@Schema()
export class OrderSheet {
  @Prop({ required: true })
  customerName: string

  @Prop({ required: true, default: ORDER_STATE.PREPARING })
  state: string

  @Prop({ required: true })
  items: OrderSheetItemDto[]

  @Prop({ required: false })
  payment: PaymentDto

  @Prop({ required: true })
  orderSum: number
}

export const OrderSheetSchema = SchemaFactory.createForClass(OrderSheet)
