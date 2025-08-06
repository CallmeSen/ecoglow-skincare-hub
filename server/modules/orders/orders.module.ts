import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';

@Module({
  controllers: [OrdersController],
  providers: [],
  exports: [],
})
export class OrdersModule {
  constructor() {
    console.log('OrdersModule constructor - direct approach');
  }
}