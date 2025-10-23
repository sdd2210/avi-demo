import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
// import { MeetingInforModule } from './meeting-infor/meeting-infor.module';
// import { DatabaseModule } from './database/database.module';
// import { MeetingScheduleModule } from './meeting_schedule/meeting_schedule.module';
// import { ParticipantsModule } from './participants/participants.module';
// import { DocummentModule } from './documment/documment.module';
import {
  ConfigModule,
  ConfigService
} from '@nestjs/config';
// import { TypeOrmModule } from '@nestjs/typeorm';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { ConfigDataModule } from './config-data/config-data.module';
import { GlobalStateModule } from './global-state/global-state.module';

@Module({
  imports: [
    // MeetingInforModule,
    // TypeOrmModule.forRootAsync({
    //   inject: [ConfigService],
    //   imports: [ConfigModule],
    //   useFactory: async (config: ConfigService) => {
    //     return {
    //       type: 'mysql',
    //       host: config.get("DB_HOST") || "",
    //       port: config.get("DB_PORT") || 3306,
    //       username: config.get("DB_USERNAME") || "",
    //       password: config.get("DB_PASSWORD") || "",
    //       database: config.get("DB_DATABASE") || "",
    //       entities: [
    //         __dirname + '/../**/*.entity{.ts,.js}',
    //       ],
    //       synchronize: true,
    //     };
    //   },
    // }),
    // DatabaseModule,
    // MeetingScheduleModule,
    // ParticipantsModule,
    // DocummentModule,
    ConfigModule.forRoot({ isGlobal: true }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'storage'),
      serveRoot: "/assert"
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'client'),
    }),
    ConfigDataModule,
    GlobalStateModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
