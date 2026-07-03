import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { CrmService } from '../crm.service';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { UserRole } from '@prisma/client';

@Controller('admin/crm')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
export class AdminCrmController {
  constructor(private readonly crmService: CrmService) {}

  @Get('customers')
  getCustomers(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('search') search?: string,
  ) {
    return this.crmService.getCustomers(
      page ? parseInt(page, 10) : 1,
      limit ? parseInt(limit, 10) : 20,
      search
    );
  }

  @Get('customers/:id/insights')
  getCustomerInsights(@Param('id') id: string) {
    return this.crmService.getCustomerInsights(id);
  }
}
