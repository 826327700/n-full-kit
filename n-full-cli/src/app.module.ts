import { Module } from '@nestjs/common';
import { BasicCommand } from './create.command';

@Module({
  imports: [],
  providers: [BasicCommand],
})
export class AppModule {}
