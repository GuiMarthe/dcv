import { Type } from 'class-transformer'
import { PaymentInputDto } from './payment.dto'
import { IsString, ValidateNested } from 'class-validator'

export class FinishOrderSheetDto {
  @IsString()
  id: string

  @ValidateNested()
  @Type(() => PaymentInputDto)
  paymentInput: PaymentInputDto
}
