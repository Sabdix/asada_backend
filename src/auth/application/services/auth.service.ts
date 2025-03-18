import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  async generateAccessToken(payload: object): Promise<string> {
    return this.jwtService.signAsync(payload);
  }

  async generateRefreshToken(payload: object, secret: string): Promise<string> {
    return this.jwtService.signAsync(payload, {
      secret: secret,
      expiresIn: '7d',
    });
  }
}
