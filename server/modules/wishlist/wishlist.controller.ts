import { Controller, Get, Post, Delete, Param, Body } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { WishlistService } from './wishlist.service';
import { storage } from '../../storage';

@ApiTags('wishlist')
@Controller('wishlist')
export class WishlistController {
  constructor(private wishlistService: WishlistService) {
    console.log('WishlistController constructor - working directly');
  }

  @Get(':userId')
  @ApiOperation({ summary: 'Get user wishlist' })
  async getUserWishlist(@Param('userId') userId: string) {
    try {
      console.log('WishlistController getUserWishlist - working directly:', userId);
      const wishlistItems = await storage.getWishlistItems(userId);
      return {
        userId,
        items: wishlistItems,
        updatedAt: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error in wishlist getUserWishlist:', error);
      // Return empty wishlist if storage fails
      return {
        userId,
        items: [],
        updatedAt: new Date().toISOString()
      };
    }
  }

  @Post(':userId')
  @ApiOperation({ summary: 'Add item to wishlist' })
  async addToWishlist(@Param('userId') userId: string, @Body() item: any) {
    try {
      console.log('WishlistController addToWishlist - working directly:', userId, item);
      const result = await storage.addToWishlist(item);
      return result;
    } catch (error) {
      console.error('Error in wishlist addToWishlist:', error);
      throw error;
    }
  }

  @Delete(':userId/:itemId')
  @ApiOperation({ summary: 'Remove item from wishlist' })
  async removeFromWishlist(@Param('userId') userId: string, @Param('itemId') itemId: string) {
    try {
      console.log('WishlistController removeFromWishlist - working directly:', userId, itemId);
      const result = await storage.removeFromWishlist(userId, itemId);
      return result;
    } catch (error) {
      console.error('Error in wishlist removeFromWishlist:', error);
      throw error;
    }
  }
}