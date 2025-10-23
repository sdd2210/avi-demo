import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { databaseProviders } from 'config/database.config';

@Module({
  providers: [...databaseProviders],
  exports: [...databaseProviders],
  imports: [ConfigModule]
})
export class DatabaseModule {}
