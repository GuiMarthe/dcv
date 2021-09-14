import { Observable, interval } from 'rxjs'
import { map } from 'rxjs/operators'
import { OrderSheetService } from './order-sheet.service'
import { HttpExceptionFilter } from '../../filters/http-exception.filter'
import { UseFilters, Controller, Body, Get, Post, Sse, MessageEvent, Param } from '@nestjs/common'
import { CreateOrderSheetDto, UpdateOrderSheetDto, FinishOrderSheetDto, GetOrderSheetParamDto } from './dtos'

@UseFilters(HttpExceptionFilter)
@Controller('order-sheets')
export class OrderSheetController {
  constructor(private readonly orderSheetService: OrderSheetService) {}

  @Sse('events')
  OrderSheetEvents(): Observable<MessageEvent> {
    return this.orderSheetService.getOrderSheetsObservable()
  }

  @Post('create')
  async CreateOrderSheet(@Body() input: CreateOrderSheetDto) {
    return this.orderSheetService.createNewOrderSheet(input)
  }

  @Post('change-to-ready')
  async UpdateOrderToReady(@Body() input: UpdateOrderSheetDto) {
    return this.orderSheetService.changeOrderToReady(input.id)
  }

  @Post('checkout')
  async UpdateOrderToFinished(@Body() input: FinishOrderSheetDto) {
    return this.orderSheetService.executeCheckout(input.id, input.paymentInput)
  }

  @Get()
  async GetOrderSheets() {
    return this.orderSheetService.getOrderSheets()
  }

  @Get('/:orderSheetId')
  async GetOrderSheet(@Param() { orderSheetId }: GetOrderSheetParamDto) {
    return this.orderSheetService.getOrderSheet(orderSheetId)
  }
}
