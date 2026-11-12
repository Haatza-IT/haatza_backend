import { Controller, Post, Body, HttpCode, HttpStatus, UsePipes, Inject } from '@nestjs/common';
import { MembersService } from './members.service';
import { ZodValidationPipe } from '../../common/pipes/zod-validation.pipe';
import { memberRegistrationSchema } from './members.schema';
import type { MemberRegistrationDto, MemberResponse } from './members.types';

@Controller('api/haatza_members')
export class MembersController {
  constructor(
    @Inject(MembersService)
    private readonly membersService: MembersService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(new ZodValidationPipe(memberRegistrationSchema))
  async registerMember(@Body() dto: MemberRegistrationDto): Promise<MemberResponse> {
    return this.membersService.registerMember(dto);
  }
}
