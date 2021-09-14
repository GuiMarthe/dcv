import { registerAs } from '@nestjs/config'

export const config = registerAs('config', () => ({
  dbhost: process.env.dbhost || 'mongodb://localhost:27017'
}))
