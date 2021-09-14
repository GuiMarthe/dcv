import { Type } from 'class-transformer'
import { IsString, IsArray, ArrayMinSize, IsNotEmpty, IsNumber, IsPositive, ValidateNested } from 'class-validator'

export class CreateOrderSheetDto {
  @IsString()
  customerName: string

  @IsNotEmpty()
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => OrderSheetItemDto)
  items: OrderSheetItemDto[]
}

export class OrderSheetItemDto {
  @IsString()
  @IsNotEmpty()
  id: string

  @IsNumber()
  @IsPositive()
  qty: number
}
