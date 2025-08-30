import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';

@Controller()
export class FrontendController {
  @Get()
  getRoot(@Res() res: Response) {
    // Redirect root to admin panel
    res.redirect('/admin');
  }

  @Get('health')
  getHealth() {
    return { 
      status: 'healthy', 
      timestamp: new Date().toISOString(),
      service: 'EcoGlow Backend'
    };
  }
}