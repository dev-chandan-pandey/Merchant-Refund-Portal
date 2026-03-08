import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';

import { Merchant, MerchantDocument } from '../merchants/schemas/merchant.schema';

@Injectable()
export class AuthService {

  constructor(
    @InjectModel(Merchant.name)
    private merchantModel: Model<MerchantDocument>,
    private jwtService: JwtService,
  ) {}

  async login(email: string, password: string) {

    const merchant = await this.merchantModel.findOne({ email });

    if (!merchant) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const valid = await bcrypt.compare(password, merchant.passwordHash);

    if (!valid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const token = this.jwtService.sign({
      merchantId: merchant._id,
      email: merchant.email,
    });

    return {
      success: true,
      data: {
        accessToken: token,
      },
    };
  }
}