import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class WishlistService {
  constructor(private databaseService: DatabaseService) {}

  async getUserWishlist(userId: string) {
    return this.databaseService.storage.getWishlist(userId);
  }

  async addToWishlist(userId: string, item: any) {
    return this.databaseService.storage.addToWishlist(userId, item);
  }

  async removeFromWishlist(userId: string, itemId: string) {
    return this.databaseService.storage.removeFromWishlist(userId, itemId);
  }
}