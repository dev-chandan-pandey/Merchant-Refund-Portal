import {
  Body,
  Controller,
  Param,
  Post,
  Req,
  UseGuards
} from '@nestjs/common';

import { RefundsService } from './refunds.service';
import { CreateRefundDto } from './dto/create-refund.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('refunds')
export class RefundsController {

  constructor(
    private refundsService: RefundsService
  ) {}

  @Post(':transactionId')
  async createRefund(
    @Param('transactionId') transactionId: string,
    @Body() dto: CreateRefundDto,
    @Req() req
  ) {

    return this.refundsService.createRefund(
      req.user.merchantId,
      transactionId,
      dto.amount,
      dto.reason
    );
  }
}