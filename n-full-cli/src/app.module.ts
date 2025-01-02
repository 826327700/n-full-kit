import { Module } from '@nestjs/common';
import { CreateCommand } from './create.command';
import { InjectCommand } from './inject.command';

@Module({
  imports: [],
  providers: [CreateCommand,InjectCommand],
})
export class AppModule {}
