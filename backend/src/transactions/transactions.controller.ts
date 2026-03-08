import { Controller, Get, Query, Req, UseGuards,Param } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { QueryTransactionsDto } from './dto/query-transactions.dto';


import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('transactions')

@Controller('transactions')
export class TransactionsController {

  constructor(
    private transactionsService: TransactionsService
  ) {}

  @Get()
  async getTransactions(
    @Req() req,
    @Query() query: QueryTransactionsDto
  ) {

    const merchantId = req.user.merchantId;

    return this.transactionsService.findTransactions(
      merchantId,
      query
    );
  }

  @Get(':id')
async getTransactionDetail(
  @Param('id') id: string,
  @Req() req
) {

  return this.transactionsService.getTransactionDetail(
    id,
    req.user.merchantId
  );

}

}