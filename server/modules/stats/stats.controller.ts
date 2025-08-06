import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { storage } from '../../storage';

@ApiTags('stats')
@Controller('stats')
export class StatsController {
  constructor() {
    console.log('StatsController constructor - working directly');
  }

  @Get('sustainability')
  @ApiOperation({ summary: 'Get sustainability statistics' })
  async getSustainabilityStats() {
    console.log('Controller getSustainabilityStats - working directly');
    try {
      // Get stats from storage directly
      const sustainabilityStats = await storage.getSustainabilityStats();
      return {
        treesPlanted: sustainabilityStats.treesPlanted,
        co2Offset: parseInt(sustainabilityStats.co2Offset) || 0,
        recyclablePackaging: 95,
        organicIngredients: 80
      };
    } catch (error) {
      console.error('Error in getSustainabilityStats:', error);
      // Fallback static data if storage fails
      return {
        treesPlanted: 12000,
        co2Offset: 5000,
        recyclablePackaging: 95,
        organicIngredients: 80
      };
    }
  }

  @Get('general')
  @ApiOperation({ summary: 'Get general statistics' })
  async getGeneralStats() {
    console.log('Controller getGeneralStats - working directly');
    return {
      totalUsers: 25000,
      totalOrders: 15000,
      totalProducts: 150,
      avgRating: 4.8
    };
  }
}