import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { DeleteFriendException } from './exceptions';

@Injectable()
export class FriendService {
  constructor(private prisma: PrismaService) { }

  async getFriends(userId: number) {
    const listFriend = await this.prisma.friend.findMany({
      where: {
        OR: [
          {
            AND: [{ userOneId: userId }, { status: 2 }],
          },
          {
            AND: [{ userTwoId: userId }, { status: 2 }],
          },
        ],
      },
      select: {
        id: true,
        UserOne: {
          select: {
            id: true,
            avatar: true,
            username: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
        UserTwo: {
          select: {
            id: true,
            avatar: true,
            username: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    return listFriend.map((item) => {
      if (item.UserOne.id == userId) {
        item['info'] = item.UserTwo;
        delete item.UserOne;
        delete item.UserTwo;
        return item;
      } else {
        item['info'] = item.UserOne;
        delete item.UserOne;
        delete item.UserTwo;
        return item;
      }
    });
  }

  async delete(userId: number, id: number) {
    try {
      try {
        return await this.prisma.friend.delete({
          where: {
            userOneId_userTwoId: {
              userOneId: id,
              userTwoId: userId,
            },
          },
        });
      } catch {
        return await this.prisma.friend.delete({
          where: {
            userOneId_userTwoId: {
              userOneId: userId,
              userTwoId: id,
            },
          },
        });
      }
    } catch (error) {
      throw new DeleteFriendException();
    }
  }

  async search(querry: string, userId: number) {
    const list = await this.prisma.user.findMany({
      where: {
        username: {
          contains: querry,
        },
      },
      select: {
        id: true,
        username: true,
        email: true,
        avatar: true,
        firstName: true,
        lastName: true,
        UserOne: {
          where: {
            userTwoId: userId,
          },
          select: {
            status: true,
          },
        },
        UserTwo: {
          where: {
            userOneId: userId,
          },
          select: {
            status: true,
          },
        },
      },
    });

    return list.map((item) => {
      if (item.UserOne.length) {
        item['status'] = item.UserOne[0].status;
        delete item.UserOne;
        delete item.UserTwo;
        return item;
      } else if (item.UserTwo.length) {
        item['status'] = item.UserTwo[0].status;
        delete item.UserOne;
        delete item.UserTwo;
        return item;
      } else {
        item['status'] = null;
        delete item.UserOne;
        delete item.UserTwo;
        return item;
      }
    });
  }
}
