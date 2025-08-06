import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class BlogService {
  constructor(private databaseService: DatabaseService) {}

  async findAll() {
    return this.databaseService.storage.getBlogPosts();
  }

  async findOne(id: string) {
    return this.databaseService.storage.getBlogPost(id);
  }

  async create(blogData: any) {
    return this.databaseService.storage.createBlogPost(blogData);
  }

  async update(id: string, blogData: any) {
    return this.databaseService.storage.updateBlogPost(id, blogData);
  }

  async remove(id: string) {
    return this.databaseService.storage.deleteBlogPost(id);
  }
}