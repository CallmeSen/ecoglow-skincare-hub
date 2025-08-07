import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class UsersService {
  constructor(private databaseService: DatabaseService) {}

  async findAll() {
    return this.databaseService.storage.getUsers();
  }

  async findOne(id: string) {
    return this.databaseService.storage.getUser(id);
  }

  async create(userData: any) {
    return this.databaseService.storage.createUser(userData);
  }

  async update(id: string, userData: any) {
    return this.databaseService.storage.updateUser(id, userData);
  }

  async remove(id: string) {
    return this.databaseService.storage.deleteUser(id);
  }
}