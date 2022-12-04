import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  FriendRequestAcceptedException,
  FriendRequestException,
  FriendRequestNotFoundException,
} from './exceptions';

@Injectable()
export class FriendRequestService {
  constructor(private prisma: PrismaService) {}

  async getFriendRequests(userId: number) {
    const list = await this.prisma.friend.findMany({
      where: {
        userTwoId: userId,
        status: 1,
      },
      select: {
        UserOne: {
          select: {
            username: true,
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            avatar: true,
          },
        },
      },
    });

    return list.map((item) => {
      item['id'] = item.UserOne.id;
      item['username'] = item.UserOne.username;
      item['email'] = item.UserOne.email;
      item['firstName'] = item.UserOne.firstName;
      item['lastName'] = item.UserOne.lastName;
      item['avatar'] = item.UserOne.avatar;
      delete item.UserOne;
      return item;
    });
  }

  async create(senderId: number, receiverId: number) {
    if (senderId == receiverId)
      throw new ForbiddenException(
        'Cannot create friend request for yourself!',
      );

    const isFriend = await this.isFriend(senderId, receiverId);
    if (isFriend.length) throw new FriendRequestException('');
    try {
      await this.prisma.friend.create({
        data: {
          userOneId: senderId,
          userTwoId: receiverId,
          status: 1,
        },
      });

      return this.getUser(senderId);
    } catch (error) {
      throw new FriendRequestException('friend_request exist');
    }
  }

  async accept(userId: number, receiverId: number) {
    if (userId == receiverId)
      throw new ForbiddenException(
        'Cannot create friend request for yourself!',
      );
    try {
      const user = await this.prisma.friend.update({
        where: {
          userOneId_userTwoId: {
            userOneId: receiverId,
            userTwoId: userId,
          },
        },
        data: {
          status: 2,
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
      if (user.UserOne.id == receiverId) {
        user['info'] = user.UserTwo;
        delete user.UserOne;
        delete user.UserTwo;
        return user;
      } else {
        user['info'] = user.UserOne;
        delete user.UserOne;
        delete user.UserTwo;
        return user;
      }
    } catch (error) {
      throw new ForbiddenException();
    }
  }

  async reject(userId: number, id: number) {
    try {
      return await this.prisma.friend.delete({
        where: {
          userOneId_userTwoId: {
            userOneId: id,
            userTwoId: userId,
          },
        },
      });
    } catch (error) {
      throw new FriendRequestNotFoundException();
    }
  }

  async cancel(userId: number, id: number) {
    try {
      return await this.prisma.friend.delete({
        where: {
          userOneId_userTwoId: {
            userOneId: userId,
            userTwoId: id,
          },
        },
      });
    } catch (error) {
      throw new FriendRequestNotFoundException();
    }
  }

  isFriend(userOneId: number, userTwoId: number) {
    return this.prisma.friend.findMany({
      where: {
        OR: [
          {
            AND: [{ userOneId: userOneId, userTwoId: userTwoId, status: 2 }],
          },
          {
            AND: [{ userOneId: userTwoId, userTwoId: userOneId, status: 2 }],
          },
        ],
      },
    });
  }

  getUser(userId: number) {
    return this.prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        username: true,
        email: true,
        avatar: true,
        firstName: true,
        lastName: true,
      },
    });
  }
}
