import { Body, Controller, Param, ParseIntPipe, Post, UseGuards } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { GetUser } from 'src/auth/decorator';
import { JwtGuard } from 'src/auth/guard';
import { PrismaService } from 'src/prisma/prisma.service';
import { Routes } from 'src/utils/constants';
import { AddGroupRecipientDto } from '../dtos';

@UseGuards(JwtGuard)
@Controller(Routes.GROUP_RECIPIENTS)
export class GroupRecipientController {
  constructor(
    private prisma: PrismaService,
    private eventEmiter: EventEmitter2,
  ) {}

  @Post()
  async add(
    @GetUser('id') userId: number,
    @Param(':id', ParseIntPipe) groupId: number,
    @Body() { recipientId }: AddGroupRecipientDto
  ) {}
}
