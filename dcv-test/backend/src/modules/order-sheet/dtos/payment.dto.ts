import { IsString, IsNumber, IsIn, IsPositive, IsOptional } from 'class-validator'

export const PAYMENT_METHOD = { DEBIT: 'DEBIT', CREDIT: 'CREDIT', CASH: 'CASH' }
const validMethods = [PAYMENT_METHOD.DEBIT, PAYMENT_METHOD.CREDIT, PAYMENT_METHOD.CASH]

export class PaymentDto {
  @IsString()
  @IsIn(validMethods)
  method: string

  @IsNumber()
  @IsPositive()
  value: number

  @IsNumber()
  @IsPositive()
  change?: number
}

export class PaymentInputDto {
  @IsString()
  @IsIn(validMethods)
  method: string

  @IsOptional()
  @IsNumber()
  @IsPositive()
  value?: number
}
