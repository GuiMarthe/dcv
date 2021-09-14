import { Type } from 'class-transformer'
import { PaymentDto } from './payment.dto'
import {
  IsString,
  IsArray,
  ArrayMinSize,
  IsNotEmpty,
  IsNumber,
  IsIn,
  IsPositive,
  ValidateNested
} from 'class-validator'

export const ORDER_STATE = { PREPARING: 'PREPARING', READY: 'READY', FINISHED: 'FINISHED' }
const validStates = [ORDER_STATE.PREPARING, ORDER_STATE.READY, ORDER_STATE.FINISHED]

export class OrderSheetDto {
  @IsString()
  customerName: string

  @IsString()
  @IsIn(validStates)
  state: string

  @IsNotEmpty()
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => OrderSheetItemDto)
  items: OrderSheetItemDto[]

  @ValidateNested()
  @Type(() => PaymentDto)
  payment?: PaymentDto

  @IsNumber()
  @IsPositive()
  orderSum: number
}

export class OrderSheetItemDto {
  @IsString()
  @IsNotEmpty()
  id: string

  @IsString()
  @IsNotEmpty()
  name: string

  @IsNumber()
  @IsPositive()
  value: number

  @IsNumber()
  @IsPositive()
  qty: number
}
