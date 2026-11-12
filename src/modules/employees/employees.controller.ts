import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  UsePipes,
  UseGuards,
  Inject,
} from '@nestjs/common';
import { EmployeesService } from './employees.service';
import { AdminAuthGuard } from '../../common/guards/admin-auth.guard';
import { ZodValidationPipe } from '../../common/pipes/zod-validation.pipe';
import { employeeUpdateSchema } from '../user-master/user-master.schema';
import type { EmployeeUpdateDto } from '../user-master/user-master.types';

@Controller('api/haatza_employee')
@UseGuards(AdminAuthGuard)
export class EmployeesController {
  constructor(
    @Inject(EmployeesService)
    private readonly employeesService: EmployeesService
  ) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ZodValidationPipe(employeeUpdateSchema))
  async updateEmployeeStatus(@Body() dto: EmployeeUpdateDto) {
    return this.employeesService.updateEmployeeStatus(dto);
  }
}

