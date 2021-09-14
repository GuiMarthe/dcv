import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { EventEmitterModule } from '@nestjs/event-emitter'
import { ConfigModule, ConfigService } from '@nestjs/config'

import { config } from './config/app.config'
import { MenuModule } from './modules/menu/menu.module'
import { OrderSheetModule } from './modules/order-sheet/order-sheet.module'
import { HealthcheckModule } from './modules/healthcheck/healthcheck.module'

@Module({
  imports: [
    ConfigModule.forRoot({ load: [config] }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        return { uri: configService.get<string>('config.dbhost') }
      }
    }),
    HealthcheckModule,
    MenuModule,
    OrderSheetModule,
    EventEmitterModule.forRoot()
  ]
})
export class AppModule {}
