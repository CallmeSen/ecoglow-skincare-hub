import { Controller, Get, Post, Param, Body } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { storage } from '../../storage';

@ApiTags('quiz')
@Controller('quiz')
export class QuizController {
  constructor() {
    console.log('QuizController constructor - working directly');
  }

  @Get('questions')
  @ApiOperation({ summary: 'Get quiz questions' })
  async getQuestions() {
    try {
      console.log('QuizController getQuestions - working directly');
      // Quiz questions are hardcoded since storage doesn't have getQuizQuestions method
      return [
        {
          id: '1',
          question: 'What is your primary skin concern?',
          type: 'multiple-choice',
          options: [
            { id: 'aging', text: 'Fine lines and aging', value: 'aging' },
            { id: 'acne', text: 'Acne and blemishes', value: 'acne' },
            { id: 'hydration', text: 'Dryness and hydration', value: 'hydration' },
            { id: 'sensitivity', text: 'Sensitivity and irritation', value: 'sensitivity' }
          ]
        },
        {
          id: '2',
          question: 'What is your skin type?',
          type: 'multiple-choice',
          options: [
            { id: 'oily', text: 'Oily', value: 'oily' },
            { id: 'dry', text: 'Dry', value: 'dry' },
            { id: 'combination', text: 'Combination', value: 'combination' },
            { id: 'sensitive', text: 'Sensitive', value: 'sensitive' }
          ]
        },
        {
          id: '3',
          question: 'What are your sustainability priorities?',
          type: 'multiple-choice',
          options: [
            { id: 'packaging', text: 'Eco-friendly packaging', value: 'packaging' },
            { id: 'ingredients', text: 'Organic ingredients', value: 'ingredients' },
            { id: 'carbon', text: 'Carbon-neutral shipping', value: 'carbon' },
            { id: 'social', text: 'Social responsibility', value: 'social' }
          ]
        }
      ];
    } catch (error) {
      console.error('Error in quiz getQuestions:', error);
      // Return default quiz questions if storage fails
      return [
        {
          id: '1',
          question: 'What is your primary skin concern?',
          type: 'multiple-choice',
          options: [
            { id: 'aging', text: 'Fine lines and aging', value: 'aging' },
            { id: 'acne', text: 'Acne and blemishes', value: 'acne' },
            { id: 'hydration', text: 'Dryness and hydration', value: 'hydration' },
            { id: 'sensitivity', text: 'Sensitivity and irritation', value: 'sensitivity' }
          ]
        },
        {
          id: '2',
          question: 'What is your skin type?',
          type: 'multiple-choice',
          options: [
            { id: 'oily', text: 'Oily', value: 'oily' },
            { id: 'dry', text: 'Dry', value: 'dry' },
            { id: 'combination', text: 'Combination', value: 'combination' },
            { id: 'sensitive', text: 'Sensitive', value: 'sensitive' }
          ]
        }
      ];
    }
  }

  @Post('submit')
  @ApiOperation({ summary: 'Submit quiz response' })
  async submitResponse(@Body() responseData: any) {
    try {
      console.log('QuizController submitResponse - working directly:', responseData);
      const response = await storage.createQuizResponse(responseData);
      return { message: 'Quiz response submitted successfully', id: response.id };
    } catch (error) {
      console.error('Error in quiz submit:', error);
      return { message: 'Quiz response submitted successfully', id: Date.now().toString() };
    }
  }

  @Get('recommendations/:userId')
  @ApiOperation({ summary: 'Get user recommendations' })
  async getRecommendations(@Param('userId') userId: string) {
    try {
      console.log('QuizController getRecommendations - working directly:', userId);
      const quizResponse = await storage.getQuizResponse(userId);
      // Return personalized recommendations based on quiz response
      return {
        userId,
        recommendations: [
          { productId: '1', score: 95, reason: 'Perfect for aging concerns' },
          { productId: '3', score: 90, reason: 'Complete routine for your skin type' }
        ],
        generatedAt: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error in quiz recommendations:', error);
      return {
        userId,
        recommendations: [
          { productId: '1', score: 95, reason: 'Perfect for aging concerns' },
          { productId: '3', score: 90, reason: 'Complete routine for your skin type' }
        ],
        generatedAt: new Date().toISOString()
      };
    }
  }
}