import { Controller, Post, Body, HttpCode, HttpStatus, UsePipes, Inject } from '@nestjs/common';
import { MembersService } from './members.service';
import { ZodValidationPipe } from '../../common/pipes/zod-validation.pipe';
import { memberRegistrationSchema } from '../user-master/user-master.schema';
import type { MemberRegistrationDto } from '../user-master/user-master.types';

@Controller('api/haatza_members')
export class MembersController {
  constructor(
    @Inject(MembersService)
    private readonly membersService: MembersService
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(new ZodValidationPipe(memberRegistrationSchema))
  async registerMember(@Body() dto: MemberRegistrationDto) {
    return this.membersService.registerMember(dto);
  }
}
