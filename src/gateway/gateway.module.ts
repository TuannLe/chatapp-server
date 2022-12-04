import { Module } from '@nestjs/common';
import { Services } from '../utils/constants';
import { Gateway } from './gateway';
import { WebsocketAdapter } from './gateway.adapter';
import { GatewaySessionManager } from './gateway.session';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [WebsocketAdapter],
  providers: [
    Gateway,
    JwtService,
    {
      provide: Services.GATEWAY_SESSION_MANAGER,
      useClass: GatewaySessionManager,
    },
  ],
  exports: [
    Gateway,
    {
      provide: Services.GATEWAY_SESSION_MANAGER,
      useClass: GatewaySessionManager,
    },
  ],
  
})
export class GatewayModule {}
