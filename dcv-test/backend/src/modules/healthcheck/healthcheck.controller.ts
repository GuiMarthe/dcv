import { Controller, Get } from '@nestjs/common'

@Controller('/health')
export class HealthcheckController {
  @Get()
  healthcheck() {
    return 'desafio comanda virtual is alive'
  }
}
