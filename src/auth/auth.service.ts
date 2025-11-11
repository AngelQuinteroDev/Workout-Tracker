import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { User } from './interfaces/user.interface';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private prisma: PrismaService,
  ) {}

  // ============ GENERAR TOKENS ============
  async generateTokens(user: User) {
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    // Access token - 15 minutos
    const access_token = this.jwtService.sign(payload, {
      secret: process.env.JWT_ACCESS_SECRET || 'default-access-secret',
      expiresIn: '15m',
    });

    // Refresh token - 7 días
    const refresh_token = this.jwtService.sign(payload, {
      secret: process.env.JWT_REFRESH_SECRET || 'default-refresh-secret',
      expiresIn: '7d',
    });

    // Guardar refresh token en BD
    await this.prisma.users.update({
      where: { id: user.id },
      data: { refresh_token },
    });

    return {
      access_token,
      refresh_token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  }

  // ============ REGISTRO ============
  async register(data: { name: string; email: string; password: string }) {
    const existingUser = await this.prisma.users.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      throw new BadRequestException('El email ya está registrado');
    }

    if (data.password.length < 6) {
      throw new BadRequestException(
        'La contraseña debe tener al menos 6 caracteres',
      );
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = await this.prisma.users.create({
      data: {
        name: data.name,
        email: data.email,
        password_hash: hashedPassword,
        role: 'user',
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        created_at: true,
      },
    });

    return this.generateTokens(user as User);
  }

  // ============ LOGIN ============
  async login(email: string, password: string) {
    const user = await this.prisma.users.findUnique({
      where: { email },
    });

    if (!user) {
      throw new UnauthorizedException('Email o contraseña incorrectos');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Email o contraseña incorrectos');
    }

    return this.generateTokens(user as User);
  }

  // ============ REFRESH ACCESS TOKEN ============
  async refreshAccessToken(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET || 'default-refresh-secret',
      }) as { sub: number; email: string; role: string };

      const user = await this.prisma.users.findUnique({
        where: { id: payload.sub },
      });

      if (!user) {
        throw new UnauthorizedException('Usuario no encontrado');
      }

      if (user.refresh_token !== refreshToken) {
        throw new UnauthorizedException('Refresh token inválido o revocado');
      }

      const newAccessToken = this.jwtService.sign(
        {
          sub: user.id,
          email: user.email,
          role: user.role,
        },
        {
          secret: process.env.JWT_ACCESS_SECRET || 'default-access-secret',
          expiresIn: '15m',
        },
      );

      return { access_token: newAccessToken };
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Error al refrescar token:', error.message);
      }
      throw new UnauthorizedException('Refresh token inválido o expirado');
    }
  }

  // ============ LOGOUT ============
  async logout(userId: number) {
    await this.prisma.users.update({
      where: { id: userId },
      data: { refresh_token: null },
    });

    return { message: 'Logout exitoso' };
  }

  // ============ VALIDAR USUARIO ============
  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.prisma.users.findUnique({ where: { email } });

    if (!user) return null;

    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) return null;

    return user as User;
  }
}
