import { Injectable } from '@nestjs/common';

import { v4 } from 'uuid';

import { UserModel } from '../models';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from '../../db/entities/users.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  public constructor(@InjectRepository(Users) private readonly repo: Repository<Users>) { }
  async getAll() {
    try {
      return await this.repo.find();
    } catch (e) {
      console.error(e);
      return null;
    }
  }

  async findOne(userId: string) {
    try {
      return await this.repo.findOneBy({
        id: userId,
      });
    } catch (e) {
      console.error(e);
      return null;
    }
  }

  async createOne({ name, password }: UserModel) {
    try {
      const id = v4(v4());
      const newUser = {
        id,
        name,
        password,
      };
      await this.repo.create(newUser);
      return newUser;
    } catch (e) {
      console.error(e);
      return false;
    }
  }

}
