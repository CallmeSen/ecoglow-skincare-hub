import { Injectable } from '@nestjs/common';

@Injectable()
export class AdminService {
  getAdminStats() {
    return {
      totalProducts: 25,
      totalOrders: 150,
      totalUsers: 500,
      revenue: 15000,
      carbonOffset: 125.5,
      treesPlanted: 300
    };
  }
}
