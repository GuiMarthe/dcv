import { AppModule } from './app.module'
import { NestFactory } from '@nestjs/core'
import { ValidationPipe } from '@nestjs/common'

async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule, { cors: true })
    app.useGlobalPipes(new ValidationPipe({ transform: true, stopAtFirstError: true, validateCustomDecorators: true }))
    await app.listen(3000)
    console.log(`desafio comanda virtual listening in: http://localhost:${3000}`)
  } catch (err) {
    console.error('Error bootstraping desafio comanda virtual', err)
  }
}

bootstrap()
