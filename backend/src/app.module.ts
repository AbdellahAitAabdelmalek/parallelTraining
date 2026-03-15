import { Module } from '@nestjs/common';
import { RagModule } from './presentation/http/rag.module';

@Module({
  imports: [RagModule],
})
export class AppModule {}
