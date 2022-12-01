import { Module } from '@nestjs/common';

import { UsersService } from './services';
import { DbModule } from '../db/db.module';
import { UsersController } from './users.controller';

@Module({
  imports: [ DbModule ],
  providers: [ UsersService ],
  exports: [ UsersService ],
  controllers: [ UsersController ],
})
export class UsersModule {}
