import { Controller, Get, Res, Req } from '@nestjs/common';
import { Response, Request } from 'express';
import { join } from 'path';
import { readFileSync } from 'fs';
import { AdminService } from './admin.service';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get()
  serveAdminPanel(@Res() res: Response) {
    try {
      const adminPath = join(process.cwd(), 'server', 'public', 'admin', 'index.html');
      const htmlContent = readFileSync(adminPath, 'utf8');
      res.setHeader('Content-Type', 'text/html');
      res.send(htmlContent);
    } catch (error) {
      res.status(404).send('Admin panel not found');
    }
  }

  @Get('components/:filename')
  serveAdminComponents(@Res() res: Response, @Req() req: Request) {
    try {
      const filename = req.params.filename;
      const componentPath = join(process.cwd(), 'server', 'public', 'admin', 'components', filename);
      const htmlContent = readFileSync(componentPath, 'utf8');
      res.setHeader('Content-Type', 'text/html');
      res.send(htmlContent);
    } catch (error) {
      res.status(404).send('Component not found');
    }
  }

  @Get('api/stats')
  getStats() {
    return this.adminService.getAdminStats();
  }
}
