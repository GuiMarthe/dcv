import { IsString } from 'class-validator'

export class UpdateOrderSheetDto {
  @IsString()
  id: string
}
