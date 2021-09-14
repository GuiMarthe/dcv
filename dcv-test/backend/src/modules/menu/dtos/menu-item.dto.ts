import { IsString, IsNumber } from 'class-validator'

class MenuItemDto {
  @IsString()
  type: string

  @IsString()
  name: string

  @IsNumber()
  value: number

  @IsNumber()
  orderCount?: number
}

export default MenuItemDto
