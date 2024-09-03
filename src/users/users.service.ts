import { ConflictException, ForbiddenException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

import { Prisma } from '@prisma/client';
import { PrismaService, } from 'src/prisma.service';

import { hash, compare } from 'bcrypt'; // encriptar
import { Role } from 'src/common/enums/rol.enum';

@Injectable()
export class UsersService {

  constructor(private prisma: PrismaService){}

  async create(userObject: CreateUserDto) {
    try {
      const existingUser = await this.prisma.user.findFirst({
        where:{
          name: userObject.name 
        }
      })
  
      if (existingUser !== null) {
       throw new ConflictException('Ya existe este usuario');
      }
  
      const { password } = userObject;
  
      const hashedPassword = await hash(password, 10);
  
      userObject = {
        ...userObject,
        password:  hashedPassword,
      }
  
      return await this.prisma.user.create({
        data: {
          name: userObject.name,
          password: userObject.password,
          role: userObject.role
        },
      });
      
    } catch (error) {

      if(error?.message === "Ya existe este usuario")
        console.error('Ya existe este usuario')
        throw new ConflictException('Ya existe este usuario')

    }
  }


  getAllUsers() {
    return this.prisma.user.findMany()
  }

  getOneUser(id: string) {
    return this.prisma.user.findUnique({
      where: {
          id: parseInt(id)
      }
    })
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  // crear superUser
  async createSuperUser(key:string){
    if (key !== process.env.SECRET_KEY) throw new ForbiddenException("no autorizado")
    
    try {
      const crearSUperAdmin = this.create({
        name:'joxmal',
        password:'12345678',
        role:Role.SUPERADMIN
      })
      return crearSUperAdmin
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        throw new ConflictException('Ya fue realizada esta consulta')
      }
    }
  }
}
