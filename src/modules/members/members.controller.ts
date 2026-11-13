import {
  Controller,
  Post,
  Body,
  Res,
  HttpCode,
  HttpStatus,
  UsePipes,
  Inject,
} from '@nestjs/common';
import type { Response } from 'express';
import { MembersService } from './members.service';
import { ZodValidationPipe } from '../../common/pipes/zod-validation.pipe';
import { memberRegistrationSchema } from './members.schema';
import type { MemberRegistrationDto, MemberResponse } from './members.types';

@Controller()
export class MembersController {
  constructor(
    @Inject(MembersService)
    private readonly membersService: MembersService,
  ) {}

  /**
   * Operation: register_Haatza_Members
   * Registers a new Haatza member.
   * Supports:
   * - POST /register_Haatza_Members
   * - POST /api/register_Haatza_Members
   * - POST /Register_haatza_members
   * - POST /api/Register_haatza_members
   * - POST /api/haatza_members
   */
  @Post([
    'register_Haatza_Members',
    'api/register_Haatza_Members',
    'Register_haatza_members',
    'api/Register_haatza_members',
    'api/haatza_members',
  ])
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(new ZodValidationPipe(memberRegistrationSchema))
  async register_Haatza_Members(
    @Body() dto: MemberRegistrationDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<MemberResponse> {
    return this.membersService.registerMember(dto, res);
  }
}
