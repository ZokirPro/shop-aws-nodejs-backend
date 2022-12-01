import { Body, Controller, Delete, Get, HttpStatus, Post, Put, Req } from '@nestjs/common';

// import { BasicAuthGuard, JwtAuthGuard } from '../auth';
import { OrderService } from '../order';
import { AppRequest, getUserIdFromRequest } from '../shared';

import { calculateCartTotal } from './models-rules';
import { CartService } from './services';

@Controller('api/profile/cart')
export class CartController {
  constructor(
    private cartService: CartService,
    private orderService: OrderService
  ) { }

  @Get('all')
  async getAllCartsList(@Req() req: AppRequest) {
    console.log("getAllCartsList controller invoked")
    const carts = await this.cartService.getAllCartsList();
    console.log(`All carts from DB: ${JSON.stringify(carts)}`);

    return {
      statusCode: HttpStatus.OK,
      message: 'OK',
      data: { carts },
    }
  }

  // @UseGuards(JwtAuthGuard)
  // @UseGuards(BasicAuthGuard)
  @Get('user/:id')
  async findUserCart(@Req() req: AppRequest) {
    const cart = await this.cartService.findOrCreateByUserId(getUserIdFromRequest(req));

    return {
      statusCode: HttpStatus.OK,
      message: 'OK',
      data: {
        cart,
        // total: calculateCartTotal(cart)
      },
    }
  }

  // @UseGuards(JwtAuthGuard)
  // @UseGuards(BasicAuthGuard)
  @Put('user/:id')
  async updateUserCart(@Req() req: AppRequest, @Body() body) { // TODO: validate body payload...
    const cart = await this.cartService.updateByUserId(getUserIdFromRequest(req), body)

    return {
      statusCode: HttpStatus.OK,
      message: 'OK',
      data: {
        cart,
        // total: calculateCartTotal(cart),
      }
    }
  }

  // @UseGuards(JwtAuthGuard)
  // @UseGuards(BasicAuthGuard)
  @Delete(':id')
  async clearUserCart(@Req() req: AppRequest) {
    const isRemoved = await this.cartService.removeByUserId(getUserIdFromRequest(req));

    return {
      statusCode: isRemoved ? HttpStatus.OK : HttpStatus.INTERNAL_SERVER_ERROR,
      message: isRemoved ? 'OK' : 'Error',
    }
  }

  // @UseGuards(JwtAuthGuard)
  // @UseGuards(BasicAuthGuard)
  // @Post('checkout')
  // async checkout(@Req() req: AppRequest, @Body() body) {
  //   const userId = getUserIdFromRequest(req);
  //   const cart = await this.cartService.findByUserId(userId);
  //
  //   if (!(cart && cart.items.length)) {
  //     const statusCode = HttpStatus.BAD_REQUEST;
  //     req.statusCode = statusCode
  //
  //     return {
  //       statusCode,
  //       message: 'Cart is empty',
  //     }
  //   }
  //
  //   const { id: cartId, items } = cart;
  //   const total = calculateCartTotal(cart);
  //   const order = this.orderService.create({
  //     ...body, // TODO: validate and pick only necessary data
  //     userId,
  //     cartId,
  //     items,
  //     total,
  //   });
  //   this.cartService.removeByUserId(userId);
  //
  //   return {
  //     statusCode: HttpStatus.OK,
  //     message: 'OK',
  //     data: { order }
  //   }
  // }
}
