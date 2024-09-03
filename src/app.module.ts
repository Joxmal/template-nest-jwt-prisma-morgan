import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';

import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { ExcelModule } from './excel/excel.module';

@Module({
  imports: [
    // ServeStaticModule.forRoot({
    //   serveRoot: '/post/',
    //   rootPath: join(__dirname, '..', 'static/uploads/filePost'),
    // }),
    ConfigModule.forRoot(),
    AuthModule, ExcelModule,UsersModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
