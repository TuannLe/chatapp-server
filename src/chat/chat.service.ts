import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { GetChatDto } from './dto';

@Injectable()
export class ChatService {
  constructor(private prisma: PrismaService) {}

  async getChat(receiverId: number, userId: number) {
    return this.prisma.chat.findMany({
      where: {
        OR: [
          {
            AND: [{ from: userId }, { to: receiverId }],
          },
          {
            AND: [{ from: receiverId }, { to: userId }],
          },
        ],
      },
    });
  }
}
