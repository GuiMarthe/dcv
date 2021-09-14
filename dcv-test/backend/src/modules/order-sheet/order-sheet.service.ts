import { Subject } from 'rxjs'
import { Model } from 'mongoose'
import { InjectModel } from '@nestjs/mongoose'
import { MenuService } from '../menu/menu.service'
import { EventEmitter2 } from '@nestjs/event-emitter'
import { OrderSheet, OrderSheetDocument } from './schemas'
import { Injectable, MessageEvent, HttpException } from '@nestjs/common'
import {
  CreateOrderSheetDto,
  OrderSheetDto,
  OrderSheetItemDto,
  ORDER_STATE,
  PaymentDto,
  PaymentInputDto,
  PAYMENT_METHOD
} from './dtos'

@Injectable()
export class OrderSheetService {
  private ordersSubject = new Subject<MessageEvent>()

  constructor(
    @InjectModel(OrderSheet.name) private orderSheetCollection: Model<OrderSheetDocument>,
    private readonly menuService: MenuService,
    private ee: EventEmitter2
  ) {}

  async createNewOrderSheet(orderSheetInput: CreateOrderSheetDto) {
    const newOrderSheet = await this.populateOrderSheetMenuItemsAndOrderSum(orderSheetInput)

    console.log(JSON.stringify(newOrderSheet))

    const createdOrderSheet = await this.orderSheetCollection.create(newOrderSheet)

    this.ordersSubject.next({
      data: {
        event: 'orderSheet.created',
        order: createdOrderSheet.toObject()
      }
    })

    return createdOrderSheet
  }

  private async populateOrderSheetMenuItemsAndOrderSum(orderSheetInput: CreateOrderSheetDto): Promise<OrderSheetDto> {
    const newOrderSheet: OrderSheetDto = {
      state: ORDER_STATE.PREPARING,
      customerName: orderSheetInput.customerName,
      items: [],
      orderSum: 0
    }

    for (const item of orderSheetInput.items) {
      const menuItem = await this.menuService.getMenuItem(item.id)

      newOrderSheet.items.push({
        id: item.id,
        qty: item.qty,
        value: menuItem.value,
        name: menuItem.name
      })

      newOrderSheet.orderSum += menuItem.value * item.qty
    }

    return newOrderSheet
  }

  async changeOrderToReady(orderSheetId: string) {
    await this.validateExpectedState(ORDER_STATE.PREPARING, orderSheetId)

    const updatedOrderSheet = await this.orderSheetCollection.findOneAndUpdate(
      { _id: orderSheetId },
      {
        $set: { state: ORDER_STATE.READY }
      },
      { new: true }
    )

    this.ordersSubject.next({
      data: {
        event: 'orderSheet.updated',
        order: updatedOrderSheet
      }
    })
  }

  async executeCheckout(orderSheetId: string, paymentInput: PaymentInputDto) {
    await this.validateExpectedState(ORDER_STATE.READY, orderSheetId)

    const orderSheet = await this.orderSheetCollection.findOne({ _id: orderSheetId })

    if (!orderSheet) {
      throw new HttpException('order sheet not found', 404)
    }

    const orderSum = this.getOrderSum(orderSheet.items)
    const payment = this.generatePaymentInfo(paymentInput, orderSum)

    await this.changeOrderToFinished(orderSheetId, payment)
  }

  private generatePaymentInfo(paymentInput: PaymentInputDto, orderSum: number): PaymentDto {
    if (paymentInput.method !== PAYMENT_METHOD.CASH) {
      return {
        method: paymentInput.method,
        value: orderSum
      }
    }

    if (!paymentInput.value || paymentInput.value < orderSum) {
      throw new HttpException('insufficient funds', 501)
    }

    return {
      method: paymentInput.method,
      value: paymentInput.value,
      change: paymentInput.value - orderSum
    }
  }

  private getOrderSum(items: OrderSheetItemDto[]): number {
    let sum = 0
    for (const item of items) {
      sum = sum + item.value * item.qty
    }
    return sum
  }

  private async changeOrderToFinished(orderSheetId: string, payment: PaymentInputDto) {
    const updatedOrderSheet = await this.orderSheetCollection.findOneAndUpdate(
      {
        _id: orderSheetId
      },
      {
        $set: { state: ORDER_STATE.FINISHED, payment }
      },
      { new: true }
    )

    this.ordersSubject.next({
      data: {
        event: 'orderSheet.updated',
        order: updatedOrderSheet
      }
    })
    this.ee.emit('orderSheet.finished', updatedOrderSheet)
  }

  private async validateExpectedState(expectedState: string, orderSheetId: string) {
    const orderSheet = await this.getOrderSheet(orderSheetId)

    if (orderSheet.state !== expectedState) {
      throw new HttpException('invalid order sheet state, could not proceed', 422)
    }
  }

  async getOrderSheet(orderSheetId: string): Promise<OrderSheetDto> {
    const orderSheet = await this.orderSheetCollection.findOne({ _id: orderSheetId })
    if (!orderSheet) {
      throw new HttpException('order sheet not found', 404)
    }
    return orderSheet
  }

  async getOrderSheets(): Promise<OrderSheetDto[]> {
    return this.orderSheetCollection.find({ state: { $ne: 'FINISHED' } })
  }

  getOrderSheetsObservable() {
    return this.ordersSubject.asObservable()
  }
}
