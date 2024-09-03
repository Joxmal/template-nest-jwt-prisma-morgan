import {
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';

import { compare } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { LoginAuthDto } from './dto/login-auth.dto';

import { PrismaService } from 'src/prisma.service';
import { token } from 'morgan';
import { LogoutAuthDto } from './dto/logout-auth';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async loginUser(user: LoginAuthDto) {
    const userExist = await this.prisma.user.findUnique({
      where: {
        name: user.name,
      },
      omit: {
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!userExist)
      throw new HttpException('este usuario no existe', HttpStatus.FORBIDDEN);

    const checkPassword = await compare(user.password, userExist.password);

    if (!checkPassword) throw new HttpException('contraseña incorrecta', 403);

    const payload = {
      id: userExist.id,
      name: userExist.name,
      role: userExist.role,
    };

    const token = this.jwtService.sign(payload);

    delete userExist.password;

    const data = {
      token,
      user: {
        ...userExist,
      },
    };

    return data;
  }

  async decodeToken(token: string) {
    try {
      const result = await this.jwtService.verifyAsync(token); // Verifica el token
      console.log(result); // Muestra el contenido decodificado del token
      return result; // Retorna el payload del token
    } catch (error) {
      console.error('Token inválido');
      throw new ConflictException('envio un token invalido');
    }
  }
}
