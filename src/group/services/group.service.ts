import { ForbiddenException, Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateGroupDto, UpdateGroupDetalDto } from '../dtos';

@Injectable()
export class GroupService {
  constructor(private prisma: PrismaService) {}

  async getGroups(userId: number) {
    return await this.prisma.group.findMany({
      where: {
        Users: {
          some: {
            userId: userId,
          },
        },
      },
    });
  }

  async getGroup(groupId: number) {
    return await this.prisma.group.findUnique({
      where: {
        id: groupId,
      },
      select: {
        id: true,
        creatorId: true,
        title: true,
        lastMessageAt: true,
        lastMessageSent: true,
        avatar: true,
        createAt: true,
        Users: {
          select: {
            user: {
              select: {
                username: true,
                email: true,
                firstName: true,
                lastName: true,
                id: true,
                avatar: true,
              },
            },
          },
        },
      },
    });
  }

  async getGroupMessage(groupId: number) {
    return await this.prisma.groupMessage.findMany({
      where: {
        groupId: groupId,
      },
    });
  }

  async createGroup(user: User, payload: CreateGroupDto) {
    try {
      const data = payload.users.map((item) => ({
        userId: item,
      }));

      const response = await this.prisma.group.create({
        data: {
          creatorId: user.id,
          title: payload.title,
          avatar: payload.avatar,
          Users: {
            createMany: {
              data: data,
            },
          },
        },
      });
      
      return this.prisma.group.findUnique({
        where: {
          id: response.id,
        },
        select: {
          creatorId: true,
          title: true,
          avatar: true,
          Users: {
            select: {
              user: {
                select: {
                  username: true,
                  id: true,
                  email: true,
                  avatar: true,
                  firstName: true,
                  lastName: true,
                },
              },
            },
          },
        },
      });
    } catch {
      throw new ForbiddenException();
    }
  }

  async updateGroupOwner(userId: number, groupId: number, newOwnerId: number) {
    const oldOwnerId = await this.prisma.group.findUnique({
      where: {
        id: groupId,
      },
      select: {
        creatorId: true,
      },
    });
    if (oldOwnerId.creatorId != userId) throw new ForbiddenException();
    return await this.prisma.group.update({
      where: {
        id: groupId,
      },
      data: {
        creatorId: newOwnerId,
      },
    });
  }

  async updateGroupDetails(groupId: number, payload: UpdateGroupDetalDto) {
    return await this.prisma.group.update({
      where: {
        id: groupId,
      },
      data: {
        title: payload.title,
        avatar: payload.avatar,
      },
    });
  }

  async getGroupChatList(groupId: number) {
    try {
      return await this.prisma.groupMessage.findMany({
        where: {
          groupId: groupId,
        },
        select: {
          id: true,
          groupId: true,
          from: true,
          message: true,
          createAt: true,
          updateAt: true,
          fromUser: {
            select: {
              id: true,
              avatar: true,
              firstName: true,
              lastName: true,
              email: true,
              username: true,
            },
          },
        },
      });
    } catch (error) {
      throw new ForbiddenException(error);
    }
  }

  findUser(userId: number) {
    return this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
  }
}
