import { Controller, Get, HttpStatus, Post, Req } from '@nestjs/common';
import { UsersService } from './services';
import { AppRequest } from '../shared';

@Controller('api/users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  async getAll(@Req() req: AppRequest) {
    const users = await this.usersService.getAll();

    return {
      statusCode: HttpStatus.OK,
      message: 'OK',
      data: { users },
    }
  }

  @Get(':id')
  async getById(@Req() req: AppRequest) {
    const user = await this.usersService.findOne(req.params.id);

    return {
      statusCode: HttpStatus.OK,
      message: 'OK',
      data: { user },
    }
  }

  @Post(':id')
  async createId(@Req() req: AppRequest) {
    const user = await this.usersService.createOne(req.body)

    return {
      statusCode: HttpStatus.OK,
      message: 'OK',
      data: { user },
    }
  }
}