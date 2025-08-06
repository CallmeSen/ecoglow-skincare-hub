import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { CartService } from './cart.service';
import { storage } from '../../storage';

@ApiTags('cart')
@Controller('cart')
export class CartController {
  constructor(private cartService: CartService) {
    console.log('CartController constructor - working directly');
  }

  @Get(':userId')
  @ApiOperation({ summary: 'Get user cart' })
  async getUserCart(@Param('userId') userId: string) {
    try {
      console.log('CartController getUserCart - working directly:', userId);
      const cartItems = await storage.getCartItems(userId);
      return {
        userId,
        items: cartItems,
        total: cartItems.reduce((sum, item) => sum + (parseFloat(item.product.price) * item.quantity), 0),
        updatedAt: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error in cart getUserCart:', error);
      // Return empty cart if storage fails
      return {
        userId,
        items: [],
        total: 0,
        updatedAt: new Date().toISOString()
      };
    }
  }

  @Post(':userId')
  @ApiOperation({ summary: 'Add item to cart' })
  async addToCart(@Param('userId') userId: string, @Body() item: any) {
    try {
      console.log('CartController addToCart - working directly:', userId, item);
      
      // Validation 1: Check minimum quantity
      if (!item.quantity || item.quantity < 1) {
        throw new Error('Minimum quantity is 1');
      }
      
      // Validation 2: Check if product exists
      const product = await storage.getProduct(item.productId);
      if (!product) {
        throw new Error('Product not found');
      }
      
      // Validation 3: Check if quantity exceeds stock
      if (item.quantity > product.stock) {
        throw new Error(`Only ${product.stock} items available in stock`);
      }
      
      const result = await storage.addToCart(item);
      return result;
    } catch (error) {
      console.error('Error in cart addToCart:', error);
      return { 
        error: error.message || 'Failed to add item to cart',
        statusCode: 400 
      };
    }
  }

  @Put(':userId/:itemId')
  @ApiOperation({ summary: 'Update cart item quantity' })
  async updateCartItem(
    @Param('userId') userId: string,
    @Param('itemId') itemId: string,
    @Body() body: { quantity: number }
  ) {
    try {
      console.log('CartController updateCartItem - working directly:', userId, itemId, body.quantity);
      
      // Validation: Check minimum quantity
      if (!body.quantity || body.quantity < 1) {
        return { 
          error: 'Minimum quantity is 1',
          statusCode: 400 
        };
      }
      
      const result = await storage.updateCartItem(itemId, body.quantity);
      return result;
    } catch (error) {
      console.error('Error in cart updateCartItem:', error);
      return { 
        error: error.message || 'Failed to update cart item',
        statusCode: 400 
      };
    }
  }

  @Delete(':userId/:itemId')
  @ApiOperation({ summary: 'Remove item from cart' })
  async removeFromCart(@Param('userId') userId: string, @Param('itemId') itemId: string) {
    try {
      console.log('CartController removeFromCart - working directly:', userId, itemId);
      const result = await storage.removeFromCart(userId, itemId);
      return result;
    } catch (error) {
      console.error('Error in cart removeFromCart:', error);
      throw error;
    }
  }

  @Delete(':userId')
  @ApiOperation({ summary: 'Clear cart' })
  async clearCart(@Param('userId') userId: string) {
    try {
      console.log('CartController clearCart - working directly:', userId);
      const result = await storage.clearCart(userId);
      return result;
    } catch (error) {
      console.error('Error in cart clearCart:', error);
      throw error;
    }
  }
}