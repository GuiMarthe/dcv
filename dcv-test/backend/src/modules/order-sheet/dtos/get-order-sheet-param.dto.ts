import { IsString } from 'class-validator'

export class GetOrderSheetParamDto {
  @IsString()
  orderSheetId: string
}
