import { Injectable } from '@nestjs/common';
import { storage } from '../../storage';
import type { Product } from '@shared/schema';

@Injectable()
export class ProductsService {
  constructor() {
    console.log('ProductsService constructor called successfully');
  }

  async findAll(filters: any = {}) {
    try {
      return await storage.getProducts(filters);
    } catch (error) {
      console.error('Error in findAll products:', error);
      throw new Error('Failed to fetch products');
    }
  }

  async findOne(id: string) {
    return await storage.getProduct(id);
  }

  async search(query: string) {
    return await storage.searchProducts(query);
  }

  async create(productData: any) {
    return await storage.createProduct(productData);
  }

  async update(id: string, productData: any) {
    return await storage.updateProduct(id, productData);
  }

  async remove(id: string) {
    return await storage.deleteProduct(id);
  }
}