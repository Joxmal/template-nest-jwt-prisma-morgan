import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Request as RequestExpress , } from 'express';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { Role } from 'src/common/enums/rol.enum';



@ApiTags("Modulo Users")
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  
  @Auth(Role.SUPERADMIN)
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }
  
  @Auth(Role.ADMIN)
  @Get()
  getAllUsers(@Request() req:RequestExpress ) {

    console.log(req)
    return this.usersService.getAllUsers();
  }

  @Auth(Role.ADMIN)
  @Get(':id')
  getUserById(@Param('id') id: string) {
    return this.usersService.getOneUser(id);
  }

  @Auth(Role.SUPERADMIN)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Auth(Role.SUPERADMIN)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
  // create super User
  @Post('/superUser/:key')
  createSuperUser(
    @Param('key') key: string
  ) {
    return this.usersService.createSuperUser(key);
  }
}
