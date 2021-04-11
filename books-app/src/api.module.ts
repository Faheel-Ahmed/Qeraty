import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { Module } from '@nestjs/common';
import { HttpErrorFilter } from './shared/http-error.filter';
import { LoggingInterceptor } from './shared/logging.interceptor';
import { UserModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { jwtConstants } from './auth/config/constants';
import { RoleModule } from 'roles/role.module';
import { JwtModule } from '@nestjs/jwt';
import { GenresModule } from 'genres/genres.module';
import { BooksModule } from 'books/books.module';
import { FavouritesModule } from 'favourites/favourites.module';
import { ShelvesModule } from 'shelves/shelves.module';
import { TagsModule } from 'tags/tags.module';

@Module({
  imports: [UserModule,RoleModule,AuthModule,GenresModule,BooksModule,FavouritesModule,ShelvesModule,TagsModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '60d' },
    }),
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: HttpErrorFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
  ],
  exports: [ UserModule,JwtModule],
})
export class ApiModule {}