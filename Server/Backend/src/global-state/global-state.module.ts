import { Global, Module } from '@nestjs/common';
import { GlobalStateService } from './global-state.service';

@Global()
@Module({
  providers: [GlobalStateService],
  exports: [GlobalStateService],
})
export class GlobalStateModule {}
