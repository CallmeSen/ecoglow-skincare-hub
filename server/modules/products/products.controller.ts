import { 
  Controller, 
  Get, 
  Post, 
  Put, 
  Delete, 
  Param, 
  Query, 
  Body, 
  UseGuards,
  HttpException,
  HttpStatus
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { ThrottlerGuard } from '@nestjs/throttler';
import { storage } from '../../storage';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('products')
@Controller('products')
@UseGuards(ThrottlerGuard)
export class ProductsController {
  constructor() {
    console.log('ProductsController constructor - working directly');
  }

  @Get()
  @ApiOperation({ summary: 'Get all products' })
  @ApiResponse({ status: 200, description: 'Returns all products' })
  async findAll(@Query() query: any) {
    try {
      console.log('ProductsController findAll - working directly');
      const { category, featured, trending } = query;
      const filters: any = {};
      
      if (category) filters.category = category;
      if (featured !== undefined) filters.featured = featured === 'true';
      if (trending !== undefined) filters.trending = trending === 'true';
      
      return await storage.getProducts(filters);
    } catch (error) {
      console.error('Error in products findAll:', error);
      throw new HttpException('Failed to fetch products', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('search')
  @ApiOperation({ summary: 'Search products without query' })
  @ApiResponse({ status: 200, description: 'Returns all products for empty search' })
  async searchEmpty() {
    try {
      console.log('ProductsController searchEmpty - returning all products');
      return await storage.getProducts();
    } catch (error) {
      console.error('Error in empty search:', error);
      throw new HttpException('Failed to search products', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('search/:query')
  @ApiOperation({ summary: 'Search products' })
  @ApiResponse({ status: 200, description: 'Returns search results' })
  async search(@Param('query') query: string) {
    try {
      console.log('ProductsController search - working directly:', query);
      
      // Handle empty or whitespace-only queries
      if (!query || query.trim().length === 0) {
        console.log('Empty search query, returning all products');
        return await storage.getProducts();
      }
      
      return await storage.searchProducts(query.trim());
    } catch (error) {
      console.error('Error in products search:', error);
      throw new HttpException('Failed to search products', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get product by ID' })
  @ApiResponse({ status: 200, description: 'Returns a product' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  async findOne(@Param('id') id: string) {
    try {
      console.log('ProductsController findOne - working directly:', id);
      const product = await storage.getProduct(id);
      if (!product) {
        throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
      }
      return product;
    } catch (error) {
      console.error('Error finding product:', error);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('Failed to fetch product', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create new product (admin only)' })
  @ApiResponse({ status: 201, description: 'Product created successfully' })
  async create(@Body() productData: any) {
    try {
      console.log('ProductsController create - working directly');
      return await storage.createProduct(productData);
    } catch (error) {
      console.error('Error creating product:', error);
      throw new HttpException('Failed to create product', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update product (admin only)' })
  @ApiResponse({ status: 200, description: 'Product updated successfully' })
  async update(@Param('id') id: string, @Body() productData: any) {
    try {
      console.log('ProductsController update - working directly:', id);
      const updatedProduct = await storage.updateProduct(id, productData);
      if (!updatedProduct) {
        throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
      }
      return updatedProduct;
    } catch (error) {
      console.error('Error updating product:', error);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('Failed to update product', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete product (admin only)' })
  @ApiResponse({ status: 200, description: 'Product deleted successfully' })
  async remove(@Param('id') id: string) {
    try {
      console.log('ProductsController remove - working directly:', id);
      const deleted = await storage.deleteProduct(id);
      if (!deleted) {
        throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
      }
      return { message: 'Product deleted successfully' };
    } catch (error) {
      console.error('Error deleting product:', error);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('Failed to delete product', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}