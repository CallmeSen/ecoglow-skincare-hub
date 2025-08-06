import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { DatabaseService } from '../database/database.service';
import { storage } from '../../storage';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
  ) {
    console.log('AuthService constructor - using direct storage, jwtService:', !!this.jwtService);
  }

  async validateUser(email: string, password: string): Promise<any> {
    try {
      console.log('AuthService validateUser - working directly:', email);
      const user = await storage.getUserByEmail(email);
      if (user && user.passwordHash && await bcrypt.compare(password, user.passwordHash)) {
        const { passwordHash, ...result } = user;
        return result;
      }
      return null;
    } catch (error) {
      console.error('Error in validateUser:', error);
      return null;
    }
  }

  async login(user: any) {
    try {
      console.log('AuthService login - working directly:', user?.email);
      const payload = { email: user.email, sub: user.id, role: user.role };
      return {
        access_token: this.jwtService.sign(payload),
        user: user,
      };
    } catch (error) {
      console.error('Error in login:', error);
      throw error;
    }
  }

  async register(userData: any) {
    try {
      console.log('AuthService register - working directly:', userData?.email);
      const saltRounds = 12;
      const hashedPassword = await bcrypt.hash(userData.password, saltRounds);
      
      const newUser = await storage.createUser({
        ...userData,
        passwordHash: hashedPassword,
      });

      const { passwordHash, ...result } = newUser;
      return result;
    } catch (error) {
      console.error('Error in register:', error);
      throw error;
    }
  }
}