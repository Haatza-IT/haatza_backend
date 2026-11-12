import { Controller, Post, Body, HttpCode, HttpStatus, UseGuards, UsePipes, Inject } from '@nestjs/common';
import { Throttle, seconds } from '@nestjs/throttler';
import { EmployeesService } from './employees.service';
import { AdminAuthGuard } from '../../common/guards/admin-auth.guard';
import { ZodValidationPipe } from '../../common/pipes/zod-validation.pipe';
import { employeeUpdateSchema } from './employees.schema';
import type { EmployeeUpdateDto, EmployeeResponse } from './employees.types';

@Controller('api/haatza_employee')
@UseGuards(AdminAuthGuard)
@Throttle({ default: { limit: 10, ttl: seconds(60) } })
export class EmployeesController {
  constructor(
    @Inject(EmployeesService)
    private readonly employeesService: EmployeesService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ZodValidationPipe(employeeUpdateSchema))
  async updateEmployee(@Body() dto: EmployeeUpdateDto): Promise<EmployeeResponse> {
    return this.employeesService.updateEmployeeStatus(dto);
  }
}
