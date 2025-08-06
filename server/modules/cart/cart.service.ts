import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class CartService {
  constructor(private databaseService: DatabaseService) {}

  async getUserCart(userId: string) {
    return this.databaseService.storage.getCartItems(userId);
  }

  async addToCart(userId: string, item: any) {
    return this.databaseService.storage.addToCart(item);
  }

  async updateCartItem(userId: string, itemId: string, quantity: number) {
    return this.databaseService.storage.updateCartItem(itemId, quantity);
  }

  async removeFromCart(userId: string, itemId: string) {
    return this.databaseService.storage.removeFromCart(userId, itemId);
  }

  async clearCart(userId: string) {
    return this.databaseService.storage.clearCart(userId);
  }
}