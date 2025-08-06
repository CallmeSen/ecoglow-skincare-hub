import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

// JWT configuration
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1h';
const JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || '7d';

// Password hashing utilities
export class PasswordUtils {
  static async hash(password: string): Promise<string> {
    const saltRounds = 12;
    return bcrypt.hash(password, saltRounds);
  }

  static async verify(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }
}

// JWT utilities
export class JWTUtils {
  static sign(payload: object, expiresIn: string = JWT_EXPIRES_IN): string {
    return jwt.sign(payload, JWT_SECRET, { 
      expiresIn: expiresIn as any,
      algorithm: 'HS256'
    });
  }

  static verify(token: string): any {
    return jwt.verify(token, JWT_SECRET);
  }

  static generateTokens(user: { id: string; email: string; role: string }) {
    const accessToken = this.sign({ 
      userId: user.id, 
      email: user.email, 
      role: user.role 
    }, JWT_EXPIRES_IN);
    
    const refreshToken = this.sign({ 
      userId: user.id 
    }, JWT_REFRESH_EXPIRES_IN);

    return { accessToken, refreshToken };
  }
}