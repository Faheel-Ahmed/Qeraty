import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { ApiModule } from './api.module';
import { UserModule } from './users/users.module';
import { AppController } from './app.controller';
import { DateScalar } from 'shared/date.scalar';
import { JwtModule } from '@nestjs/jwt';
import { UserService } from 'users/users.service';
import { jwtConstants } from './auth/config/constants';
import { UserEntity } from 'users/users.entity';
import { RoleEntity } from './roles/roles.entity'

@Module({
  imports: [
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '60d' },
    }),
    UserModule,
    TypeOrmModule.forRoot(),
    TypeOrmModule.forFeature([UserEntity,RoleEntity]),
    // GraphQLModule.forRoot({
    //   typePaths: ['./**/*.graphql'],
    //   context: ({ req }) => ({ headers: req.headers }),
    // }),
    ApiModule,
    ConfigModule.forRoot({
      envFilePath: "environments/.env.development"
    }),
  ],
  controllers: [AppController],
  providers: [DateScalar,UserService],
})
export class AppModule {
  
}