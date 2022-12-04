import { Module } from '@nestjs/common';
import { FriendsController } from './friends.controller';
import { FriendService } from './friends.service';

@Module({
  controllers: [FriendsController],
  providers: [FriendService],
})
export class FriendsModule { }
