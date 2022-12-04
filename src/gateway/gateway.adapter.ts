import { IoAdapter } from '@nestjs/platform-socket.io';
import { AuthenticatedSocket, IDecodeToken } from '../utils/interfaces';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

export class WebsocketAdapter extends IoAdapter {
  private readonly jwtService: JwtService = new JwtService();
  private config: ConfigService = new ConfigService();

  createIOServer(port: number, options?: any) {
    const server = super.createIOServer(port, options);
    server.use(async (socket: AuthenticatedSocket, next) => {
      const token = socket.handshake.headers?.access_token;

      if (!token) {
        console.log('Client has no token');
        return next(new Error('Not Authenticated. No token were sent'));
      }

      const decode_token: IDecodeToken = this.jwtService.verify(String(token), {
        secret: this.config.get('JWT_SECRET'),
      });

      if (!decode_token?.userId) return next(new Error('Error signing token'));

      socket.user = {
        ...decode_token,
        socketId: socket.id,
      };

      next();
    });
    return server;
  }
}
