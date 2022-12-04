import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { Routes } from '../../utils/constants';
import { JwtGuard } from 'src/auth/guard';
import { GetUser } from 'src/auth/decorator';
import { GroupService } from '../services/group.service';
import { CreateGroupDto, TransferOwnerDto, UpdateGroupDetalDto } from '../dtos';
import { User } from '@prisma/client';
import { EventEmitter2 } from '@nestjs/event-emitter';

@UseGuards(JwtGuard)
@Controller(Routes.GROUP)
export class GroupController {
  constructor(
    private service: GroupService,
    private eventEmitter: EventEmitter2,
  ) {}

  @Get(Routes.GET_GROUPS)
  getGroups(@GetUser('id') userId: number) {
    return this.service.getGroups(userId);
  }

  @Get(Routes.GET_GROUP)
  getGroup(@Param('id', ParseIntPipe) groupId: number) {
    return this.service.getGroup(groupId);
  }

  @Post(Routes.CREATE_GROUP)
  async createGroup(@GetUser() user: User, @Body() payload: CreateGroupDto) {
    const response = await this.service.createGroup(user, payload);
    this.eventEmitter.emit('group.create', response);
    return response;
  }

  @Post(Routes.UPDATE_GROUP_OWNER)
  updateGroupOwner(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) groupId: number,
    @Body() { newOwnerId }: TransferOwnerDto,
  ) {
    return this.service.updateGroupOwner(userId, groupId, newOwnerId);
  }

  @Post(Routes.UPDATE_GROUP_DETAIL)
  updateGroupDetails(
    @Param('id', ParseIntPipe) groupId: number,
    @Body() payload: UpdateGroupDetalDto,
  ) {
    return this.service.updateGroupDetails(groupId, payload);
  }

  @Get(Routes.GET_CHAT_LIST)
  getGroupChatList(@Param('id', ParseIntPipe) groupId: number) {
    return this.service.getGroupChatList(groupId);
  }
}
