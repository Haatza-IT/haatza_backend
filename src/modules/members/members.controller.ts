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

@Controller('api/haatza_members')
export class MembersController {
  constructor(
    @Inject(MembersService)
    private readonly membersService: MembersService,
  ) {}

  /**
   * Operation: Register_haatza_members
   * Registers a new Haatza member and returns the exact 6-field data payload.
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(new ZodValidationPipe(memberRegistrationSchema))
  async Register_haatza_members(
    @Body() dto: MemberRegistrationDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<MemberResponse> {
    return this.membersService.registerMember(dto, res);
  }
}
