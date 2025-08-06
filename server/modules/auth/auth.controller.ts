import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { storage } from '../../storage';
import * as bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import DOMPurify from 'dompurify';
import { JSDOM } from 'jsdom';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  private jwtSecret: string;

  constructor() {
    console.log('AuthController constructor - direct approach, no DI');
    this.jwtSecret = process.env.JWT_SECRET || 'your-secret-key';
  }

  @Post('login')
  @ApiOperation({ summary: 'User login' })
  @ApiResponse({ status: 200, description: 'Login successful' })
  async login(@Body() loginData: { email: string; password: string }) {
    try {
      console.log('AuthController login - working directly:', loginData.email);
      
      // Direct user validation
      const user = await storage.getUserByEmail(loginData.email);
      if (!user || !user.passwordHash) {
        return { error: 'Invalid credentials' };
      }

      const isValidPassword = await bcrypt.compare(loginData.password, user.passwordHash);
      if (!isValidPassword) {
        return { error: 'Invalid credentials' };
      }

      // Generate JWT token
      const payload = { email: user.email, sub: user.id, role: user.role };
      const access_token = jwt.sign(payload, this.jwtSecret, { expiresIn: '1h' });

      const { passwordHash, ...userResult } = user;
      return {
        access_token,
        user: userResult,
      };
    } catch (error) {
      console.error('Error in login:', error);
      return { error: 'Login failed' };
    }
  }

  private sanitizeInput(input: string): string {
    if (!input || typeof input !== 'string') return input;
    
    // Create a DOM window for DOMPurify
    const window = new JSDOM('').window;
    const purify = DOMPurify(window as any);
    
    // Sanitize and remove all HTML tags, keeping only plain text
    return purify.sanitize(input, { ALLOWED_TAGS: [] });
  }

  private validateInput(userData: any): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    // Email validation
    if (!userData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userData.email)) {
      errors.push('Valid email address required');
    }
    
    // Password validation
    if (!userData.password || userData.password.length < 6) {
      errors.push('Password must be at least 6 characters long');
    }
    
    // Name validation
    if (!userData.firstName || userData.firstName.trim().length === 0) {
      errors.push('First name is required');
    }
    
    if (!userData.lastName || userData.lastName.trim().length === 0) {
      errors.push('Last name is required');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }

  @Post('register')
  @ApiOperation({ summary: 'User registration' })
  @ApiResponse({ status: 201, description: 'User registered successfully' })
  async register(@Body() userData: any) {
    try {
      console.log('AuthController register - working directly:', userData.email);
      
      // Input validation
      const validation = this.validateInput(userData);
      if (!validation.isValid) {
        return { 
          error: 'Validation failed', 
          details: validation.errors,
          statusCode: 400 
        };
      }
      
      // Check if user already exists
      const existingUser = await storage.getUserByEmail(userData.email);
      if (existingUser) {
        return { error: 'User already exists' };
      }

      // Sanitize all text inputs to prevent XSS
      const sanitizedUserData = {
        ...userData,
        firstName: this.sanitizeInput(userData.firstName?.trim()),
        lastName: this.sanitizeInput(userData.lastName?.trim()),
        email: userData.email.toLowerCase().trim() // Email doesn't need DOMPurify but normalize it
      };

      // Hash password and create user
      const saltRounds = 12;
      const hashedPassword = await bcrypt.hash(sanitizedUserData.password, saltRounds);
      
      const newUser = await storage.createUser({
        ...sanitizedUserData,
        passwordHash: hashedPassword,
        role: 'user'
      });

      const { passwordHash, ...result } = newUser;
      return {
        message: 'User registered successfully',
        user: result
      };
    } catch (error) {
      console.error('Error in register:', error);
      return { error: 'Registration failed' };
    }
  }
}