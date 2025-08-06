import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { storage } from '../../storage';
import type { IStorage } from '../../storage';

@Injectable()
export class DatabaseService implements OnModuleInit {
  private _storage: IStorage;

  constructor(private configService: ConfigService) {
    console.log('DatabaseService constructor called');
    this._storage = storage;
  }

  async onModuleInit() {
    // Initialize database connection if needed
    console.log('Database service initialized successfully');
  }

  get storage(): IStorage {
    console.log('Storage accessor called, returning:', !!this._storage);
    return this._storage;
  }
}