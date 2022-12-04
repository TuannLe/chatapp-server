import { User } from '@prisma/client';
import { Socket } from 'socket.io';

export interface IDecodeToken {
  username: String,
  userId: number,
  iat: number,
  exp: number
}

export interface IUser extends IDecodeToken {
  socketId: String
}

export interface AuthenticatedSocket extends Socket {
  // user?: User;
  user?: IUser
  // token?: String;
  // decode_token?: IUser;
}
