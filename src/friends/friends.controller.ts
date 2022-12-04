import {
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { GetUser } from 'src/auth/decorator';
import { JwtGuard } from 'src/auth/guard';
import { Routes } from 'src/utils/constants';
import { FriendService } from './friends.service';

@UseGuards(JwtGuard)
@Controller(Routes.FRIENDS)
export class FriendsController {
  constructor(private service: FriendService) { }

  @Get()
  getFriends(@GetUser('id') userId: number) {
    return this.service.getFriends(userId);
  }

  @Delete(Routes.DELETE_FRIEND)
  deleteFriends(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.service.delete(userId, id);
  }

  @Get(Routes.SEARCH_FRIEND)
  search(@GetUser('id') userId: number, @Param('querry') querry: string) {
    return this.service.search(querry, userId);
  }
}
