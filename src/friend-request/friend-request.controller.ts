import {
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { Routes } from '../utils/constants';
import { JwtGuard } from 'src/auth/guard';
import { GetUser } from 'src/auth/decorator';
import { FriendRequestService } from './friend-request.service';
import { CreateFriendReq } from './dtos';
import { EventEmitter2 } from '@nestjs/event-emitter';

@UseGuards(JwtGuard)
@Controller(Routes.FRIENDS_REQUEST)
export class FriendRequestController {
  constructor(
    private service: FriendRequestService,
    private eventEmitter: EventEmitter2,
  ) {}

  @Get()
  getFriendRequests(@GetUser('id') userId: number) {
    return this.service.getFriendRequests(userId);
  }

  @HttpCode(HttpStatus.CREATED)
  @Get(Routes.CREATE_FRIENDS_REQUEST)
  async createFriendRequest(
    @GetUser('id') senderId: number,
    @Param('id', ParseIntPipe) receiverId: number,
  ) {
    const response = await this.service.create(senderId, receiverId);
    return this.eventEmitter.emit('friend.request.create', {
      receiverId,
      response,
    });
  }

  @HttpCode(HttpStatus.ACCEPTED)
  @Get(Routes.ACCEPT_FRIENDS_REQUEST)
  async acceptFriendRequest(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) receiverId: number,
  ) {
    const response = await this.service.accept(userId, receiverId);
    return this.eventEmitter.emit('friend.request.accept', {
      receiverId,
      response,
    });
  }

  @Delete(Routes.REJECT_FRIENDS_REQUEST)
  async rejectFriendRequest(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.service.reject(userId, id);
  }

  @Delete(Routes.CANCEL_FRIENDS_REQUEST)
  async cancelFriendRequest(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.service.cancel(userId, id);
  }
}
