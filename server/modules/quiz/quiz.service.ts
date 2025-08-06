import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class QuizService {
  constructor(private databaseService: DatabaseService) {}

  async getQuizQuestions() {
    return this.databaseService.storage.getQuizQuestions();
  }

  async submitQuizResponse(responseData: any) {
    return this.databaseService.storage.submitQuizResponse(responseData);
  }

  async getRecommendations(userId: string) {
    return this.databaseService.storage.getQuizRecommendations(userId);
  }
}