import {
  Controller,
  Post,
  Get,
  Body,
  UseGuards,
  Req,
  HttpCode,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  // ============ REGISTRO ============
  // POST /auth/register
  // Body: { name, email, password }
  @Post('register')
  @HttpCode(201)
  async register(
    @Body() data: { name: string; email: string; password: string },
  ) {
    return this.authService.register(data);
  }

  // ============ LOGIN ============
  // POST /auth/login
  // Body: { email, password }
  @Post('login')
  @HttpCode(200)
  async login(@Body() data: { email: string; password: string }) {
    return this.authService.login(data.email, data.password);
  }

  // ============ REFRESH TOKEN ============
  // POST /auth/refresh
  // Body: { refresh_token }
  @Post('refresh')
  @HttpCode(200)
  async refresh(@Body() data: { refresh_token: string }) {
    return this.authService.refreshAccessToken(data.refresh_token);
  }

  // ============ LOGOUT ============
  // POST /auth/logout
  // Headers: Authorization: Bearer {access_token}
  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @HttpCode(200)
  async logout(@Req() req: any) {
    return this.authService.logout(req.user.userId);
  }

  // ============ GET PROFILE ============
  // GET /auth/profile
  // Headers: Authorization: Bearer {access_token}
  @Get('profile')
  @UseGuards(JwtAuthGuard)
  async getProfile(@Req() req: any) {
    return {
      userId: req.user.userId,
      email: req.user.email,
      role: req.user.role,
    };
  }

  // ============ GET ME ============
  // GET /auth/me
  // Headers: Authorization: Bearer {access_token}
  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getMe(@Req() req: any) {
    return req.user;
  }
}