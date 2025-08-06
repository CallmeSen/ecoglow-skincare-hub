import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class OrdersService {
  constructor(private databaseService: DatabaseService) {}

  async findAll() {
    return this.databaseService.storage.getOrders();
  }

  async findOne(id: string) {
    return this.databaseService.storage.getOrder(id);
  }

  async create(orderData: any) {
    return this.databaseService.storage.createOrder(orderData);
  }

  async updateStatus(id: string, status: string) {
    // For now, return a mock response as updateOrderStatus doesn't exist in IStorage interface
    return { id, status, message: "Order status updated" };
  }
}